import { useEffect, useRef } from 'react';
import styled from 'styled-components';

/* The hero's backdrop: stars drifting slowly outward (moving forward through deep space) and Earth's limb
   along the bottom with ground telescopes on it and two space telescopes above. Decorative only: hidden from
   assistive tech, dim, slow, paused off-screen or in a hidden tab, still under prefers-reduced-motion.
   The global "* { z-index: auto !important }" reset (globals.css) means stacking comes from DOM order:
   this sits before the hero content, absolutely positioned. */

const Layer = styled.div`
  position: absolute; inset: 0; overflow: hidden; pointer-events: none;
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
`;
const Ground = styled.svg`
  position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 150px; display: block;
  @media (max-width: 760px) { height: 96px; }
`;
const Orbiter = styled.svg<{ $top: string; $left: string; $size: number }>`
  position: absolute; top: ${p => p.$top}; left: ${p => p.$left}; width: ${p => p.$size}px; height: auto; opacity: 0.5;
  @media (max-width: 760px) { display: none; }
`;

const STARS = 260;
const SPEED = 0.0016; // depth units per frame: slow

function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const stars = Array.from({ length: STARS }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
    let w = 0, h = 0, raf = 0, visible = true;
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.62, cy = h * 0.45, spread = Math.max(w, h) * 0.6;
      for (const s of stars) {
        if (!still) {
          s.z -= SPEED;
          if (s.z <= 0.02) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; }
        }
        const px = cx + (s.x / s.z) * spread * 0.18, py = cy + (s.y / s.z) * spread * 0.18;
        if (px < -4 || px > w + 4 || py < -4 || py > h + 4) { if (!still) s.z = 1; continue; }
        const near = 1 - s.z; // 0 far … 1 near
        ctx.fillStyle = `rgba(231, 223, 221, ${0.12 + near * 0.6})`;
        ctx.beginPath();
        ctx.arc(px, py, 0.3 + near * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const loop = () => { if (visible && !document.hidden) draw(); raf = requestAnimationFrame(loop); };
    size();
    const ro = new ResizeObserver(() => { size(); if (still) draw(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting); });
    io.observe(canvas);
    if (still) draw(); else raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);
  return <canvas ref={ref} />;
}

/* Earth's limb: a circle much larger than the view, its top at y = 64 in a 1440 × 150 box. */
const VW = 1440, VH = 150, R = 4200, TOPY = 64;
const limbY = (x: number) => TOPY + R - Math.sqrt(R * R - (x - VW / 2) ** 2);

function Dome({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${limbY(x) + 2}) scale(${scale})`}>
      <rect x={-15} y={-16} width={30} height={17} />
      <path d="M -17 -16 A 17 17 0 0 1 17 -16 Z" />
      <rect x={-2} y={-31} width={4} height={13} fill="var(--accent-text)" opacity={0.55} />
    </g>
  );
}
function Dish({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${limbY(x) + 2}) scale(${scale})`}>
      <rect x={-2} y={-16} width={4} height={17} />
      <path d="M -6 0 L 0 -14 L 6 0 Z" />
      <path d="M -19 -32 Q -4 -6 16 -22 Z" />
      <line x1={-2} y1={-21} x2={-14} y2={-38} stroke="var(--surface-sunken)" strokeWidth={1.5} />
    </g>
  );
}

function SpaceTelescope() {
  return (
    <>
      <rect x={18} y={6} width={30} height={12} rx={2} fill="var(--text-muted)" />
      <rect x={14} y={7} width={5} height={10} fill="var(--text-faint)" />
      <rect x={20} y={-10} width={20} height={12} fill="var(--accent-border)" stroke="var(--text-faint)" strokeWidth={0.6} />
      <rect x={20} y={22} width={20} height={12} fill="var(--accent-border)" stroke="var(--text-faint)" strokeWidth={0.6} />
      <line x1={30} y1={2} x2={30} y2={6} stroke="var(--text-faint)" />
      <line x1={30} y1={18} x2={30} y2={22} stroke="var(--text-faint)" />
    </>
  );
}

export function HeroSky() {
  return (
    <Layer aria-hidden="true">
      <Starfield />
      <Orbiter $top="7%" $left="90%" $size={52} viewBox="0 -12 60 48"><SpaceTelescope /></Orbiter>
      <Orbiter $top="70%" $left="6%" $size={40} viewBox="0 -12 60 48" style={{ transform: 'rotate(-18deg)' }}><SpaceTelescope /></Orbiter>
      <Ground viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="hero-atmo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--starithm-nebula-teal)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--starithm-nebula-teal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* atmosphere: a soft band just above the limb */}
        <path d={`M 0 ${limbY(0) - 14} A ${R} ${R} 0 0 1 ${VW} ${limbY(VW) - 14} L ${VW} ${limbY(VW)} A ${R} ${R} 0 0 0 0 ${limbY(0)} Z`} fill="url(#hero-atmo)" />
        <g fill="var(--surface-sunken)">
          <path d={`M 0 ${VH} L 0 ${limbY(0)} A ${R} ${R} 0 0 1 ${VW} ${limbY(VW)} L ${VW} ${VH} Z`} />
          <Dome x={290} scale={1.7} />
          <Dome x={370} scale={1.15} />
          <Dish x={1090} scale={1.7} />
        </g>
        <path d={`M 0 ${limbY(0)} A ${R} ${R} 0 0 1 ${VW} ${limbY(VW)}`} fill="none" stroke="var(--starithm-nebula-teal)" strokeOpacity={0.35} strokeWidth={1.2} />
      </Ground>
    </Layer>
  );
}
