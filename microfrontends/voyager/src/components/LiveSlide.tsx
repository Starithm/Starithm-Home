import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { LAUNCH_UTC, ONE_LIGHT_DAY_UTC, positionAt } from '../lib/ephemeris';
import { awayAt, tripNowOrigin } from '../lib/solar-camera';
import { virtualNow, type Clock } from '../lib/time-travel';
import score from '../data/score-onsets.json';
import { BitRing } from './BitRing';
import { NoteTrack } from './NoteTrack';
import { SolarView } from './SolarView';
import {
  BigUnit, Credit, Crossed, DotCredit, DotWords, FinalCount, Frame, Kicker, Layer, LeftCol, LiveRow,
  CraftLine, CraftPhoto, LiveTag, Marker, MarkerLabel, PaleBlueDot, Readout, RecordCard, RightCol, Ring, Ripples, STAGE_H, STAGE_W, Sky, Zone,
  SlideTitle, Stage, TickLabel,
} from '../styled_components/LiveSlide.styled';

/* The event screen: everything that matters on one 16:9 slide, built to be screen-shared or
 * embedded in a deck. Live unless the page hands it a time-travel clock (lib/time-travel).
 * Keys: M toggles the note ripples, F toggles full screen, Space cues the score: press it as the
 * piano starts and the ripples restart from the piece's first note, in time with it. The ripples
 * always follow the piece's own note timings (data/score-onsets.json, from
 * scripts/midi-to-onsets.mjs), looping; Space again lets it run on from page load. */

const DAY = 86_400_000;
const DOT_MS = 7_000; // the Pale Blue Dot holds for 7 s after the crossing
const CELEBRATE_MS = 3_600_000; // then an hour of "24 hours" before counting up

const p2 = (n: number) => String(n).padStart(2, '0');
const plural = (n: number, w: string) => (n === 1 ? w : `${w}s`);
const num = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

function mulberry(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Voyager's apparent position on the sky relative to `ref`, in degrees: east to the left,
 * north up, as on a star chart. The ±40-day path is the annual parallax wobble from the
 * Horizons table: Earth's own orbit, seen from 173 AU. */
function skyOffset(t: number, ref: { raDeg: number; decDeg: number }) {
  const p = positionAt(t);
  return [-(p.raDeg - ref.raDeg) * Math.cos((ref.decDeg * Math.PI) / 180), -(p.decDeg - ref.decDeg)];
}

/* Static starfield, drawn once. Colours are literal because canvas can't read CSS tokens;
 * the ground is read from --surface-sunken so it matches the stage. */
function drawStars(el: HTMLCanvasElement) {
  const ctx = el.getContext('2d');
  if (!ctx) return;
  const rnd = mulberry(1977);
  ctx.fillStyle = getComputedStyle(el).getPropertyValue('--surface-sunken').trim() || 'black';
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  const tints = ['rgb(255,255,255)', 'rgb(255,241,220)', 'rgb(227,236,255)', 'rgb(231,223,221)'];
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * STAGE_W;
    const y = rnd() * STAGE_H;
    const m = rnd() ** 4;
    const r = 0.4 + m * 2.2;
    ctx.globalAlpha = 0.2 + m * 0.8;
    ctx.fillStyle = tints[Math.floor(rnd() * tints.length)];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    if (m > 0.75) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
      g.addColorStop(0, 'rgba(255,240,220,0.35)');
      g.addColorStop(1, 'rgba(255,240,220,0)');
      ctx.fillStyle = g;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(x, y, r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // a few bright stars with soft diffraction spikes
  for (const [x, y, s] of [[1700, 820, 1], [520, 980, 0.6], [1460, 210, 0.5]]) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, 70 * s);
    g.addColorStop(0, 'rgba(255,236,205,0.95)');
    g.addColorStop(0.15, 'rgba(255,220,180,0.35)');
    g.addColorStop(1, 'rgba(255,220,180,0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 70 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,236,205,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 130 * s, y);
    ctx.lineTo(x + 130 * s, y);
    ctx.moveTo(x, y - 130 * s);
    ctx.lineTo(x, y + 130 * s);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/* Stars streaming out of the centre: the sense of travel, not data. */
function useFlow(ref: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const el = ref.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const VX = 960;
    const VY = 500;
    const spawn = (s: { x: number; y: number; z: number }) => {
      s.x = -2.2 + Math.random() * 4.4;
      s.y = -1.6 + Math.random() * 3.2;
      return s;
    };
    const stars = Array.from({ length: 380 }, () => spawn({ x: 0, y: 0, z: Math.random() }));
    let last = performance.now();
    let raf = 0;
    const loop = (ts: number) => {
      const dt = Math.min(0.1, (ts - last) / 1000);
      last = ts;
      ctx.clearRect(0, 0, STAGE_W, STAGE_H);
      for (const s of stars) {
        s.z += 0.02 * dt;
        if (s.z > 1) {
          s.z = 0.02;
          spawn(s);
        }
        const k = 1 / (0.15 + s.z * 2.2);
        const px = VX + s.x * STAGE_W * 0.5 * k * 0.35;
        const py = VY + s.y * STAGE_H * 0.5 * k * 0.35;
        if (px < -10 || px > STAGE_W + 10 || py < -10 || py > STAGE_H + 10) continue;
        const near = 1 - s.z;
        ctx.globalAlpha = (0.12 + near * 0.6) * Math.min(1, s.z / 0.08);
        ctx.fillStyle = near > 0.85 ? 'rgb(255,255,255)' : 'rgb(201,193,210)';
        ctx.beginPath();
        ctx.arc(px, py, 0.5 + near * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ref]);
}

/* Voyager in a few strokes: the 3.7 m dish facing Earth, the bus behind it, the science boom
 * (up-left, scan platform at its end), the RTG boom (down-right, three power units) and the
 * 13 m magnetometer boom running off long and thin. */
function VoyagerLine() {
  return (
    <CraftLine viewBox="-40 -40 80 80" aria-hidden="true">
      <g fill="none" stroke="var(--foreground)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <line x1={4} y1={4} x2={40} y2={36} strokeWidth={0.8} opacity={0.7} />
        <line x1={2} y1={-2} x2={-22} y2={-26} />
        <rect x={-30} y={-34} width={10} height={8} rx={1.5} />
        <line x1={6} y1={6} x2={24} y2={20} />
        <rect x={12} y={10} width={5} height={7} rx={1} transform="rotate(-38 14.5 13.5)" />
        <rect x={17} y={14} width={5} height={7} rx={1} transform="rotate(-38 19.5 17.5)" />
        <rect x={22} y={18} width={5} height={7} rx={1} transform="rotate(-38 24.5 21.5)" />
        <path d="M-4 6 L6 6 L10 0 L6 -6 L-4 -6 Z" fill="var(--surface-sunken)" />
      </g>
      <ellipse cx={-6} cy={-2} rx={11} ry={17} transform="rotate(-20 -6 -2)" fill="var(--foreground)" fillOpacity={0.9} stroke="var(--foreground)" strokeWidth={1.2} />
      <circle cx={-6} cy={-2} r={2} fill="var(--starithm-golden-yellow)" />
    </CraftLine>
  );
}

/* How each note of the piece ripples. Only the score's timing is used (no pitches):
 *   the opening low B   one big, slow gold ring, like the struck bass
 *   every other note    a violet ring with a smaller, fainter gold ring inside it: tintinnabuli's two
 *                       voices sounding together
 *   within a phrase     rings reach a little further note by note, as Für Alina's phrases build,
 *                       and a phrase's first note is accented
 *   the rests           nothing: the screen breathes with the music */
interface RingSpec {
  gold: boolean;
  s: number; // final scale
  o: number; // starting opacity
  w: number; // border px
  ms: number;
}
const RIPPLE_PLAN: { at: number; rings: RingSpec[] }[] = (() => {
  const on = score.onsets;
  let k = 0;
  return on.map((at, i) => {
    if (i === 0) return { at, rings: [{ gold: true, s: 6.5, o: 0.9, w: 3, ms: 7000 }] };
    if (on[i] - on[i - 1] > 2000) k = 0;
    const first = k === 0;
    const reach = Math.min(5.4, 3.4 + 0.3 * k);
    k++;
    return {
      at,
      rings: [
        { gold: false, s: reach, o: first ? 0.95 : 0.75, w: first ? 3 : 2, ms: first ? 5200 : 4400 },
        { gold: true, s: reach * 0.62, o: 0.45, w: 1.5, ms: 3600 },
      ],
    };
  });
})();

interface Props {
  /** Time travel: null shows now. */
  clock: Clock | null;
  /** Overlays drawn on the frame, outside the scaled stage (the time-travel dock). */
  children?: ReactNode;
}

export const LiveSlide = forwardRef<HTMLElement, Props>(function LiveSlide({ clock, children }, frameRef) {
  const live = !clock;

  const [now, setNow] = useState(() => Date.now());
  const [notes, setNotes] = useState<(RingSpec & { id: string; born: number })[]>([]);
  const [ripplesOn, setRipplesOn] = useState(true);
  const [cueAt, setCueAt] = useState<number | null>(null);
  const [loadedAt] = useState(() => Date.now());
  // the ring of bits filling around Voyager; ?bits=0 hides it
  const showBits = new URLSearchParams(window.location.search).get('bits') !== '0';
  // notes travelling home to a track below Voyager; ?track=0 hides it
  const showTrack = new URLSearchParams(window.location.search).get('track') !== '0';
  // what sits in the crosshair: the NASA render by default; ?craft=line (drawn) or ?craft=point
  const craft = new URLSearchParams(window.location.search).get('craft') ?? 'photo';
  // ?view=3d: Voyager's path through the solar system, resting 10 s between trips to Earth and back (E starts one now)
  const solar = new URLSearchParams(window.location.search).get('view') === '3d';
  const [tripOrigin, setTripOrigin] = useState(() => Date.now());
  const [fit, setFit] = useState({ scale: 1, x: 0, y: 0 });
  const ownFrame = useRef<HTMLElement | null>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);
  const flowRef = useRef<HTMLCanvasElement>(null);
  useFlow(flowRef);

  useEffect(() => {
    if (starsRef.current) drawStars(starsRef.current);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  // Ripples on the piece's notes, looping from the cue (or page load). A 40 ms tick fires every
  // note it has crossed since the last tick, wrap-around included, so none is skipped.
  useEffect(() => {
    if (!ripplesOn) return;
    const origin = cueAt ?? loadedAt;
    const len = score.lengthMs;
    const pos = () => (((Date.now() - origin) % len) + len) % len;
    // start just before now, so a fresh cue still catches the opening note
    let last = pos() - 150;
    const id = setInterval(() => {
      const t = pos();
      const hit = (at: number) => (t >= last ? at > last && at <= t : at > last || at <= t);
      const born = Date.now();
      const fresh = RIPPLE_PLAN.filter((n) => hit(n.at)).flatMap((n) =>
        n.rings.map((r, j) => ({ ...r, id: `${born}-${n.at}-${j}`, born })),
      );
      last = t;
      if (fresh.length) setNotes((ns) => [...ns.filter((x) => born - x.born < x.ms), ...fresh]);
    }, 40);
    return () => clearInterval(id);
  }, [ripplesOn, cueAt, loadedAt]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'm' || e.key === 'M') setRipplesOn((on) => !on);
      if (e.key === 'e' || e.key === 'E') setTripOrigin(tripNowOrigin(Date.now()));
      if (e.key === ' ' && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        setCueAt((at) => (at == null ? Date.now() : null));
      }
      if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen();
        else ownFrame.current?.requestFullscreen?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // scale the 1920×1080 stage to fit the frame, centred
  useLayoutEffect(() => {
    const el = ownFrame.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scale = Math.min(width / STAGE_W, height / STAGE_H) || 1;
      setFit({ scale, x: (width - STAGE_W * scale) / 2, y: (height - STAGE_H * scale) / 2 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const t = virtualNow(clock, now);
  const d = t - ONE_LIGHT_DAY_UTC;
  const phase = d < 0 ? 'before' : d < CELEBRATE_MS ? 'crossing' : 'after';
  const pos = positionAt(t);
  const lt = Math.floor(pos.lightSeconds);
  const rem = Math.max(0, Math.ceil(-d / 1000));

  const countdown =
    rem >= 86_400
      ? [
          { n: Math.floor(rem / 86_400), u: plural(Math.floor(rem / 86_400), 'day') },
          { n: p2(Math.floor((rem % 86_400) / 3600)), u: plural(Math.floor((rem % 86_400) / 3600), 'hour') },
          { n: p2(Math.floor((rem % 3600) / 60)), u: 'min' },
        ]
      : [
          { n: p2(Math.floor(rem / 3600)), u: 'h' },
          { n: p2(Math.floor((rem % 3600) / 60)), u: 'min' },
          { n: p2(rem % 60), u: 's' },
        ];
  const since = Math.max(0, Math.floor(d / 1000));
  const bd = Math.floor(since / 86_400);
  const bh = Math.floor((since % 86_400) / 3600);
  const bm = Math.floor((since % 3600) / 60);
  const beyond = bd >= 1
    ? [{ n: bd, u: plural(bd, 'day') }, { n: bh, u: plural(bh, 'hour') }]
    : [{ n: bh, u: plural(bh, 'hour') }, { n: p2(bm), u: 'min' }];

  const sent = new Date(t - pos.lightSeconds * 1000);
  const cur = new Date(t);
  const dayKey = (x: Date) => x.toDateString();
  const sentDay = dayKey(sent) === dayKey(cur)
    ? 'today'
    : dayKey(sent) === dayKey(new Date(t - DAY))
      ? 'yesterday'
      : sent.toLocaleDateString([], { weekday: 'long' });
  // the viewer's own clock, labelled, since the live row above is UTC
  const zone = new Intl.DateTimeFormat([], { timeZoneName: 'short' }).formatToParts(sent).find((x) => x.type === 'timeZoneName')?.value;
  const days = Math.floor((t - LAUNCH_UTC) / DAY);
  const years = Math.floor((t - LAUNCH_UTC) / (365.25 * DAY));

  // The sky path: ±40 days around now, scaled into the middle of the slide with Voyager at the
  // stage centre (960, 540) and its label reaching right. Recomputed once a minute; it moves that slowly.
  const minute = Math.floor(t / 60_000);
  const sky = useMemo(() => {
    const ref = positionAt(t);
    const raw = Array.from({ length: 81 }, (_, i) => skyOffset(t + (i - 40) * DAY, ref));
    const xs = raw.map((p) => p[0]);
    const ys = raw.map((p) => p[1]);
    const s = Math.min(740 / Math.max(1e-9, Math.max(...xs) - Math.min(...xs)), 640 / Math.max(1e-9, Math.max(...ys) - Math.min(...ys)));
    const P = (o: number[]) => [960 + s * o[0], 540 + s * o[1]];
    const pts = raw.map(P);
    const tick = (k: number, label: string, gold = false) => {
      const [x, y] = P(skyOffset(t + k * DAY, ref));
      return { x, y, label, gold, r: gold ? 10 : 7, before: k < 0 && !gold };
    };
    const ticks = [tick(-40, '40 days ago'), tick(-20, '20 days ago'), tick(20, 'in 20 days'), tick(40, 'in 40 days')];
    const toCross = (ONE_LIGHT_DAY_UTC - t) / DAY;
    if (toCross > 2 && toCross <= 40) {
      if (Math.abs(toCross - 20) < 6) ticks.splice(2, 1);
      ticks.push(tick(toCross, '18 Nov · one light-day', true));
    }
    return { pts, d: 'M' + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L'), ticks };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute]);

  // a ghost of Voyager sweeping the 80-day path every 24 s: the time-lapse
  const g = ((now / 1000) % 24) / 24 * 80;
  const gA = sky.pts[Math.floor(g)];
  const gB = sky.pts[Math.min(80, Math.floor(g) + 1)];
  const ghost = [gA[0] + (gB[0] - gA[0]) * (g % 1), gA[1] + (gB[1] - gA[1]) * (g % 1)];
  const [vx, vy] = sky.pts[40];

  const ripples = phase === 'crossing'
    ? [0, 1, 2].map((i) => <Ring key={`g${Math.floor(now / 1600) - i}`} $gold />)
    : notes.map((r) => (
        <Ring key={r.id} $gold={r.gold} $w={r.w} $ms={r.ms} style={{ '--s': r.s, '--o': r.o } as React.CSSProperties} />
      ));

  return (
    <Frame
      ref={(el) => {
        ownFrame.current = el;
        if (typeof frameRef === 'function') frameRef(el);
        else if (frameRef) frameRef.current = el;
      }}
      aria-label="Voyager 1, live: one light-day from Earth"
    >
      <Stage style={{ transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.scale})` }}>
        <Sky>
          <canvas ref={starsRef} width={STAGE_W} height={STAGE_H} />
          <canvas ref={flowRef} width={STAGE_W} height={STAGE_H} />
        </Sky>

        <Layer>
          {solar && <SolarView at={t} origin={tripOrigin} />}
          {!solar && (
          <>
          <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
            <path d={sky.d} fill="none" stroke="var(--starithm-golden-yellow)" strokeOpacity={0.55} strokeWidth={2} strokeDasharray="10 9" />
            {sky.ticks.map((k) => (
              <circle key={k.label} cx={k.x} cy={k.y} r={k.r} fill="none" stroke="var(--starithm-golden-yellow)" strokeOpacity={k.gold ? 1 : 0.85} strokeWidth={2} />
            ))}
            <circle cx={ghost[0]} cy={ghost[1]} r={5} fill="var(--accent-text)" opacity={0.85} />
          </svg>
          {sky.ticks.map((k) => (
            <TickLabel
              key={k.label}
              $gold={k.gold}
              style={
                k.before
                  ? { left: k.x - 20, top: k.y - 14, transform: 'translateX(-100%)' }
                  : { left: k.x, top: k.y + (k.gold ? 26 : 22), transform: 'translateX(-50%)' }
              }
            >
              {k.label}
            </TickLabel>
          ))}
          </>
          )}

          {/* the marker and note track sit on Voyager; they step aside while the 3D camera visits Earth */}
          <div style={{ position: 'absolute', inset: 0, opacity: solar && awayAt(now, tripOrigin) > 0 ? 0 : 1, transition: 'opacity 0.8s' }}>

          <Marker style={{ left: vx, top: vy }} $gap={craft === 'photo' || craft === 'line' ? 44 : 20}>
            <Ripples>{ripples}</Ripples>
            {showBits && ripplesOn && phase !== 'crossing' && <BitRing origin={cueAt ?? loadedAt} />}
            <i /><i /><i /><i />
            {craft === 'photo' ? (
              <CraftPhoto src="/voyager/voyager-1-craft-pia17049.jpg" alt="" />
            ) : craft === 'line' ? (
              <VoyagerLine />
            ) : (
              <b />
            )}
            {/* clear of the bit ring (outer radius 90) when it is showing */}
            <MarkerLabel style={showBits ? { left: 108 } : undefined}>
              <div>Voyager 1</div>
              <div>now, in Ophiuchus</div>
            </MarkerLabel>
          </Marker>
          {showTrack && ripplesOn && phase !== 'crossing' && <NoteTrack origin={cueAt ?? loadedAt} vx={vx} vy={vy} />}
          </div>
        </Layer>

        <SlideTitle>
          Voyager 1 <span>— One Light-Day from Earth</span>
        </SlideTitle>

        <LeftCol>
          {phase === 'before' && (
            <>
              <Kicker>Until one light-day</Kicker>
              {countdown.map((c) => (
                <BigUnit key={c.u}>
                  <span>{c.n}</span>
                  <span>{c.u}</span>
                </BigUnit>
              ))}
            </>
          )}
          {phase === 'crossing' && (
            <>
              <Crossed>24 hours</Crossed>
              <div>Voyager 1 is now one light-day away.</div>
            </>
          )}
          {phase === 'after' && (
            <>
              <Kicker $gold>Beyond one light-day for</Kicker>
              {beyond.map((c) => (
                <BigUnit key={c.u} $gold>
                  <span>{c.n}</span>
                  <span>{c.u}</span>
                </BigUnit>
              ))}
            </>
          )}
          <Readout $size={56} $top={44}>
            <div>In flight</div>
            <div>{num.format(days)}<small>days</small></div>
            <div>{years} years · on its original 1977 hardware</div>
          </Readout>
        </LeftCol>

        <RightCol>
          <LiveRow>
            <LiveTag $live={live}>{live ? 'LIVE' : 'PREVIEW'}</LiveTag>
            <span>
              {cur.getUTCDate()} {cur.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })} {cur.getUTCFullYear()} ·{' '}
              {p2(cur.getUTCHours())}:{p2(cur.getUTCMinutes())}:{p2(cur.getUTCSeconds())} UTC
            </span>
          </LiveRow>
          <Readout>
            <div>Signal's time to reach us</div>
            <div>{p2(Math.floor(lt / 3600))}h {p2(Math.floor((lt % 3600) / 60))}m {p2(lt % 60)}s</div>
          </Readout>
          <Readout>
            <div>Light left Voyager{zone && <Zone> · {zone}</Zone>}</div>
            <div>{sentDay}, {sent.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </Readout>
          <Readout $size={40}>
            <div>Distance from Earth</div>
            <div>{num.format(pos.earthKm)} km</div>
          </Readout>
          <Readout $size={40}>
            <div>Distance from Sun</div>
            <div>{num.format(pos.sunKm)} km</div>
          </Readout>
        </RightCol>

        <RecordCard>
          <img src="/voyager/golden-record-disc-pia14113.jpg" alt="The Golden Record carried by Voyager 1" />
          <div>
            <div>The Golden Record</div>
            <div>Greetings in 55 languages, and music from Bach to Chuck Berry, on board.</div>
          </div>
        </RecordCard>
        <Credit>JPL Horizons · NASA DSN Now</Credit>

        {phase === 'before' && rem <= 10 && (
          <FinalCount>
            <div>Voyager 1 reaches one light-day in</div>
            <div>{rem}</div>
          </FinalCount>
        )}

        {phase === 'crossing' && d < DOT_MS && (
          <PaleBlueDot>
            <img src="/voyager/pale-blue-dot-pia23645.jpg" alt="Pale Blue Dot: Earth as a speck of light in a sunbeam, photographed by Voyager 1 in 1990" />
            <DotWords>
              <div>In 1990, Voyager 1 looked back and saw Earth as a tiny dot in a sunbeam.</div>
              <div>Now its light takes one full day to reach that dot.</div>
            </DotWords>
            <DotCredit>Pale Blue Dot, 1990 · NASA/JPL-Caltech</DotCredit>
          </PaleBlueDot>
        )}
      </Stage>
      {children}
    </Frame>
  );
});
