import { useEffect, useRef } from 'react';
import { rgba, token } from '../lib/canvas-color';
import { positionAt } from '../lib/ephemeris';
import { awayAt, bodiesAt, cameraAt, earthAt, earthOrbit, MILESTONES, pathUntil, stepAt, voyagerAt, type Vec } from '../lib/solar-camera';

/* Voyager 1 in the solar system, in 3D: its real path from launch (JPL Horizons), drawn side-on with
 * Voyager at the stage centre, where the slide's marker sits. Between rests the camera rides the signal
 * home to Earth and retraces Voyager's path back out (see solar-camera.ts). Only Voyager 1's path is
 * drawn; on the trip the other planets and Voyager 2 appear as named points. */

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
      const { step, f } = stepAt(wall, originRef.current);
      const cam = cameraAt(wall, originRef.current, t, v, e, W / 2, H / 2, FOCAL);
      const away = awayAt(wall, originRef.current);
      const outbound = step === 'outTurn' || step === 'outFly' || step === 'earthSettle' || step === 'hold';
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
      ctx.stroke();
      const sun = cam.project([0, 0, 0]);
      if (sun) dot(sun.x, sun.y, Math.max(10, Math.min(70, 9000 / cam.sunDist)), gold, 1);

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
      // the flybys, named while the camera retraces the path
      if (step === 'backTurn' || step === 'backFly') {
        for (const m of MILESTONES) {
          const s = cam.project(m.p);
          if (!s) continue;
          dot(s.x, s.y, 10, gold, away);
          label(m.label, s.x + 16, s.y - 12, gold, away, 26);
        }
      }

      const vs = cam.project(v);
      const es = cam.project(e);

      // the other planets and Voyager 2, as points; a name is dropped where it would crowd another.
      // Not while retracing the path: today's planets beside 1979's flybys would mislead.
      if (away > 0.01 && step !== 'backTurn' && step !== 'backFly') {
        const taken = [vs, es, sun].filter((x) => x).map((x) => ({ x: x!.x, y: x!.y }));
        for (const b of bodiesAt(t)) {
          const s = cam.project(b.p);
          if (!s || s.x < -50 || s.x > W + 50 || s.y < -50 || s.y > H + 50) continue;
          const craft = b.name === 'Voyager 2';
          dot(s.x, s.y, craft ? 14 : 12, craft ? violet : glow, away);
          if (taken.some((o) => Math.abs(o.x - s.x) < 120 && Math.abs(o.y - s.y) < 34)) continue;
          taken.push({ x: s.x, y: s.y });
          label(b.name, s.x + 16, s.y - 10, craft ? violet : line, away, 24);
        }
      }

      // the signal's way home, Voyager to Earth, and the pulse of light the camera rides on it
      if (outbound && vs && es) {
        ctx.strokeStyle = rgba(violet, 0.55 * away);
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 10]);
        ctx.beginPath();
        ctx.moveTo(vs.x, vs.y);
        ctx.lineTo(es.x, es.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      const ps = cam.pulse && cam.project(cam.pulse);
      if (ps) dot(ps.x, ps.y, 18, violet, 1);
      const was = cam.past && cam.project(cam.past.p);
      if (was) dot(was.x, was.y, 16, gold, 1);
      if (es) {
        dot(es.x, es.y, 16, teal, 1);
        // from far out the two are one point of light: name them together
        const apart = sun ? Math.hypot(es.x - sun.x, es.y - sun.y) > 90 : true;
        label(apart ? 'Earth' : 'Earth and Sun', es.x + 20, es.y - 14, teal, away, 30);
        if (apart && sun) label('Sun', sun.x + 24, sun.y + 40, gold, away);
      }
      if (vs) {
        dot(vs.x, vs.y, 14, violet, away);
        label('Voyager 1', vs.x + 20, vs.y - 14, violet, away, 30);
      }

      // what the trip is showing, low in the middle
      const caption = (text: string, a: number) => label(text, W / 2, 880, line, a, 30, 'center');
      if (step === 'outFly') caption("Riding Voyager's signal home", Math.min(1, f * 4, (1 - f) * 4));
      if (step === 'earthSettle' || step === 'hold') {
        const lt = Math.floor(positionAt(t).lightSeconds);
        const hm = `${Math.floor(lt / 3600)} h ${String(Math.floor((lt % 3600) / 60)).padStart(2, '0')} min`;
        caption(`Voyager's signal takes ${hm} to get here`, step === 'hold' ? Math.min(1, (1 - f) * 4) : f);
      }
      if (step === 'backFly' && cam.past) {
        caption(`Back along Voyager's path · ${new Date(cam.past.at).getUTCFullYear()}`, Math.min(1, f * 4, (1 - f) * 4));
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
