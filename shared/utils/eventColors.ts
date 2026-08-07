/* One colour per alert kind, and one per significance level.
 *
 * These were previously duplicated in three places — the celestial sphere's draw
 * loop, its legend array, and the dashboard's badge helpers — and the sphere was
 * missing cases for `xray` and `frb`, so both fell through to the default violet
 * and became indistinguishable from `gw`. Everything reads from here now.
 *
 * Kinds come from GET /api/filters: grb, gw, xray, neutrino, frb.
 */

export const KIND_COLORS: Record<string, string> = {
  grb: '#FF6B6B',
  gw: '#8D0FF5',
  neutrino: '#4ECDC4',
  xray: '#7AA2FF',
  frb: '#C84BF7',
  supernova: '#FFB400',
  flare: '#FF9F43',
};

export const KIND_FALLBACK = '#9A93AC';

/** Long-form aliases the API and older payloads both use. */
const ALIASES: Record<string, string> = {
  'gamma-ray burst': 'grb',
  'gravitational wave': 'gw',
  'x-ray': 'xray',
  'fast radio burst': 'frb',
};

export function kindKey(alertKind: string | null | undefined): string {
  const k = (alertKind || '').toLowerCase().trim();
  return ALIASES[k] || k;
}

export function kindColor(alertKind: string | null | undefined): string {
  return KIND_COLORS[kindKey(alertKind)] || KIND_FALLBACK;
}

/** Chip fill — the kind's colour at ~16%, per the 2b spec (`colour + "28"`). */
export function kindChipBg(alertKind: string | null | undefined): string {
  return `${kindColor(alertKind)}28`;
}

export const SIG_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

export function sigColor(significance: string | null | undefined): string {
  return SIG_COLORS[(significance || '').toLowerCase()] || KIND_FALLBACK;
}

/** Legend entries for the sphere, derived so it can't drift from the map above. */
export const LEGEND: Array<{ key: string; label: string; color: string }> = [
  { key: 'grb', label: 'Gamma-Ray Burst', color: KIND_COLORS.grb },
  { key: 'gw', label: 'Gravitational Wave', color: KIND_COLORS.gw },
  { key: 'xray', label: 'X-ray', color: KIND_COLORS.xray },
  { key: 'neutrino', label: 'Neutrino', color: KIND_COLORS.neutrino },
  { key: 'frb', label: 'Fast Radio Burst', color: KIND_COLORS.frb },
];
