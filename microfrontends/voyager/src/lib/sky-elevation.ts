import { positionAt } from './ephemeris';

/* How high Voyager 1 stands in the sky over each Deep Space Network complex. Computed from the
 * ephemeris (RA/Dec) and the station's latitude and longitude, so it is exact to the second; the
 * public DSN feed only gives dish angles in whole degrees. */

export const STATIONS = {
  Goldstone: { lat: 35.4267, lon: -116.89 },
  Madrid: { lat: 40.4314, lon: -4.2481 },
  Canberra: { lat: -35.4014, lon: 148.9817 },
} as const;

export type StationName = keyof typeof STATIONS;

/** A dish tracks a spacecraft only above roughly 10° of elevation. */
export const HORIZON_DEG = 10;

const RAD = Math.PI / 180;

export function elevationAt(ms: number, station: StationName) {
  const { lat, lon } = STATIONS[station];
  const { raDeg, decDeg } = positionAt(ms);
  const days = ms / 86_400_000 + 2440587.5 - 2451545;
  const gmst = 280.46061837 + 360.98564736629 * days;
  const hour = (gmst + lon - raDeg) * RAD;
  const sinEl = Math.sin(lat * RAD) * Math.sin(decDeg * RAD) + Math.cos(lat * RAD) * Math.cos(decDeg * RAD) * Math.cos(hour);
  return Math.asin(sinEl) / RAD;
}

export function isRising(ms: number, station: StationName) {
  return elevationAt(ms + 60_000, station) > elevationAt(ms, station);
}

/** The station where Voyager 1 stands highest right now. */
export function highestStation(ms: number): StationName {
  return (Object.keys(STATIONS) as StationName[]).reduce((best, s) =>
    elevationAt(ms, s) > elevationAt(ms, best) ? s : best,
  );
}

export interface Pass {
  station: StationName;
  rise: number;
  set: number;
  peakDeg: number;
}

/** The pass in progress at `ms` over `station`, or the next one if Voyager is below the horizon. */
export function passAt(ms: number, station: StationName): Pass {
  const STEP = 120_000;
  const up = (t: number) => elevationAt(t, station) >= HORIZON_DEG;
  let rise = ms;
  if (up(ms)) while (up(rise - STEP)) rise -= STEP;
  else while (!up(rise)) rise += STEP;
  let set = rise;
  let peakDeg = 0;
  while (up(set + STEP)) {
    set += STEP;
    peakDeg = Math.max(peakDeg, elevationAt(set, station));
  }
  return { station, rise, set, peakDeg };
}
