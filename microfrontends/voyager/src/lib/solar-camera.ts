import trajectory from '../data/trajectory.json';

/* The 3D solar view's camera. It rests on Voyager 1, and once a minute pulls back along the signal's
 * path to Earth, holds there, then flies back. The schedule is a pure function of wall-clock time, so
 * the canvas and the slide's overlays (which fade while the camera is away) always agree. */

type Row = [number, number, number, number];
export type Vec = [number, number, number];

const voyagerRows = trajectory.voyager as Row[];
const earthRows = trajectory.earth as Row[];
const YEAR_S = 365.25636 * 86_400; // sidereal year: Earth's rows repeat on it

function interp(rows: Row[], unix: number): Vec {
  if (unix <= rows[0][0]) return [rows[0][1], rows[0][2], rows[0][3]];
  const last = rows[rows.length - 1];
  if (unix >= last[0]) return [last[1], last[2], last[3]];
  let lo = 0;
  let hi = rows.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (rows[mid][0] <= unix) lo = mid;
    else hi = mid;
  }
  const a = rows[lo];
  const b = rows[hi];
  const f = (unix - a[0]) / (b[0] - a[0]);
  return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, a[3] + (b[3] - a[3]) * f];
}

/** Voyager 1, heliocentric ecliptic AU. */
export const voyagerAt = (ms: number) => interp(voyagerRows, ms / 1000);

/** Earth, heliocentric ecliptic AU; outside the fetched year it repeats the orbit. */
export function earthAt(ms: number): Vec {
  const t0 = earthRows[0][0];
  const span = earthRows[earthRows.length - 1][0] - t0;
  const k = Math.floor((ms / 1000 - t0) / YEAR_S);
  return interp(earthRows, Math.min(t0 + span, ms / 1000 - k * YEAR_S));
}

/** Voyager's path from launch up to `ms`, for drawing. */
export function pathUntil(ms: number): Vec[] {
  const out: Vec[] = [];
  for (const r of voyagerRows) {
    if (r[0] * 1000 >= ms) break;
    out.push([r[1], r[2], r[3]]);
  }
  out.push(voyagerAt(ms));
  return out;
}

export const earthOrbit: Vec[] = earthRows.map((r) => [r[1], r[2], r[3]]);

/* The schedule, in seconds of a 60 s cycle: rest on Voyager, fly out to Earth, hold, fly back. */
export const CYCLE_S = 60;
const OUT = [38, 46] as const;
const BACK = [52, 60] as const;

const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * c * (c * (c * 6 - 15) + 10);
};

/** How far through the trip to Earth the camera is: 0 on Voyager, 1 on Earth. */
export function tripAt(wallMs: number, originMs: number) {
  const s = ((((wallMs - originMs) / 1000) % CYCLE_S) + CYCLE_S) % CYCLE_S;
  if (s < OUT[0]) return 0;
  if (s < OUT[1]) return smooth((s - OUT[0]) / (OUT[1] - OUT[0]));
  if (s < BACK[0]) return 1;
  return 1 - smooth((s - BACK[0]) / (BACK[1] - BACK[0]));
}

/** The wall-clock origin that starts a trip to Earth right now. */
export const tripNowOrigin = (wallMs: number) => wallMs - OUT[0] * 1000;

const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: Vec): Vec => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

const NEAR_AU = 60; // camera distance resting on Voyager
const EARTH_AU = 5.5; // and on Earth: its orbit and the Sun, clear of the readouts
const FAR_AU = 420; // the widest point of the flight, both ends in view
const ROLL = 0.42; // radians: Voyager's outward direction points up and to the right

export interface Camera {
  /** Project a heliocentric point to stage pixels; null when behind the camera. */
  project: (p: Vec) => { x: number; y: number; depth: number } | null;
  dist: number;
}

/**
 * The camera at trip fraction `k`. It looks at a point sliding from Voyager to Earth, from a fixed
 * side-on direction a little above the path, rolled so the path trails down and to the left (towards
 * the Sun and Earth, into the slide's empty middle), and slowly swings for depth. Distance moves in
 * log space with a bump in the middle, so both ends fit on the way.
 */
export function cameraAt(k: number, voyager: Vec, earth: Vec, wallMs: number, cx: number, cy: number, focal: number): Camera {
  const r = norm(voyager);
  const side = norm(cross([0, 0, 1], r));
  const up = cross(r, side);
  const swing = Math.sin(wallMs / 23_000) * 0.3;
  const el = 0.35 + swing * 0.5;
  const build = (sgn: number) => {
    const dir = norm([0, 1, 2].map((i) => sgn * side[i] * Math.cos(el) + up[i] * Math.sin(el) + r[i] * swing * 0.6) as Vec);
    const fwd: Vec = [-dir[0], -dir[1], -dir[2]];
    const right = norm(cross(fwd, up));
    return { dir, fwd, right, camUp: cross(right, fwd) };
  };
  // the side that puts Voyager's outward direction to the screen's right
  let basis = build(1);
  if (dot(basis.right, r) < 0) basis = build(-1);
  const { dir, fwd, right, camUp } = basis;

  const u = smooth(k);
  const target: Vec = [0, 1, 2].map((i) => voyager[i] + (earth[i] * 0.6 - voyager[i]) * u) as Vec;
  const logD = Math.log(NEAR_AU) + (Math.log(EARTH_AU) - Math.log(NEAR_AU)) * k;
  const mid = (Math.log(NEAR_AU) + Math.log(EARTH_AU)) / 2;
  const dist = Math.exp(logD + (Math.log(FAR_AU) - mid) * Math.sin(Math.PI * k));
  const eye: Vec = [0, 1, 2].map((i) => target[i] + dir[i] * dist) as Vec;
  const cr = Math.cos(ROLL);
  const sr = Math.sin(ROLL);

  return {
    dist,
    project(p) {
      const d = sub(p, eye);
      const depth = dot(d, fwd);
      if (depth < dist * 0.02) return null;
      const x = (focal * dot(d, right)) / depth;
      const y = (focal * dot(d, camUp)) / depth;
      return { x: cx + x * cr - y * sr, y: cy - (x * sr + y * cr), depth };
    },
  };
}
