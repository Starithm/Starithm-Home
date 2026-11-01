import { ONE_LIGHT_DAY_UTC } from './ephemeris';

/* Virtual time for the slide. `null` is live. Otherwise the slide shows `base`, running forward
 * from the real moment `at` at `speed` × (0 pauses), so a preview keeps moving like the real
 * thing, or fast-forwards through days in seconds. */
export interface Clock {
  base: number;
  at: number;
  speed: number;
}

export const virtualNow = (clock: Clock | null, now = Date.now()) =>
  clock ? clock.base + (now - clock.at) * clock.speed : now;

export const travelTo = (base: number, speed = 1): Clock => ({ base, at: Date.now(), speed });

const H = 3_600_000;
const D = 24 * H;

/* Moments worth rehearsing, as offsets from the crossing (ms). */
export const MOMENTS: { key: string; label: string; offset: number }[] = [
  { key: 'week', label: '1 week out', offset: -7 * D },
  { key: 'day', label: '1 day out', offset: -D },
  { key: 'hour', label: '1 hour out', offset: -H },
  { key: 'minute', label: '1 min out', offset: -60_000 },
  { key: 'rehearse', label: 'Final 15 s', offset: -15_000 },
  { key: 'palebluedot', label: 'Pale Blue Dot', offset: 2_500 },
  { key: 'crossing', label: '24 hours', offset: 42_000 },
  { key: 'after', label: '+3 days', offset: (3 * 24 + 4) * H + 12 * 60_000 },
  { key: 'month', label: '+1 month', offset: 30 * D },
];

/* `?state=` from earlier links still works; `final` and `before` are kept for those. */
export function clockFromUrl(search: string): Clock | null {
  const state = new URLSearchParams(search).get('state');
  if (!state || state === 'live') return null;
  if (state === 'final') return travelTo(ONE_LIGHT_DAY_UTC - 7_000);
  if (state === 'before') return travelTo(Date.UTC(2026, 9, 31, 6, 12, 30));
  const m = MOMENTS.find((x) => x.key === state);
  return m ? travelTo(ONE_LIGHT_DAY_UTC + m.offset) : null;
}

/* The scrubber's range around the crossing. */
export const RANGE = { from: -20 * D, to: 40 * D };

export const SPEEDS = [
  { speed: 0, label: 'Pause' },
  { speed: 1, label: 'Real time' },
  { speed: 60, label: '1 min/s' },
  { speed: 3600, label: '1 hour/s' },
  { speed: 86_400, label: '1 day/s' },
];
