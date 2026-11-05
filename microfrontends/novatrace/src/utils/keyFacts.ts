/* The handful of numbers a researcher looks for first, beside the model-written summary.
 *
 * Every fact is a value already on the page, taken from structured data, never from the summary text:
 * burst properties (observations v3, object "prompt"), the event's best position, and its energetics
 * (E_iso / redshift chosen per event, NovaTrace event_engine/lib/energetics.ts). Each keeps the
 * circular it came from. A fact the event does not have is left out, not shown as a dash.
 */
import { burstProperties, CATALOG_LABEL, fmtNormalised, fmtObservationValue, type CatalogValues, type Observation, type ObservationRow } from './observations';
import type { RedshiftReport } from './redshift';

export interface KeyFact {
  id: string;
  label: string;
  value: string;
  /** Who reported it ("BAT", "Swift-XRT"), shown muted after the value. */
  by?: string | null;
  /** The circular to open for it. */
  alertKey?: string | null;
  /** How many other values the event's circulars report for it (Burst properties lists them all). */
  more?: number;
  /** Long values (a position) take a whole row in the phone grid. */
  wide?: boolean;
}

/** Chosen per event by the event engine; absent until the API with energetics is deployed. */
export interface Energetics {
  eiso: { value: number; log10: number; alertKey: string; instrument: string | null; assumedRedshift: number | null } | null;
  redshift: { value: number; kind: string; alertKey: string; instrument: string | null; method: string | null; tentative?: boolean | null } | null;
  epeakRest: { value: number; alertKey: string; instrument: string | null; derived?: string } | null;
}

interface CircularLike { alertKey: string; date: string; data?: { observations?: { rows?: ObservationRow[] } } }

const PROMPT_FACTS: { id: string; label: string }[] = [
  { id: 'duration', label: 'T90' },
  { id: 'fluence', label: 'Fluence' },
  { id: 'epeak', label: 'Epeak' },
  { id: 'peak_flux', label: 'Peak flux' },
];

/** A unit that carries its own power of ten ("1e-07 erg/cm^2") reads better normalised ("5.10 × 10⁻⁷ erg/cm2");
 *  otherwise the value as reported, with its error. */
const factValue = (o: Observation) =>
  (/\d\s*e[-+]?\d|10\s*\^/i.test(o.unit ?? '') && fmtNormalised(o)) || fmtObservationValue(o);

/** One value per property: a burst catalogue's (measured the same way for every burst) over a
 *  circular's, a detection over a limit, a refined analysis over a first look, then the latest. */
function pickProperty(rows: Observation[]): Observation | null {
  const score = (o: Observation) => (o.source === 'catalog' ? 4 : 0) + (o.kind === 'detection' ? 2 : 0) + (o.analysis === 'refined' ? 1 : 0);
  return rows.reduce<Observation | null>((best, o) =>
    !best || score(o) > score(best) || (score(o) === score(best) && Date.parse(o.date) >= Date.parse(best.date)) ? o : best, null);
}

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sci = (v: number) => {
  const e = Math.floor(Math.log10(Math.abs(v)));
  return `${(v / 10 ** e).toFixed(2)} × 10${String(e).replace(/./g, c => SUP[c] ?? c)}`;
};

export function keyFacts({ circulars, catalogs, position, redshifts, energetics }: {
  circulars: CircularLike[];
  catalogs?: CatalogValues[];
  position: { text: string; by: string | null; alertKey: string | null } | null;
  redshifts: RedshiftReport[];
  energetics: Energetics | null | undefined;
}): KeyFact[] {
  const facts: KeyFact[] = [];
  if (position) facts.push({ id: 'position', label: 'Position', value: position.text, by: position.by, alertKey: position.alertKey, wide: true });

  const props = burstProperties(circulars, catalogs);
  for (const p of PROMPT_FACTS) {
    // Epeak in the burst's rest frame is a different number; the observed one is what the instruments report.
    const rows = props.filter(o => o.quantity === p.id && (o as { frame?: string | null }).frame !== 'rest');
    const o = pickProperty(rows);
    if (o) facts.push({
      id: p.id, label: p.label, value: factValue(o),
      by: o.source === 'catalog' ? CATALOG_LABEL[o.catalog ?? ''] ?? o.catalog : o.instrument || o.telescope,
      alertKey: o.source === 'catalog' ? null : o.alertKey, more: rows.length - 1,
    });
  }

  const z = energetics?.redshift;
  if (z) {
    const value = `${z.kind === 'upper_limit' ? '< ' : z.kind === 'lower_limit' ? '> ' : ''}${z.value}${z.tentative ? ' (tentative)' : ''}`;
    facts.push({ id: 'redshift', label: 'Redshift', value, by: z.method === 'spectroscopic' ? 'spectroscopic' : z.method === 'photometric' ? 'photometric' : null, alertKey: z.alertKey });
  } else if (redshifts.length) {
    facts.push({ id: 'redshift', label: 'Redshift', value: redshifts[0].display, alertKey: redshifts[0].alertKey, more: redshifts.length - 1 });
  }

  const e = energetics?.eiso;
  if (e) {
    facts.push({ id: 'eiso', label: 'E_iso', value: `${sci(e.value)} erg`, by: e.instrument, alertKey: e.alertKey });
  }
  return facts;
}
