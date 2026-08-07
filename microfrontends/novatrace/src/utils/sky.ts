/* Spherical geometry on the sky. All angles in degrees. */

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

/**
 * Great-circle (angular) separation between two equatorial positions, via the
 * haversine form — the spherical law of cosines loses precision for the small
 * separations we care most about (a few arcminutes between a burst and its
 * candidate counterpart).
 */
export function angularSeparation(
  ra1: number, dec1: number,
  ra2: number, dec2: number,
): number {
  const φ1 = dec1 * RAD;
  const φ2 = dec2 * RAD;
  const dφ = (dec2 - dec1) * RAD;
  const dλ = (ra2 - ra1) * RAD;

  const a = Math.sin(dφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;

  return 2 * Math.asin(Math.min(1, Math.sqrt(a))) * DEG;
}

/** Degrees → the largest unit that keeps the number readable. */
export function formatSeparation(deg: number): string {
  if (deg < 1 / 60) return `${(deg * 3600).toFixed(1)}″`;
  if (deg < 1) return `${(deg * 60).toFixed(1)}′`;
  return `${deg.toFixed(1)}°`;
}

/** posErrorDeg is jsonb ({radius,type}); older rows are plain numbers, and SVOM
 *  sends -1 to mean "not reported". */
export function posErrorRadius(v: unknown): number | null {
  if (v == null) return null;
  const raw = typeof v === 'object' ? (v as any).radius : v;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** (0,0) is used upstream as a null sentinel, so it counts as "no position". */
export function hasPosition(e: { raDeg?: number | null; decDeg?: number | null }): boolean {
  return e.raDeg != null && e.decDeg != null && !(e.raDeg === 0 && e.decDeg === 0);
}
