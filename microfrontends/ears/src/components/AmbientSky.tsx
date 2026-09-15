import { useEffect, useRef } from 'react';
import { AmbientNote, MapBox, MapCanvas, MapFrame } from '../styled_components/Ears.styled';

interface Props {
  /** Stable per track, so each track gets its own star pattern. */
  seed: string;
  playing: boolean;
  note: string;
}

function seededRandom(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/* Decorative stand-in when a track's map isn't available: twinkling stars and a breathing glow
 * that wake up while the music plays. It is not data, and says so. */
export function AmbientSky({ seed, playing, note }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rand = seededRandom(seed);
    const stars = Array.from({ length: 170 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.4 + rand() * 1.3,
      phase: rand() * Math.PI * 2,
      speed: 0.4 + rand() * 1.4,
      warm: rand() < 0.12,
    }));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let energy = 0;
    let raf = 0;

    const draw = (now: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const g = canvas.getContext('2d');
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);

      const css = getComputedStyle(canvas);
      const violet = css.getPropertyValue('--starithm-electric-violet').trim();
      const amber = css.getPropertyValue('--starithm-selective-yellow').trim();
      const ink = css.getPropertyValue('--text-body').trim();
      const t = (now - start) / 1000;
      energy += ((playingRef.current ? 1 : 0.25) - energy) * 0.03; // ease between rest and play

      // a slow, breathing glow
      const cx = w / 2 + Math.cos(t * 0.07) * w * 0.05;
      const cy = h / 2 + Math.sin(t * 0.05) * h * 0.05;
      const radius = Math.min(w, h) * (0.34 + 0.05 * Math.sin(t * 0.8) * energy);
      const glow = g.createRadialGradient(cx, cy, 0, cx, cy, radius);
      glow.addColorStop(0, violet);
      glow.addColorStop(1, 'transparent');
      g.globalAlpha = 0.16 + 0.14 * energy;
      g.fillStyle = glow;
      g.fillRect(0, 0, w, h);

      // twinkling stars, brighter and quicker while playing
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed * (0.6 + energy) + s.phase);
        g.globalAlpha = 0.12 + twinkle * (0.3 + 0.45 * energy);
        g.fillStyle = s.warm ? amber : ink;
        g.beginPath();
        g.arc(s.x * w, s.y * h, s.r * (1 + 0.4 * twinkle * energy), 0, Math.PI * 2);
        g.fill();
      }
      g.globalAlpha = 1;
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [seed]);

  return (
    <MapFrame>
      <MapBox $ratio={1.3}>
        <MapCanvas ref={canvasRef} aria-hidden="true" />
        <AmbientNote>{note}</AmbientNote>
      </MapBox>
    </MapFrame>
  );
}
