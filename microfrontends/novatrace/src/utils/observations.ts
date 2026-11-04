/* Observations reported in an event's circulars.
 *
 * Parsed by data_extraction_microservice/ml/observations.py into `data.observations.rows` on
 * each circular: one row per measured value (magnitude, flux, count rate, …) or limit, with
 * its band, time since trigger, telescope and the sentence it came from. The backfill runs
 * newest circulars first, so older events may have none yet — that is "not parsed", not
 * "not observed".
 */

export interface ObservationRow {
  quantity: string | null;       // magnitude | flux | flux_density | count_rate | …
  kind: 'detection' | 'upper_limit' | 'depth' | string | null;
  object: 'counterpart' | 'host' | 'field_source' | 'comparison' | 'other' | string | null;
  object_name?: string | null;
  value: number | null;
  unit: string | null;
  error?: number | null;
  error_plus?: number | null;
  error_minus?: number | null;
  band: string | null;
  telescope: string | null;
  instrument: string | null;
  time_since_trigger_s: number | null;
  time?: string | null;
  exposure_s?: number | null;
  analysis?: 'preliminary' | 'refined' | null;
  quote: string | null;
}

export type Regime = 'gamma' | 'xray' | 'uv' | 'optical' | 'nir' | 'radio' | 'other';

export const REGIMES: { id: Regime; label: string }[] = [
  { id: 'gamma', label: 'Gamma-ray' },
  { id: 'xray', label: 'X-ray' },
  { id: 'uv', label: 'UV' },
  { id: 'optical', label: 'Optical' },
  { id: 'nir', label: 'Near-IR' },
  { id: 'radio', label: 'Radio' },
  { id: 'other', label: 'Other' },
];

/** Band as written ("r", "Rc", "0.3-10 keV", "15 GHz", "UVW1", "Ks") → its regime. */
export function regimeOf(band: string | null, unit: string | null = null): Regime {
  const b = (band ?? '').trim();
  const s = `${b} ${unit ?? ''}`;
  if (/GHz|MHz|\d\s*(?:cm|mm)\b|millimet/i.test(s)) return 'radio';
  if (/MeV|GeV|TeV/i.test(s)) return 'gamma';
  if (/keV/i.test(s)) {
    const hi = Number((s.match(/(\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)\s*keV/i) ?? [])[2]);
    return Number.isFinite(hi) && hi > 30 ? 'gamma' : 'xray';
  }
  if (/^(?:UVW1|UVW2|UVM2|UVOT\s*u|u\s*\(UVOT\)|white|NUV|FUV)$/i.test(b) || /\bUVW|UVM/i.test(b)) return 'uv';
  if (/^(?:J|H|K|Ks|Kp|Y|W1|W2)\b/.test(b) || /\b(?:J|H|Ks?)-band\b/i.test(b)) return 'nir';
  if (/^(?:[ugrizyUBVRIcwoLGC]|Rc|Ic|R_?c|I_?c|g'|r'|i'|z'|clear|CR|Clear|unfiltered|L|lum|TESS|Gaia|G|BP|RP|o|c|w|VT_[BR]|white light)\b/i.test(b)) return 'optical';
  if (/^X-?ray/i.test(b)) return 'xray';
  if (/^(?:Sloan|SDSS|PS1|Pan-STARRS)\s*[ugriz]'?$/i.test(b) || /^F\d{3}[WMN]$/.test(b)) return 'optical';
  // No band given: a magnitude is almost always optical, a count rate almost always XRT.
  if (/\bmag\b/i.test(unit ?? '')) return 'optical';
  if (!b && /^(?:c(?:ou)?n?ts?|c)\/s(?:ec)?$|^cps$|^counts\/s$/i.test((unit ?? '').trim())) return 'xray';
  return 'other';
}

/** The burst's own light: the afterglow / counterpart. Hosts are shown apart; field and
    comparison stars are not about the event at all. */
export const isEventLight = (o: ObservationRow) => o.object === 'counterpart' || o.object == null;

export interface Observation extends ObservationRow {
  alertKey: string;
  date: string;
  regime: Regime;
}

interface CircularLike { alertKey: string; date: string; data?: { observations?: { rows?: ObservationRow[] } } }

export function eventObservations(circulars: CircularLike[]): Observation[] {
  const out: Observation[] = [];
  for (const c of circulars) {
    for (const o of c.data?.observations?.rows ?? []) {
      if (o.value == null) continue;
      out.push({ ...o, alertKey: c.alertKey, date: c.date, regime: regimeOf(o.band, o.unit) });
    }
  }
  const t = (o: Observation) => o.time_since_trigger_s ?? Number.POSITIVE_INFINITY;
  return out.sort((a, b) => t(a) - t(b) || Date.parse(a.date) - Date.parse(b.date));
}

/* A time more than a year after the trigger is a misread date (GRB 260310A: "T+7344 d"), not a
   late observation. */
const MAX_SINCE_S = 365 * 86400;

/** What the event page shows: the burst's own light, with plausible times. */
export function shownObservations(circulars: CircularLike[]): { obs: Observation[]; hidden: number } {
  const rows = eventObservations(circulars);
  const own = rows.filter(o => isEventLight(o) && (o.time_since_trigger_s == null || o.time_since_trigger_s <= MAX_SINCE_S));
  return { obs: own, hidden: rows.filter(o => !isEventLight(o)).length };
}

/** How many circulars of the event the observations backfill has reached. */
export function observationsCoverage(circulars: CircularLike[]): { parsed: number; total: number } {
  return {
    parsed: circulars.filter(c => Array.isArray(c.data?.observations?.rows)).length,
    total: circulars.length,
  };
}

/** "> 21.3 mag", "18.42 ± 0.05 mag", "1.2e-12 erg/cm²/s". A limit is the fainter/lower bound. */
export function fmtObservationValue(o: ObservationRow): string {
  const v = o.value!;
  const num = Math.abs(v) >= 1e4 || (Math.abs(v) > 0 && Math.abs(v) < 1e-2) ? v.toExponential(2) : String(Number(v.toFixed(3)));
  const isMag = o.quantity === 'magnitude' || /mag/i.test(o.unit ?? '');
  const lim = o.kind === 'upper_limit' || o.kind === 'depth' ? (isMag ? '> ' : '< ') : '';
  const err = o.error != null ? ` ± ${o.error}`
    : o.error_plus != null && o.error_minus != null ? ` +${o.error_plus}/−${Math.abs(o.error_minus)}` : '';
  return `${lim}${num}${err}${o.unit ? ` ${o.unit}` : ''}`;
}

/** Seconds after trigger → "T+42 s", "T+3.2 h", "T+5.1 d". */
export function fmtSinceTrigger(s: number | null): string {
  if (s == null) return '—';
  if (s < 120) return `T+${Math.round(s)} s`;
  if (s < 7200) return `T+${(s / 60).toFixed(0)} min`;
  if (s < 172800) return `T+${(s / 3600).toFixed(1)} h`;
  return `T+${(s / 86400).toFixed(1)} d`;
}
