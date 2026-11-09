import { useEffect, useRef, useState } from 'react';
import score from '../data/score-onsets.json';
import { rgba, token } from '../lib/canvas-color';
import { useDsn } from '../lib/dsn';
import { AU_KM, HELIOPAUSE_AU, LIGHT_DAY_KM, positionAt } from '../lib/ephemeris';
import { elevationAt, HORIZON_DEG, STATIONS, type StationName } from '../lib/sky-elevation';
import { useNow } from '../lib/use-now';
import { useStageFit } from '../lib/use-stage-fit';
import { SlideTitle, Stage, STAGE_H, STAGE_W } from '../styled_components/LiveSlide.styled';
import {
  Caption, Fall, Scale, ScaleLabel, SceneFrame, StationCard, StationRow,
} from '../styled_components/Stage.styled';

/* Stage scene 2: hearing Voyager. The radio noise the dishes listen through falls like water across the
 * whole screen, in strands that slowly shift; each note of the piece lights up one strand. Over it, the
 * three Deep Space Network complexes, live from DSN Now, and how far the signal has come, to scale.
 * Space cues the score, as on the slide. */

const W = STAGE_W;
const H = STAGE_H;
const COUNTRY: Record<StationName, string> = { Goldstone: 'California, USA', Madrid: 'Spain', Canberra: 'Australia' };
const onsets = score.onsets;
const phraseFirst = onsets.map((at, i) => i === 0 || at - onsets[i - 1] > 2000);

interface Drop {
  x: number;
  y: number;
  vy: number;
  g: number;
  a: number;
  kind: 0 | 1 | 2; // noise, a note, a phrase's first note
}

function useWaterfall(ref: React.RefObject<HTMLCanvasElement>, origin: number) {
  const originRef = useRef(origin);
  originRef.current = origin;
  useEffect(() => {
    const el = ref.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const ground = token(el, '--surface-sunken', 'rgb(10,8,16)');
    const noise = token(el, '--starithm-nebula-teal', 'rgb(80,220,200)');
    const glow = token(el, '--foreground', 'rgb(255,250,244)');
    const colour = [noise, noise, glow];
    const drops: Drop[] = [];
    const spawn = (x: number, kind: Drop['kind'], a: number, vy = 20 + Math.random() * 120) =>
      drops.push({ x, y: -20 - Math.random() * 30, vy, g: 140 + Math.random() * 180, a, kind });
    let last = performance.now();
    let lastWall = Date.now();
    let debt = 0;
    let raf = 0;
    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, W, H);

    const loop = (ts: number) => {
      const dt = Math.min(0.1, (ts - last) / 1000);
      last = ts;
      const wall = Date.now();

      debt += dt * 2600;
      for (; debt >= 1; debt--) {
        // strands, thicker in some places than others, slowly shifting
        const x = Math.random() * W;
        const w = (0.5 + 0.5 * Math.sin(x * 0.031 + wall / 7000)) * (0.5 + 0.5 * Math.sin(x * 0.0127 + 2 - wall / 11000));
        if (Math.random() > 0.15 + 0.85 * Math.sqrt(w)) continue;
        spawn(x, 0, 0.08 + Math.random() ** 3 * 0.5 + 0.25 * w);
      }
      // each note the piano plays lights up one strand
      const o = originRef.current;
      const len = score.lengthMs;
      const loopN = Math.floor((wall - o) / len);
      for (let c = loopN - 1; c <= loopN; c++) {
        onsets.forEach((on, i) => {
          const at = o + c * len + on;
          if (at < o || at <= lastWall || at > wall) return;
          const x = 80 + Math.random() * (W - 160);
          for (let k = 0; k < (phraseFirst[i] ? 70 : 45); k++) {
            spawn(x + (Math.random() - 0.5) * 22, phraseFirst[i] ? 2 : 1, 0.55 + Math.random() * 0.4, 40 + Math.random() * 200);
          }
        });
      }
      lastWall = wall;

      // a short trail: each frame darkens what was drawn before
      ctx.fillStyle = rgba(ground, 0.32);
      ctx.fillRect(0, 0, W, H);
      ctx.lineCap = 'round';
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.vy += d.g * dt;
        d.y += d.vy * dt;
        d.x += (Math.random() - 0.5) * 0.6;
        if (d.y > H + 40) {
          drops[i] = drops[drops.length - 1];
          drops.pop();
          continue;
        }
        const streak = 4 + d.vy * 0.06;
        ctx.strokeStyle = rgba(colour[d.kind], d.a);
        ctx.lineWidth = d.kind === 0 ? 1.2 : 2;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - streak);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ref]);
}

/** The caption, typed out a letter at a time once the scene has settled. */
function Typed({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      id = setInterval(() => setN((k) => (k >= text.length ? k : k + 1)), 75);
    }, 1500);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [text.length]);
  return (
    <Caption>
      {text.slice(0, n)}
      <i />
      {/* the untyped rest holds its place, so the line stays put as it types */}
      <span style={{ visibility: 'hidden' }}>{text.slice(n)}</span>
    </Caption>
  );
}

const SCALE_X0 = 140;
const SCALE_X1 = 1780;
const SCALE_AU = 180;
const ax = (au: number) => SCALE_X0 + (au / SCALE_AU) * (SCALE_X1 - SCALE_X0);
const PLANETS: [string, number][] = [['Earth', 1], ['Jupiter', 5.2], ['Saturn', 9.5], ['Uranus', 19.2], ['Neptune', 30.1]];
const LIGHT_DAY_AU = LIGHT_DAY_KM / AU_KM;

export function SignalScene() {
  const { ref, transform } = useStageFit<HTMLElement>();
  const fallRef = useRef<HTMLCanvasElement>(null);
  const [cueAt, setCueAt] = useState<number | null>(null);
  const [loadedAt] = useState(() => Date.now());
  useWaterfall(fallRef, cueAt ?? loadedAt);
  const now = useNow(1000);
  const dsn = useDsn();
  const link = dsn.voyager?.down?.active ? dsn.voyager : null;
  const pos = positionAt(now);
  const sunAu = pos.sunKm / AU_KM;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== ' ') return;
      e.preventDefault();
      setCueAt((at) => (at == null ? Date.now() : null));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <SceneFrame ref={ref} aria-label="Hearing Voyager 1: the Deep Space Network, live">
      <Stage style={{ transform }}>
        <Fall ref={fallRef} width={W} height={H} />

        <SlideTitle>
          Hearing Voyager 1 <span>— the Deep Space Network</span>
        </SlideTitle>

        <StationRow>
          {(Object.keys(STATIONS) as StationName[]).map((name) => {
            const on = link?.station === name;
            const el = Math.round(elevationAt(now, name));
            return (
              <StationCard key={name} $on={on}>
                <div>{name}</div>
                <div>{COUNTRY[name]}</div>
                <div>
                  {on
                    ? <>{link.dish} is listening to Voyager 1 · <b>{link.down!.bps} bit/s</b></>
                    : el >= HORIZON_DEG
                      ? `Voyager 1 is ${el}° above the horizon`
                      : 'Voyager 1 is below the horizon'}
                </div>
              </StationCard>
            );
          })}
        </StationRow>

        <Typed text={`A 23-watt whisper, heard from ${(pos.earthKm / 1e9).toFixed(1)} billion km away.`} />

        <Scale viewBox={`0 0 ${W} 200`} aria-hidden="true">
          <line x1={SCALE_X0} y1={100} x2={SCALE_X1} y2={100} />
          <circle cx={ax(0)} cy={100} r={10} className="sun" />
          {PLANETS.map(([n, au]) => <line key={n} x1={ax(au)} y1={90} x2={ax(au)} y2={110} />)}
          <line x1={ax(HELIOPAUSE_AU)} y1={80} x2={ax(HELIOPAUSE_AU)} y2={120} />
          <line x1={ax(LIGHT_DAY_AU)} y1={78} x2={ax(LIGHT_DAY_AU)} y2={122} className="gold" />
          <circle cx={ax(sunAu)} cy={100} r={9} className="voyager" />
        </Scale>
        <ScaleLabel style={{ left: ax(0), top: 1000 }}>Sun</ScaleLabel>
        <ScaleLabel style={{ left: ax(15), top: 1000 }}>the planets</ScaleLabel>
        <ScaleLabel style={{ left: ax(HELIOPAUSE_AU), top: 1000 }}>Interstellar space · 2012</ScaleLabel>
        <ScaleLabel $tone="accent" $align="right" style={{ left: ax(sunAu) - 6, top: 918 }}>Voyager 1</ScaleLabel>
        <ScaleLabel $tone="gold" $align="left" style={{ left: ax(LIGHT_DAY_AU) + 6, top: 1000 }}>one light-day</ScaleLabel>
        <ScaleLabel $tone="muted" $align="left" style={{ left: ax(0) - 10, top: 918 }}>To scale, from the Sun</ScaleLabel>
      </Stage>
    </SceneFrame>
  );
}
