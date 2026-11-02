import { useEffect, useRef } from 'react';
import score from '../data/score-onsets.json';

/* Each note of the piece travels home as light: it leaves Voyager, lands on a track below it just as
 * the piano plays it, then drifts left and fades, so the rests show as gaps. Timing only (gold marks
 * the first note of each phrase); the piece's pitches are not drawn. */

const W = 1920;
const H = 1080;
const TRAVEL_MS = 900; // Voyager to the track; lands on the note
const X0 = 640; // where the track fades out
const EX = 1240; // where notes land
const EY = 860;
const SPEED = 0.036; // px per ms drifting left: about 17 s of music on the track

const onsets = score.onsets;
const phraseFirst = onsets.map((at, i) => i === 0 || at - onsets[i - 1] > 2000);

function token(el: Element, name: string, fallback: string) {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

/** A token (hex or rgb()) at an alpha, in a form canvas accepts everywhere. */
function rgba(color: string, a: number) {
  const hex = color.match(/^#([0-9a-f]{6})/i);
  const [r, g, b] = hex
    ? [0, 2, 4].map((k) => parseInt(hex[1].slice(k, k + 2), 16))
    : (color.match(/\d+(\.\d+)?/g) ?? ['255', '255', '255']).slice(0, 3).map(Number);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
}

export function NoteTrack({ origin, vx, vy }: { origin: number; vx: number; vy: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const from = useRef({ origin, vx, vy });
  from.current = { origin, vx, vy };

  useEffect(() => {
    const el = ref.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const violet = token(el, '--accent-text', 'rgb(202,144,250)');
    const gold = token(el, '--starithm-golden-yellow', 'rgb(255,195,50)');
    const line = token(el, '--text-muted', 'rgb(169,159,178)');
    const glow = token(el, '--foreground', 'rgb(255,250,244)');
    const len = score.lengthMs;
    let raf = 0;

    const draw = () => {
      const { origin: o, vx: sx, vy: sy } = from.current;
      const t = Date.now();
      ctx.clearRect(0, 0, W, H);

      // the track, fading in from the left, and the way home from Voyager
      const lg = ctx.createLinearGradient(X0, 0, EX, 0);
      lg.addColorStop(0, rgba(line, 0));
      lg.addColorStop(0.3, rgba(line, 0.3));
      lg.addColorStop(1, rgba(line, 0.5));
      ctx.strokeStyle = lg;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(X0, EY);
      ctx.lineTo(EX, EY);
      ctx.stroke();
      ctx.strokeStyle = rgba(violet, 0.5);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(EX, EY - 22);
      ctx.lineTo(EX, EY + 22);
      ctx.stroke();
      ctx.strokeStyle = rgba(violet, 0.2);
      ctx.setLineDash([2, 9]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(EX, EY);
      ctx.stroke();
      ctx.setLineDash([]);

      // this loop of the piece and its neighbours, so notes cross the wrap smoothly
      const cycle = Math.floor((t - o) / len);
      let flash = 0;
      for (let c = cycle - 1; c <= cycle + 1; c++) {
        onsets.forEach((at, i) => {
          const land = o + c * len + at;
          if (land < o) return; // nothing before the cue
          const age = t - land;
          const col = phraseFirst[i] ? gold : violet;
          if (age < -TRAVEL_MS || age > (EX - X0) / SPEED) return;
          if (age < 0) {
            // in flight: a short streak of light
            const a = 1 + age / TRAVEL_MS;
            const e = a * a * (3 - 2 * a);
            const e0 = Math.max(0, e - 0.12);
            const px = sx + (EX - sx) * e;
            const py = sy + (EY - sy) * e;
            const tx = sx + (EX - sx) * e0;
            const ty = sy + (EY - sy) * e0;
            const sg = ctx.createLinearGradient(tx, ty, px, py);
            sg.addColorStop(0, rgba(col, 0));
            sg.addColorStop(1, rgba(col, 0.9));
            ctx.strokeStyle = sg;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(px, py);
            ctx.stroke();
            const hg = ctx.createRadialGradient(px, py, 0, px, py, 16);
            hg.addColorStop(0, rgba(glow, 1));
            hg.addColorStop(0.3, rgba(col, 0.5));
            hg.addColorStop(1, rgba(col, 0));
            ctx.fillStyle = hg;
            ctx.beginPath();
            ctx.arc(px, py, 16, 0, Math.PI * 2);
            ctx.fill();
            return;
          }
          // on the track: rings brightly as it lands, then drifts left and fades
          flash = Math.max(flash, Math.exp(-age / 500));
          const x = EX - age * SPEED;
          const fade = Math.min(1, (x - X0) / 160) * (0.55 + 0.45 * Math.exp(-age / 1500));
          if (fade <= 0) return;
          const ring = Math.exp(-age / 900);
          const fl = ctx.createLinearGradient(x, EY - 40, x, EY + 40);
          fl.addColorStop(0, rgba(col, 0));
          fl.addColorStop(0.5, rgba(col, (0.25 + 0.55 * ring) * fade));
          fl.addColorStop(1, rgba(col, 0));
          ctx.strokeStyle = fl;
          ctx.lineWidth = 1.5 + 2 * ring;
          ctx.beginPath();
          ctx.moveTo(x, EY - 40);
          ctx.lineTo(x, EY + 40);
          ctx.stroke();
          const r = (phraseFirst[i] ? 5 : 4) * (2.4 + 2 * ring);
          const ng = ctx.createRadialGradient(x, EY, 0, x, EY, r);
          ng.addColorStop(0, rgba(glow, fade));
          ng.addColorStop(0.35, rgba(col, 0.8 * fade));
          ng.addColorStop(1, rgba(col, 0));
          ctx.fillStyle = ng;
          ctx.beginPath();
          ctx.arc(x, EY, r, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      if (flash > 0.02) {
        const eg = ctx.createRadialGradient(EX, EY, 0, EX, EY, 60);
        eg.addColorStop(0, rgba(glow, 0.5 * flash));
        eg.addColorStop(1, rgba(violet, 0));
        ctx.fillStyle = eg;
        ctx.beginPath();
        ctx.arc(EX, EY, 60, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: W, height: H, pointerEvents: 'none' }}
    />
  );
}
