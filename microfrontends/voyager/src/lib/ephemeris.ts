import data from '../data/ephemeris.json';

/* Voyager 1's position, from a daily JPL Horizons table (scripts/fetch-ephemeris.mjs).
 * Ranges are interpolated with a cubic Hermite using each row's range-rate, so the
 * distance ticks smoothly and lands within metres of Horizons between rows. */

export const AU_KM = 149_597_870.7;
export const C_KM_S = 299_792.458;
export const LIGHT_DAY_KM = C_KM_S * 86_400;

/* The moment Voyager 1 is one light-day from Earth's centre (geometric range), as NASA gives it and
 * as Horizons confirms. The first signal to have travelled a full 24 h arrives later, about 02:17 UTC on 19 Nov. */
export const ONE_LIGHT_DAY_UTC = Date.UTC(2026, 10, 18, 10, 16, 7);
export const LAUNCH_UTC = Date.UTC(1977, 8, 5, 12, 56);
/* Voyager 1 crossed the heliopause on 25 August 2012, at about 121.6 AU. */
export const HELIOPAUSE_AU = 121.6;

type Row = [number, number, number, number, number, number, number, number];
const rows = data.rows as Row[];

export interface Position {
  earthKm: number;
  earthKmS: number;
  sunKm: number;
  sunKmS: number;
  /** total speed relative to the Sun, as NASA quotes it */
  sunSpeedKmS: number;
  raDeg: number;
  decDeg: number;
  lightSeconds: number;
  inRange: boolean;
}

function hermite(p0: number, m0: number, p1: number, m1: number, h: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + t) * h * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * h * m1;
}

export function positionAt(ms: number): Position {
  const s = ms / 1000;
  const first = rows[0][0];
  const step = rows[1][0] - first;
  const i = Math.max(0, Math.min(rows.length - 2, Math.floor((s - first) / step)));
  const a = rows[i];
  const b = rows[i + 1];
  const t = (s - a[0]) / step;
  const lerp = (x: number, y: number) => x + (y - x) * t;

  const earthKm = hermite(a[5] * AU_KM, a[6], b[5] * AU_KM, b[6], step, t);
  const sunKm = hermite(a[3] * AU_KM, a[4], b[3] * AU_KM, b[4], step, t);
  return {
    earthKm,
    earthKmS: lerp(a[6], b[6]),
    sunKm,
    sunKmS: lerp(a[4], b[4]),
    sunSpeedKmS: lerp(a[7], b[7]),
    raDeg: lerp(a[1], b[1]),
    decDeg: lerp(a[2], b[2]),
    lightSeconds: earthKm / C_KM_S,
    inRange: s >= first && s <= rows[rows.length - 1][0],
  };
}

export function formatRa(deg: number) {
  const h = deg / 15;
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  const ss = ((h - hh) * 60 - mm) * 60;
  return `${hh}h ${String(mm).padStart(2, '0')}m ${ss.toFixed(1).padStart(4, '0')}s`;
}

export function formatDec(deg: number) {
  const sign = deg < 0 ? '−' : '+';
  const d = Math.abs(deg);
  const dd = Math.floor(d);
  const mm = Math.floor((d - dd) * 60);
  const ss = Math.round(((d - dd) * 60 - mm) * 60);
  return `${sign}${dd}° ${String(mm).padStart(2, '0')}′ ${String(ss).padStart(2, '0')}″`;
}

/* 86 399.6 s → "23:59:59.6" */
export function formatClock(seconds: number, decimals = 1) {
  const neg = seconds < 0;
  let s = Math.abs(seconds);
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  const sec = s.toFixed(decimals).padStart(decimals ? 3 + decimals : 2, '0');
  return `${neg ? '−' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${sec}`;
}

export function formatSpan(ms: number) {
  const s = Math.floor(Math.abs(ms) / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { d, h, m, s: sec };
}
