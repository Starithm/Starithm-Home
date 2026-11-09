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
  Caption, Fall, Scale, ScaleLabel, SceneFrame, StationCard, StationRow, StreamLabel,
} from '../styled_components/Stage.styled';

/* Stage scene 2: hearing Voyager. The radio signal falls like water, faint noise everywhere and one
 * bright stream where Voyager's carrier is (160 drops a second, its data rate). Each note of the piece
 * spills a burst into the stream. Above it, the three Deep Space Network complexes, live from DSN Now;
 * below it, how far that signal has come, to scale. Space cues the score, as on the slide. */

const W = STAGE_W;
const H = STAGE_H;
const TOP = 345; // the lip of the falls, under the station cards and the stream's name
const FLOOR = 880; // where the water fades out, above the scale
const COUNTRY: Record<StationName, string> = { Goldstone: 'California, USA', Madrid: 'Spain', Canberra: 'Australia' };
const onsets = score.onsets;
const phraseFirst = onsets.map((at, i) => i === 0 || at - onsets[i - 1] > 2000);

interface Drop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  a: number;
  kind: 0 | 1 | 2 | 3; // noise, carrier, note (violet), phrase start (gold)
  spray?: boolean; // thrown back up where the stream lands
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
    const violet = token(el, '--accent-text', 'rgb(202,144,250)');
    const gold = token(el, '--starithm-golden-yellow', 'rgb(255,195,50)');
    const glow = token(el, '--foreground', 'rgb(255,250,244)');
    const colour = [noise, glow, violet, gold];
    const drops: Drop[] = [];
    const spawn = (x: number, kind: Drop['kind'], a: number, vy = 20 + Math.random() * 120) =>
      drops.push({ x, y: TOP + Math.random() * 6, vx: 0, vy, g: 140 + Math.random() * 180, a, kind });
    let last = performance.now();
    let lastWall = Date.now();
    const debt = { noise: 0, carrier: 0 };
    let raf = 0;
    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, W, H);

    const loop = (ts: number) => {
      const dt = Math.min(0.1, (ts - last) / 1000);
      last = ts;
      const wall = Date.now();
      // the carrier drifts a little, as Doppler does
      const cx = W / 2 + Math.sin(wall / 9000) * 36;

      // noise everywhere, Voyager's 160 a second in the stream
      debt.noise += dt * 1700;
      debt.carrier += dt * 160;
      for (; debt.noise >= 1; debt.noise--) {
        // the noise falls in strands, thicker in some places than others, slowly shifting
        const x = 60 + Math.random() * (W - 120);
        const w = (0.5 + 0.5 * Math.sin(x * 0.031 + wall / 7000)) * (0.5 + 0.5 * Math.sin(x * 0.0127 + 2 - wall / 11000));
        if (Math.random() > 0.15 + 0.85 * Math.sqrt(w)) continue;
        spawn(x, 0, 0.08 + Math.random() ** 3 * 0.5 + 0.25 * w);
      }
      for (; debt.carrier >= 1; debt.carrier--) spawn(cx + (Math.random() - 0.5) * 8, 1, 0.5 + Math.random() * 0.4);
      // each note the piano plays spills a burst into the stream
      const o = originRef.current;
      const len = score.lengthMs;
      const loopN = Math.floor((wall - o) / len);
      for (let c = loopN - 1; c <= loopN; c++) {
        onsets.forEach((on, i) => {
          const at = o + c * len + on;
          if (at < o || at <= lastWall || at > wall) return;
          const n = phraseFirst[i] ? 90 : 55;
          for (let k = 0; k < n; k++) {
            const spread = (Math.random() - 0.5) * (phraseFirst[i] ? 150 : 100);
            spawn(cx + spread * Math.random(), phraseFirst[i] ? 3 : 2, 0.6 + Math.random() * 0.4, 60 + Math.random() * 160);
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
        d.x += d.vx * dt + (Math.random() - 0.5) * 0.6;
        // the stream and the notes land in spray; the noise just thins out
        if (!d.spray && d.kind > 0 && d.y > FLOOR - 70 && Math.random() < 0.35) {
          d.spray = true;
          d.vy = -(60 + Math.random() * 160);
          d.vx = (Math.random() - 0.5) * 260;
          d.g = 420;
          d.a *= 0.6;
        }
        if (d.y > FLOOR || (d.spray && d.vy > 0 && d.y > FLOOR - 40)) {
          drops[i] = drops[drops.length - 1];
          drops.pop();
          continue;
        }
        const fade = d.spray ? 0.7 : Math.min(1, (FLOOR - d.y) / 140, (d.y - TOP + 4) / 30);
        const streak = 4 + d.vy * 0.06;
        ctx.strokeStyle = rgba(colour[d.kind], d.a * fade);
        ctx.lineWidth = d.kind === 0 ? 1.2 : 2.2;
        ctx.beginPath();
        if (d.spray) {
          ctx.moveTo(d.x - d.vx * 0.02, d.y - d.vy * 0.02);
        } else {
          ctx.moveTo(d.x, d.y - streak);
        }
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }
      // the lip: where the stream comes over
      const lip = ctx.createRadialGradient(cx, TOP, 0, cx, TOP, 70);
      lip.addColorStop(0, rgba(glow, 0.35));
      lip.addColorStop(1, rgba(violet, 0));
      ctx.fillStyle = lip;
      ctx.fillRect(cx - 70, TOP - 70, 140, 140);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ref]);
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

        <StreamLabel style={{ left: W / 2 }}>Voyager 1 · 8.4 GHz</StreamLabel>

        <Caption>A 23-watt whisper, heard from {(pos.earthKm / 1e9).toFixed(1)} billion km away.</Caption>

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
