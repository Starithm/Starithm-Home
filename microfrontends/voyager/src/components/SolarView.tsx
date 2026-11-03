import { useEffect, useRef } from 'react';
import { rgba, token } from '../lib/canvas-color';
import { positionAt } from '../lib/ephemeris';
import { cameraAt, earthAt, earthOrbit, pathUntil, tripAt, voyagerAt, type Vec } from '../lib/solar-camera';

/* Voyager 1 in the solar system, in 3D: its real path from launch (JPL Horizons), drawn side-on with
 * Voyager at the stage centre, where the slide's marker sits. Once a minute the camera pulls back
 * along the signal's path to Earth and returns (see solar-camera.ts). Only Voyager 1's path is drawn. */

const W = 1920;
const H = 1080;
const FOCAL = 1250;

export function SolarView({ at, origin }: { at: number; origin: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const atRef = useRef(at);
  atRef.current = at;
  const originRef = useRef(origin);
  originRef.current = origin;

  useEffect(() => {
    const el = ref.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const gold = token(el, '--starithm-golden-yellow', 'rgb(255,195,50)');
    const violet = token(el, '--accent-text', 'rgb(202,144,250)');
    const teal = token(el, '--starithm-nebula-teal', 'rgb(80,220,200)');
    const line = token(el, '--text-muted', 'rgb(169,159,178)');
    const glow = token(el, '--foreground', 'rgb(255,250,244)');
    const prose = token(el, '--font-prose', 'sans-serif');
    let raf = 0;
    let pathAt = -1;
    let path: Vec[] = [];

    const label = (text: string, x: number, y: number, color: string, a: number, size = 26, align: CanvasTextAlign = 'left') => {
      if (a <= 0.01) return;
      ctx.font = `${size}px ${prose}`;
      ctx.textAlign = align;
      ctx.fillStyle = rgba(color, a);
      ctx.fillText(text, x, y);
    };
    const dot = (x: number, y: number, r: number, color: string, a: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(glow, a));
      g.addColorStop(0.3, rgba(color, 0.8 * a));
      g.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      const wall = Date.now();
      const t = atRef.current;
      // the path only grows by a few pixels a day: rebuild it once a minute of virtual time
      if (Math.abs(t - pathAt) > 60_000) {
        path = pathUntil(t);
        pathAt = t;
      }
      const v = voyagerAt(t);
      const e = earthAt(t);
      const k = tripAt(wall, originRef.current);
      const cam = cameraAt(k, v, e, wall, W / 2, H / 2, FOCAL);
      const away = Math.min(1, k * 3);
      ctx.clearRect(0, 0, W, H);

      // Earth's orbit, and the Sun
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = rgba(line, 0.45);
      ctx.beginPath();
      let pen = false;
      for (const p of earthOrbit) {
        const s = cam.project(p);
        if (!s) { pen = false; continue; }
        if (pen) ctx.lineTo(s.x, s.y);
        else ctx.moveTo(s.x, s.y);
        pen = true;
      }
      ctx.closePath();
      ctx.stroke();
      const sun = cam.project([0, 0, 0]);
      if (sun) dot(sun.x, sun.y, Math.max(10, Math.min(60, 9000 / cam.dist)), gold, 1);

      // Voyager's path, brightening from launch to now
      ctx.lineWidth = 2;
      for (let i = 1; i < path.length; i++) {
        const a = cam.project(path[i - 1]);
        const b = cam.project(path[i]);
        if (!a || !b) continue;
        ctx.strokeStyle = rgba(gold, 0.15 + 0.6 * (i / path.length));
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // the signal's way home: Voyager to Earth, with a pulse riding it out and back
      const vs = cam.project(v);
      const es = cam.project(e);
      if (vs && es && k > 0) {
        ctx.strokeStyle = rgba(violet, 0.55 * away);
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 10]);
        ctx.beginPath();
        ctx.moveTo(vs.x, vs.y);
        ctx.lineTo(es.x, es.y);
        ctx.stroke();
        ctx.setLineDash([]);
        const px = vs.x + (es.x - vs.x) * k;
        const py = vs.y + (es.y - vs.y) * k;
        if (k < 0.98) dot(px, py, 14, violet, away);
      }
      if (es) {
        dot(es.x, es.y, 16, teal, 1);
        // from far out the two are one point of light: name them together
        const apart = sun ? Math.hypot(es.x - sun.x, es.y - sun.y) > 90 : true;
        label(apart ? 'Earth' : 'Earth and Sun', es.x + 20, es.y - 14, teal, away, 30);
        if (apart && sun) label('Sun', sun.x + 24, sun.y + 40, gold, away);
      }
      if (vs) {
        dot(vs.x, vs.y, 14, violet, away);
        label('Voyager 1', vs.x + 20, vs.y - 14, violet, k > 0.08 ? away : 0, 30);
      }

      // on Earth: how long the light took
      if (k > 0.85 && es) {
        const lt = Math.floor(positionAt(t).lightSeconds);
        const hm = `${Math.floor(lt / 3600)} h ${String(Math.floor((lt % 3600) / 60)).padStart(2, '0')} min`;
        const a = (k - 0.85) / 0.15;
        label(`Voyager's signal takes ${hm} to get here`, W / 2, 880, line, a, 30, 'center');
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
