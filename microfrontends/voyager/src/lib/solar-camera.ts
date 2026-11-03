import trajectory from '../data/trajectory.json';

/* The 3D solar view's camera. It rests on Voyager 1 for 10 s, then pulls back along the signal's path
 * to Earth, holds there, flies back, and repeats. The schedule is a pure function of wall-clock time, so
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

const bodyRows = Object.entries(trajectory.bodies as unknown as Record<string, Row[]>);

/** The other planets and Voyager 2, shown as points (no paths) while the camera is away. */
export const bodiesAt = (ms: number) => bodyRows.map(([name, rows]) => ({ name, p: interp(rows, ms / 1000) }));

/** The flybys: where Voyager 1 met Jupiter and Saturn, shown there while the camera retraces its path. */
export const FLYBYS = [
  { name: 'Jupiter', at: Date.UTC(1979, 2, 5) },
  { name: 'Saturn', at: Date.UTC(1980, 10, 12) },
].map((m) => ({ ...m, p: voyagerAt(m.at) }));

// Distance travelled along the path, row by row: it only grows, unlike distance from the Sun, which
// barely moves in the first months while Voyager runs alongside Earth's orbit.
const arc: number[] = [0];
for (let i = 1; i < voyagerRows.length; i++) {
  const [, x0, y0, z0] = voyagerRows[i - 1];
  const [, x1, y1, z1] = voyagerRows[i];
  arc.push(arc[i - 1] + Math.hypot(x1 - x0, y1 - y0, z1 - z0));
}

/** How far Voyager had travelled along its path by `ms`, in AU. */
function arcAt(ms: number) {
  let i = 0;
  while (i < voyagerRows.length - 1 && voyagerRows[i + 1][0] * 1000 <= ms) i++;
  const [, x, y, z] = voyagerRows[i];
  const now = voyagerAt(ms);
  return arc[i] + Math.hypot(now[0] - x, now[1] - y, now[2] - z);
}

/** The point `s` AU along Voyager's path (capped at `ms`), and when Voyager was there. */
function pathAtArc(s: number, ms: number): { p: Vec; at: number } {
  if (s >= arcAt(ms)) return { p: voyagerAt(ms), at: ms };
  let lo = 0;
  let hi = arc.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (arc[mid] <= s) lo = mid;
    else hi = mid;
  }
  const A = voyagerRows[lo];
  const B = voyagerRows[hi];
  const f = Math.min(1, Math.max(0, (s - arc[lo]) / (arc[hi] - arc[lo] || 1)));
  return { p: [A[1] + (B[1] - A[1]) * f, A[2] + (B[2] - A[2]) * f, A[3] + (B[3] - A[3]) * f], at: (A[0] + (B[0] - A[0]) * f) * 1000 };
}

/* The schedule, in seconds of each cycle. Resting on Voyager, then: turn towards Earth, ride the signal
 * home, ease back to see Earth and the Sun, hold, turn onto Voyager's path at launch, retrace it out to
 * Voyager, ease back to the resting view. */
const STEPS = [
  ['rest', 10],
  ['outTurn', 2.5],
  ['outFly', 5.5],
  ['earthSettle', 2],
  ['hold', 4],
  ['backTurn', 3],
  ['backFly', 7],
  ['voyagerSettle', 2],
] as const;
export type Step = (typeof STEPS)[number][0];
export const CYCLE_S = STEPS.reduce((n, [, d]) => n + d, 0);

const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * c * (c * (c * 6 - 15) + 10);
};

/** Where in the cycle the camera is: the step, and how far through it (0..1). */
export function stepAt(wallMs: number, originMs: number): { step: Step; f: number } {
  let s = ((((wallMs - originMs) / 1000) % CYCLE_S) + CYCLE_S) % CYCLE_S;
  for (const [step, d] of STEPS) {
    if (s < d) return { step, f: s / d };
    s -= d;
  }
  return { step: 'rest', f: 0 };
}

/** How visible the trip's own marks are (planets, labels): 0 at rest, 1 once the camera has left. */
export function awayAt(wallMs: number, originMs: number) {
  const { step, f } = stepAt(wallMs, originMs);
  if (step === 'rest') return 0;
  if (step === 'outTurn') return smooth(f);
  if (step === 'voyagerSettle') return 1 - smooth(f);
  return 1;
}

/** The wall-clock origin that starts a trip to Earth right now. */
export const tripNowOrigin = (wallMs: number) => wallMs - STEPS[0][1] * 1000;

const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: Vec, b: Vec, k = 1): Vec => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const mix = (a: Vec, b: Vec, f: number): Vec => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: Vec) => Math.hypot(a[0], a[1], a[2]);
const norm = (a: Vec): Vec => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

const NEAR_AU = 60; // camera distance resting on Voyager
const EARTH_AU = 5.5; // and on Earth: its orbit and the Sun, clear of the readouts
const ROLL = 0.42; // radians, resting views: Voyager's outward direction points up and to the right
const STEER_WINDOW = 0.3; // of the path flight either side (about 2 s) that the camera's heading averages over
const SPREAD = 8; // samples each side of that window
const LEAN = 0.35; // how far the heading leans from the path's direction towards Voyager today
const GAZE_AHEAD = 0.6; // how far past Voyager's past self the camera looks, in units of its scale
// where the camera picks Voyager up: approaching Jupiter. Riding the 1977–78 arc out to it would add
// another 90 degrees of turning for no flyby; that stretch is still drawn.
const PICK_UP = Date.UTC(1978, 9, 1);

/** Where the camera is and what it looks at. Poses blend, so every move is continuous. */
interface Pose {
  eye: Vec;
  target: Vec;
  up: Vec;
  roll: number;
}

/** Turn unit vector `a` towards `b` by fraction `k` of the angle between them, at an even rate. */
function slerp(a: Vec, b: Vec, k: number): Vec {
  const c = Math.min(1, Math.max(-1, dot(a, b)));
  const angle = Math.acos(c);
  if (angle < 1e-4) return b;
  const sa = Math.sin(angle);
  return norm(add(add([0, 0, 0], a, Math.sin((1 - k) * angle) / sa), b, Math.sin(k * angle) / sa));
}

/** Between two poses: the eye slides, and the gaze turns evenly (sliding the target instead would bunch
 *  the turn into the moment the nearer target takes over). */
const blend = (a: Pose, b: Pose, f: number): Pose => {
  // a gentler ease than smooth(): the turn's peak rate is 20% lower
  const c = Math.min(1, Math.max(0, f));
  const k = c * c * (3 - 2 * c);
  const eye = mix(a.eye, b.eye, k);
  const gaze = slerp(norm(sub(a.target, a.eye)), norm(sub(b.target, b.eye)), k);
  const reach = len(sub(a.target, a.eye)) * (1 - k) + len(sub(b.target, b.eye)) * k;
  return { eye, target: add(eye, gaze, reach), up: slerp(a.up, b.up, k), roll: a.roll + (b.roll - a.roll) * k };
};

/**
 * A resting view of `focus` from `dist` AU: side-on to Voyager's outward direction and a little above,
 * rolled so the path trails down and to the left (towards the Sun and Earth, into the slide's empty
 * middle), slowly swinging for depth.
 */
function overview(focus: Vec, dist: number, voyager: Vec, wallMs: number): Pose {
  const r = norm(voyager);
  const side = norm(cross([0, 0, 1], r));
  const up = cross(r, side);
  const swing = Math.sin(wallMs / 23_000) * 0.3;
  const el = 0.35 + swing * 0.5;
  const dirFor = (sgn: number) => norm([0, 1, 2].map((i) => sgn * side[i] * Math.cos(el) + up[i] * Math.sin(el) + r[i] * swing * 0.6) as Vec);
  // the side that puts Voyager's outward direction to the screen's right
  let dir = dirFor(1);
  if (dot(norm(cross([-dir[0], -dir[1], -dir[2]], up)), r) < 0) dir = dirFor(-1);
  return { eye: add(focus, dir, dist), target: focus, up, roll: ROLL };
}

/** Riding along a line at `p`, heading `ahead`, sized to `scale` AU: just behind and above, looking on. */
function chase(p: Vec, ahead: Vec, scale: number, look: Vec): Pose {
  const z: Vec = [0, 0, 1];
  const up = norm(sub(z, add([0, 0, 0], ahead, dot(z, ahead))));
  return { eye: add(add(p, ahead, -0.12 * scale), up, 0.022 * scale), target: look, up, roll: 0 };
}

export interface Camera {
  /** Project a heliocentric point to stage pixels; null when behind the camera. */
  project: (p: Vec) => { x: number; y: number; depth: number } | null;
  /** The camera's distance from the Sun, for sizing it. */
  sunDist: number;
  /** While riding the signal: where the pulse of light is. */
  pulse: Vec | null;
  /** While retracing Voyager's path: Voyager's past self the camera follows, and when it was there. */
  past: { p: Vec; at: number } | null;
}

/** The camera for this moment of the cycle. `t` is the slide's (virtual) time, for positions. */
export function cameraAt(wallMs: number, originMs: number, t: number, voyager: Vec, earth: Vec, cx: number, cy: number, focal: number): Camera {
  const { step, f } = stepAt(wallMs, originMs);
  const restV = overview(voyager, NEAR_AU, voyager, wallMs);
  const restE = overview(mix([0, 0, 0], earth, 0.6), EARTH_AU, voyager, wallMs);

  // riding the signal: distance left to Earth shrinks in log steps, fast far out and slowing on arrival
  const home = norm(sub(earth, voyager));
  const span = len(sub(earth, voyager));
  const signalPose = (g: number) => {
    const left = Math.exp(Math.log(span) + (Math.log(1.2) - Math.log(span)) * smooth(g));
    const p = add(earth, home, -left);
    return { pose: chase(p, home, left, add(p, home, 0.7 * left)), p };
  };
  // Retracing Voyager's path: distance travelled along it grows in log steps, so the flybys, early on,
  // get their time. The early path curves through about 200 degrees (the arc out to Jupiter, then both
  // flybys); steering by its direction at each instant would whip the camera round, so the heading is
  // averaged over a wide stretch of the flight and turns slowly, while the bends sweep across the frame.
  const sNow = arcAt(t);
  const s0 = arcAt(PICK_UP);
  const arcFor = (g: number) => Math.exp(Math.log(s0) + (Math.log(sNow) - Math.log(s0)) * smooth(g));
  const pathPose = (g: number) => {
    const here = pathAtArc(arcFor(g), t);
    let ahead: Vec = [0, 0, 0];
    for (let i = -SPREAD; i <= SPREAD; i++) {
      const si = arcFor(Math.min(1, Math.max(0, g + (i / SPREAD) * STEER_WINDOW)));
      ahead = add(ahead, norm(sub(pathAtArc(si * 1.2, t).p, pathAtArc(si / 1.2, t).p)), Math.exp(-((i / SPREAD) ** 2) * 2));
    }
    // lean partly towards Voyager today: the camera turns less in all, and the gaze still holds the rider
    const heading = norm(add(norm(ahead), norm(sub(voyager, here.p)), LEAN / (1 - LEAN)));
    const scale = Math.max(1.5, 0.8 * len(here.p));
    // gaze just ahead of Voyager's past self, so it stays in view and the bends sweep across the frame
    return { pose: chase(here.p, heading, scale, add(here.p, heading, GAZE_AHEAD * scale)), here };
  };

  let pose: Pose = restV;
  let pulse: Vec | null = null;
  let past: { p: Vec; at: number } | null = null;
  if (step === 'outTurn') pose = blend(restV, signalPose(0).pose, f);
  else if (step === 'outFly') {
    const s = signalPose(f);
    pose = s.pose;
    pulse = s.p;
  } else if (step === 'earthSettle') pose = blend(signalPose(1).pose, restE, f);
  else if (step === 'hold') pose = restE;
  else if (step === 'backTurn') pose = blend(restE, pathPose(0).pose, f);
  else if (step === 'backFly') {
    const s = pathPose(f);
    pose = s.pose;
    past = s.here;
  } else if (step === 'voyagerSettle') pose = blend(pathPose(1).pose, restV, f);

  const fwd = norm(sub(pose.target, pose.eye));
  const right = norm(cross(fwd, pose.up));
  const camUp = cross(right, fwd);
  const near = len(sub(pose.target, pose.eye)) * 0.005;
  const cr = Math.cos(pose.roll);
  const sr = Math.sin(pose.roll);

  return {
    sunDist: len(pose.eye),
    pulse,
    past,
    project(p) {
      const d = sub(p, pose.eye);
      const depth = dot(d, fwd);
      if (depth < near) return null;
      const x = (focal * dot(d, right)) / depth;
      const y = (focal * dot(d, camUp)) / depth;
      return { x: cx + x * cr - y * sr, y: cy - (x * sr + y * cr), depth };
    },
  };
}
