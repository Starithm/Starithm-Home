/* When the 3D solar view's camera does what. Kept apart from the camera (and the trajectory data it
 * loads), so the slide can time its overlays without downloading the 3D view. */

/* The schedule, in seconds of each cycle. Resting on Voyager, then: turn towards Earth, ride the signal
 * home, ease back to see Earth and the Sun, hold, turn onto Voyager's path near Jupiter, retrace it out to
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

export const smooth = (x: number) => {
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
