/* Redshift as reported in GCN Circulars.
 *
 * The extractor writes `measurements.redshift` on most circulars, but the value
 * is null far more often than not, and when present it arrives in three shapes
 * seen in live data:
 *
 *   1.208                                    a number
 *   "0.18±0.15"                              a string, uncertainty included
 *   { value: null, range: "between z=4..." } an object, when only a bound was reported
 *
 * Different teams also report different redshifts for the same event (e.g.
 * 01709258389 carries both z=1.208 and z=1.04), so callers get every distinct
 * report rather than one silently chosen winner.
 */

export interface RedshiftReport {
  /** Display text, e.g. "1.208", "0.18±0.15", "between z=4 and z=5". */
  display: string;
  /** Numeric value when one was reported; null for ranges and bounds. */
  value: number | null;
  /** Circular that reported it. */
  alertKey: string;
  /** Circular date, ISO. */
  date: string;
}

const KEYS = ['redshift', 'z', 'redshift_z'];

/**
 * Whether the display text still needs a `z =` label. Bare values ("1.208",
 * "0.18±0.15") do; reported ranges ("between z=4 and z=5") already say it
 * themselves and would otherwise read "z = between z=4 and z=5".
 */
export function needsLabel(display: string): boolean {
  return /^[0-9.]/.test(display.trim());
}

/** Trim float noise without lying about precision: 1.208 → "1.208", 1.2080 → "1.208". */
function fmtNumber(n: number): string {
  return String(Number(n.toFixed(4)));
}

/** Pull the redshift out of one circular's measurements object, if it has one. */
export function readRedshift(
  measurements: Record<string, any> | undefined | null,
): { display: string; value: number | null } | null {
  if (!measurements || typeof measurements !== 'object' || Array.isArray(measurements)) return null;

  const nested = measurements.other_measurements;
  const pools = [measurements, nested && typeof nested === 'object' ? nested : null];

  for (const pool of pools) {
    if (!pool) continue;
    for (const key of KEYS) {
      const raw = (pool as Record<string, any>)[key];
      if (raw == null || raw === '') continue;

      if (typeof raw === 'number') {
        return Number.isFinite(raw) ? { display: fmtNumber(raw), value: raw } : null;
      }

      if (typeof raw === 'string') {
        const n = Number(raw);
        return { display: raw.trim(), value: Number.isFinite(n) ? n : null };
      }

      if (typeof raw === 'object') {
        // { value, range } — value wins; a range alone is still worth showing.
        const v = (raw as any).value;
        if (typeof v === 'number' && Number.isFinite(v)) return { display: fmtNumber(v), value: v };
        if (typeof v === 'string' && v.trim()) {
          const n = Number(v);
          return { display: v.trim(), value: Number.isFinite(n) ? n : null };
        }
        const range = (raw as any).range;
        if (typeof range === 'string' && range.trim()) return { display: range.trim(), value: null };
      }
    }
  }

  return null;
}

/**
 * Every distinct redshift reported across an event's circulars, newest first.
 * More than one entry means the circulars disagree — that is shown, not resolved.
 */
export function eventRedshifts(
  circulars: Array<{ alertKey: string; date: string; data?: { measurements?: Record<string, any> } }>,
): RedshiftReport[] {
  const byDisplay = new Map<string, RedshiftReport>();

  for (const c of circulars) {
    const hit = readRedshift(c.data?.measurements);
    if (!hit) continue;
    const existing = byDisplay.get(hit.display);
    // Keep the earliest circular to report a given value — that is who reported it first.
    if (!existing || new Date(c.date).getTime() < new Date(existing.date).getTime()) {
      byDisplay.set(hit.display, { ...hit, alertKey: c.alertKey, date: c.date });
    }
  }

  return Array.from(byDisplay.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
