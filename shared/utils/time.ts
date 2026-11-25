/* UTC date formats used across the app. Each was written separately in several files. */

/** "Nov 24, 2026, 04:30 PM UTC": dates shown in running text (circular lists, record headers). */
export const utcLong = (iso: string): string =>
  new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
  });

/** "2026-11-24 16:30" (UTC, no suffix). Throws on an invalid date, so callers check first. */
export const utcMinute = (d: Date | string): string => new Date(d).toISOString().slice(0, 16).replace('T', ' ');

/** "2026-11-24 16:30:05" (UTC, no suffix). Throws on an invalid date, so callers check first. */
export const utcSecond = (d: Date | string): string => new Date(d).toISOString().slice(0, 19).replace('T', ' ');
