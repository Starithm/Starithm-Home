import { useEffect } from 'react';
import { STAGE_H, STAGE_W } from '../styled_components/LiveSlide.styled';

/* The deep-space background shared by the live slide and the stage scenes: a fixed starfield and
 * stars streaming out of the centre. */

function mulberry(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Static starfield, drawn once. Colours are literal because canvas can't read CSS tokens;
 * the ground is read from --surface-sunken so it matches the stage. */
export function drawStars(el: HTMLCanvasElement) {
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
export function useFlow(ref: React.RefObject<HTMLCanvasElement>) {
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

