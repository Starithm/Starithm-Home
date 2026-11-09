/* Observations reported in an event's circulars.
 *
 * Parsed by data_extraction_microservice/ml/observations.py into `data.observations.rows` on
 * each circular: one row per measured value (magnitude, flux, count rate, …) or limit, with
 * its band, time since trigger, telescope and the sentence it came from. The backfill runs
 * newest circulars first, so older events may have none yet — that is "not parsed", not
 * "not observed".
 */

export interface ObservationRow {
  quantity: string | null;       // magnitude | flux | flux_density | count_rate | (prompt) duration | fluence | peak_flux | photon_index | epeak | …
  kind: 'detection' | 'upper_limit' | 'depth' | string | null;
  /** 'prompt' (v3): the burst's own emission as the triggering instrument saw it. */
  object: 'counterpart' | 'prompt' | 'host' | 'field_source' | 'comparison' | 'other' | string | null;
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
  spectral_model?: 'power_law' | 'cutoff_power_law' | 'band' | 'blackbody' | 'other' | null;
  quote: string | null;
  /** Units, bands and magnitude systems on one footing (ml/units.py); the fields above stay as written. */
  norm?: ObservationNorm | null;
  /** 'catalog': from a burst catalogue (event.catalogValues), not a circular. */
  source?: 'catalog' | null;
  catalog?: string | null;
  catalog_id?: string | null;
}

/** The event's own values from burst catalogues (NovaTrace scripts/main/enrich/gbm-catalog.ts). */
export interface CatalogValues { catalog: string; catalogId: string; matchedBy: string; fetchedAt: string; rows: ObservationRow[] }

export const CATALOG_LABEL: Record<string, string> = { fermigbrst: 'GBM catalogue', swift_grb_table: 'Swift GRB table' };

/** The catalogue's own page for the entry: GBM's per-burst data directory ("GRB261017670" → bn261017670),
 *  the Swift GRB table's page for the burst ("261017A"). */
export function catalogUrl(o: ObservationRow): string | null {
  if (o.catalog === 'swift_grb_table' && o.catalog_id) {
    return `https://swift.gsfc.nasa.gov/archive/grb_table/fullview/${o.catalog_id}/`;
  }
  if (o.catalog === 'fermigbrst' && o.catalog_id?.startsWith('GRB')) {
    const bn = o.catalog_id.slice(3);
    return `https://heasarc.gsfc.nasa.gov/FTP/fermi/data/gbm/bursts/20${bn.slice(0, 2)}/bn${bn}/`;
  }
  return null;
}

/** `norm` beside each row: a flux density at one frequency when one can be derived, plus every
 *  assumption made to get there. Absent on rows stored before the normaliser ran. */
export interface ObservationNorm {
  dim: string | null;           // flux_density | energy_flux | fluence | photon_flux | count_rate | magnitude | …
  value?: number | null;
  unit?: string | null;
  system?: 'AB' | 'Vega' | null;
  nu_hz?: number | null;
  e_lo_kev?: number | null;
  e_hi_kev?: number | null;
  fnu_mjy?: number | null;
  fnu_err_minus?: number | null;
  fnu_err_plus?: number | null;
  notes?: string[];
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

/* Burst properties (v3 object "prompt"), in the order the Swift GRB table lists them. */
export const PROMPT_PROPERTIES: { id: string; label: string }[] = [
  { id: 'duration', label: 'Duration' },
  { id: 'fluence', label: 'Fluence' },
  { id: 'peak_flux', label: 'Peak flux' },
  { id: 'photon_index', label: 'Photon index' },
  { id: 'epeak', label: 'Epeak' },
];

export const SPECTRAL_MODEL_LABEL: Record<string, string> = {
  power_law: 'PL', cutoff_power_law: 'CPL', band: 'Band', blackbody: 'BB', other: 'other',
};

/** The burst's own properties from its circulars and burst catalogues, grouped by property in
 *  PROMPT_PROPERTIES order; within a property the catalogue value first, then circulars by date. */
export function burstProperties(circulars: CircularLike[], catalogs: CatalogValues[] = []): Observation[] {
  const order = new Map(PROMPT_PROPERTIES.map((p, i) => [p.id, i]));
  const fromCatalogs: Observation[] = catalogs.flatMap(c => c.rows.map(o => ({
    ...o, source: 'catalog' as const, alertKey: '', date: c.fetchedAt, regime: regimeOf(o.band, o.unit),
  })));
  const rank = (o: Observation) => (o.source === 'catalog' ? 0 : 1);
  return [...fromCatalogs, ...eventObservations(circulars)]
    .filter(o => o.object === 'prompt' && order.has(o.quantity ?? ''))
    .sort((a, b) => order.get(a.quantity!)! - order.get(b.quantity!)! || rank(a) - rank(b) || Date.parse(a.date) - Date.parse(b.date));
}

/* A time more than a year after the trigger is a misread date (GRB 260310A: "T+7344 d"), not a
   late observation. */
const MAX_SINCE_S = 365 * 86400;

/** What the event page shows: the burst's own light, with plausible times. */
export function shownObservations(circulars: CircularLike[]): { obs: Observation[]; hidden: number } {
  const rows = eventObservations(circulars);
  const own = rows.filter(o => isEventLight(o) && (o.time_since_trigger_s == null || o.time_since_trigger_s <= MAX_SINCE_S));
  // Hidden = other objects' light (hosts, field and comparison stars); burst properties have their own section.
  return { obs: own, hidden: rows.filter(o => !isEventLight(o) && o.object !== 'prompt').length };
}

/** How many circulars of the event the observations backfill has reached. */
export function observationsCoverage(circulars: CircularLike[]): { parsed: number; total: number } {
  return {
    parsed: circulars.filter(c => Array.isArray(c.data?.observations?.rows)).length,
    total: circulars.length,
  };
}

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const pow10 = (e: number) => `10${String(e).replace(/./g, c => SUP[c] ?? c)}`;

/** "> 21.3 mag", "18.42 ± 0.05 mag", "1.2e-12 erg/cm²/s". A limit is the fainter/lower bound. */
/** A catalogue value with its error, rounded the way a paper would print it: the error to 2
 *  significant figures, the value to the same decimal place ("0.704 ± 0.045 s", "6.90 ± 0.11 ×10⁻⁷").
 *  Catalogues store full float precision; circular values are shown exactly as written instead. */
function fmtCatalogValue(row: ObservationRow): string {
  // A unit carrying its own power of ten ("1e-7 erg/cm2", Swift's table) is folded into the number,
  // using the normalised value: 14 ± 1 "1e-7 erg/cm2" → (1.40 ± 0.10) ×10⁻⁶ erg/cm2.
  const n = row.norm;
  const k0 = n?.value != null && row.value ? n.value / row.value : 1;
  const o: ObservationRow = /\d\s*e[-+]?\d|10\s*\^/i.test(row.unit ?? '') && n?.unit && k0 !== 1 ? {
    ...row, value: n.value!, unit: n.unit,
    error: row.error != null ? row.error * k0 : null,
    error_plus: row.error_plus != null ? row.error_plus * k0 : null,
    error_minus: row.error_minus != null ? row.error_minus * k0 : null,
  } : row;
  const v = o.value!;
  const errs = [o.error, o.error_plus, o.error_minus].filter((e): e is number => e != null && e > 0);
  const e = Math.floor(Math.log10(Math.abs(v)));
  const sci = Math.abs(v) >= 1e4 || (Math.abs(v) > 0 && Math.abs(v) < 1e-2);
  const k = sci ? 10 ** e : 1;                                    // shown as mantissa × 10^e
  const places = errs.length ? Math.max(0, 1 - Math.floor(Math.log10(Math.min(...errs) / k))) : 3;
  // No error to round to: as stored, to 3 decimals at most ("89.36 s", not "89.360 s").
  const f = (x: number) => (errs.length ? (x / k).toFixed(Math.min(places, 6)) : String(Number((x / k).toFixed(3))));
  const sym = o.error ?? (o.error_plus != null && o.error_plus === Math.abs(o.error_minus ?? NaN) ? o.error_plus : null);
  const err = sym != null ? ` ± ${f(sym)}`
    : o.error_plus != null && o.error_minus != null ? ` +${f(o.error_plus)}/−${f(Math.abs(o.error_minus))}` : '';
  const body = err && sci ? `(${f(v)}${err})` : `${f(v)}${err}`;
  return `${body}${sci ? ` ×${pow10(e)}` : ''}${o.unit ? ` ${o.unit}` : ''}`;
}

export function fmtObservationValue(o: ObservationRow): string {
  if (o.source === 'catalog' && o.value != null) return fmtCatalogValue(o);
  const v = o.value!;
  const num = Math.abs(v) >= 1e4 || (Math.abs(v) > 0 && Math.abs(v) < 1e-2) ? v.toExponential(2) : String(Number(v.toFixed(3)));
  const isMag = o.quantity === 'magnitude' || /mag/i.test(o.unit ?? '');
  const lim = o.kind === 'upper_limit' || o.kind === 'depth' ? (isMag ? '> ' : '< ') : '';
  const err = o.error != null ? ` ± ${o.error}`
    : o.error_plus != null && o.error_minus != null ? ` +${o.error_plus}/−${Math.abs(o.error_minus)}` : '';
  // The model sometimes keeps the unit but drops the "x 10^-13" after the number; the normaliser reads
  // it back from the circular's sentence (norm.notes "scale_from_quote"), so show it as written there.
  const n = o.norm;
  const recovered = n?.notes?.includes('scale_from_quote') && n.value && v ? Math.round(Math.log10(Math.abs(n.value / v))) : 0;
  const scale = recovered ? ` ×${pow10(recovered)}` : '';
  return `${lim}${num}${err}${scale}${o.unit ? ` ${o.unit}` : ''}`;
}

/** Seconds after trigger → "T+42 s", "T+3.2 h", "T+5.1 d". */
export function fmtSinceTrigger(s: number | null): string {
  if (s == null) return '—';
  if (s < 120) return `T+${Math.round(s)} s`;
  if (s < 7200) return `T+${(s / 60).toFixed(0)} min`;
  if (s < 172800) return `T+${(s / 3600).toFixed(1)} h`;
  return `T+${(s / 86400).toFixed(1)} d`;
}

/** When the value was measured, in UTC: trigger time plus time since trigger, "2026-10-17 16:22".
 *  The row's own `time` is the text as written (a start, a mid-point, a date), so it isn't used. */
export function fmtObservationUtc(t0: string | null | undefined, s: number | null): string {
  if (!t0 || s == null) return '—';
  const d = new Date(new Date(t0).getTime() + s * 1000);
  return Number.isNaN(d.getTime()) ? '—' : d.toISOString().slice(0, 16).replace('T', ' ');
}

/** Exposure as reported: "300 s", "1.2 ks". */
export function fmtExposure(s: number | null | undefined): string {
  if (s == null) return '—';
  return s >= 1000 ? `${(s / 1000).toFixed(s >= 10000 ? 0 : 1)} ks` : `${Math.round(s)} s`;
}

/* ── normalised values ─────────────────────────────────────────────────── */


/** A flux density in the unit that keeps it readable: "7.52 mJy", "82 µJy", "3.5 nJy". */
export function fmtFluxDensity(mjy: number, errMinus?: number | null, errPlus?: number | null): string {
  const [scale, unit] = Math.abs(mjy) >= 1e3 ? [1e-3, 'Jy'] : Math.abs(mjy) >= 1 ? [1, 'mJy'] : Math.abs(mjy) >= 1e-3 ? [1e3, 'µJy'] : [1e6, 'nJy'];
  const v = mjy * scale;
  // The error takes the value's precision: "201 ± 7 µJy", not "201 ± 7.42 µJy".
  const places = Math.abs(v) >= 100 ? 0 : Math.abs(v) >= 10 ? 1 : 2;
  const digits = (x: number) => x.toFixed(places);
  if (errMinus == null || errPlus == null) return `${digits(v)} ${unit}`;
  const lo = errMinus * scale, hi = errPlus * scale;
  return Math.abs(hi - lo) <= 0.05 * Math.max(hi, lo)
    ? `${digits(v)} ± ${digits((lo + hi) / 2)} ${unit}`
    : `${digits(v)} +${digits(hi)}/−${digits(lo)} ${unit}`;
}

/** Where on the spectrum: radio in GHz, optical/IR/UV as a wavelength, X-ray as an energy. */
export function fmtFrequency(nu: number): string {
  if (nu < 3e11) return nu >= 1e9 ? `${Number((nu / 1e9).toPrecision(3))} GHz` : `${Number((nu / 1e6).toPrecision(3))} MHz`;
  if (nu < 3e16) {
    const nm = 2.99792458e17 / nu;
    return nm >= 1000 ? `${Number((nm / 1000).toPrecision(3))} µm` : `${Math.round(nm)} nm`;
  }
  const kev = nu / 2.417989e17;
  return `${Number(kev.toPrecision(3))} keV`;
}

/** A normalised value as one string, or null when this row has none to show. */
export function fmtNormalised(o: ObservationRow): string | null {
  const n = o.norm;
  if (!n) return null;
  const lim = o.kind === 'upper_limit' || o.kind === 'depth' ? '< ' : '';
  if (n.fnu_mjy != null) {
    return `${lim}${fmtFluxDensity(n.fnu_mjy, lim ? null : n.fnu_err_minus, lim ? null : n.fnu_err_plus)}`;
  }
  if (n.value != null && n.unit) {
    const e = Math.floor(Math.log10(Math.abs(n.value)));
    const v = Math.abs(e) >= 3 ? `${(n.value / 10 ** e).toFixed(2)}×${pow10(e)}` : String(Number(n.value.toPrecision(3)));
    return `${lim}${v} ${n.unit}`;
  }
  return null;
}

/** Where the normalised value sits, for the column beside it: "at 641 nm", "at 1 keV", "0.3–10 keV". */
export function fmtNormalisedAt(o: ObservationRow): string | null {
  const n = o.norm;
  if (!n) return null;
  if (n.fnu_mjy != null && n.nu_hz != null) return fmtFrequency(n.nu_hz);
  if (n.e_lo_kev != null) return n.e_hi_kev != null ? `${n.e_lo_kev}–${n.e_hi_kev} keV` : `> ${n.e_lo_kev} keV`;
  return null;
}

/** Plain-language versions of norm.notes, for the reader to weigh the conversion. */
export function normAssumptions(o: ObservationRow): string[] {
  const n = o.norm;
  if (!n?.notes?.length) return [];
  const out: string[] = [];
  for (const note of n.notes) {
    if (note === 'system_assumed') out.push(`${n.system ?? 'Vega'} system assumed`);
    else if (note === 'unfiltered_as_R') out.push('unfiltered, treated as R');
    else if (note === 'photographic_R') out.push('photographic R, treated as R');
    else if (note === 'photon_index_assumed') out.push('photon index 2 assumed');
    else if (note === 'scale_from_quote') out.push('power of ten read from the text');
    else if (note === 'per_beam') out.push('per beam');
    else if (note === 'log_assumed') out.push('read as a log');
  }
  return out;
}
