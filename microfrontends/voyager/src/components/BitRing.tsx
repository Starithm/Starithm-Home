import { useEffect, useRef } from 'react';
import score from '../data/score-onsets.json';
import { BEAT_MS, BITS_PER_NOTE } from '../lib/signal-music';

/* Voyager's signal turning into music, drawn around the spacecraft: one tick per bit, lighting at
 * the real downlink rate, so the ring fills once per beat. When a full beat of bits has arrived and
 * the piece has a note there, the ring flashes and lets go as that note's ripple; in the rests the
 * bits keep coming and the ring quietly empties. It shows how much Voyager sends, not what: the
 * bits themselves are not public, so no 0s and 1s are drawn. */

const SIZE = 400; // canvas px, centred on Voyager
export const R_IN = 165; // just outside the spacecraft photo
export const R_OUT = 180;
const onsets = new Set(score.onsets);

function token(el: Element, name: string, fallback: string) {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

export function BitRing({ origin }: { origin: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const originRef = useRef(origin);
  originRef.current = origin;

  useEffect(() => {
    const el = ref.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const teal = token(el, '--starithm-nebula-teal', 'rgb(79,224,207)');
    const violet = token(el, '--accent-text', 'rgb(202,144,250)');
    const len = score.lengthMs;
    const c = SIZE / 2;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const t = (((Date.now() - originRef.current) % len) + len) % len;
      const into = t % BEAT_MS; // ms into this beat's worth of bits
      const lit = Math.floor((into / BEAT_MS) * BITS_PER_NOTE);
      const beatStart = t - into;
      // did a note just sound at the start of this beat? (onsets sit on whole beats)
      const sang = onsets.has(Math.round(beatStart));
      const flash = sang ? Math.max(0, 1 - into / 350) : 0;
      // will these bits become a note at the end of the beat?
      const singing = onsets.has(Math.round(beatStart + BEAT_MS) % len);

      for (let i = 0; i < BITS_PER_NOTE; i++) {
        const a = -Math.PI / 2 + (i / BITS_PER_NOTE) * Math.PI * 2;
        const on = i < lit;
        if (!on && flash === 0) {
          ctx.globalAlpha = 0.14;
          ctx.strokeStyle = teal;
        } else if (flash > 0 && !on) {
          ctx.globalAlpha = 0.85 * flash; // the full ring letting go
          ctx.strokeStyle = violet;
        } else {
          const fresh = Math.max(0, 1 - (lit - i) / 12); // the newest bits glow brightest
          ctx.globalAlpha = (singing ? 0.55 : 0.32) + 0.45 * fresh;
          ctx.strokeStyle = teal;
        }
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * R_IN, c + Math.sin(a) * R_IN);
        ctx.lineTo(c + Math.cos(a) * R_OUT, c + Math.sin(a) * R_OUT);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      width={SIZE}
      height={SIZE}
      aria-hidden="true"
      style={{ position: 'absolute', left: -SIZE / 2, top: -SIZE / 2, width: SIZE, height: SIZE, maxWidth: 'none', pointerEvents: 'none' }}
    />
  );
}
