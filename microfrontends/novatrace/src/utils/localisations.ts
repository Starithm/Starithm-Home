/* Every localisation of an event, from its notices and its circulars.
 *
 * Circular positions are parsed by data_extraction_microservice/ml/positions.py and arrive
 * on each circular as `data.positions.rows`: one row per position the circular reports, with
 * the instrument, whether it localises the event itself or a counterpart (an afterglow), and
 * the error as a shape in degrees ({type: 'circle', radius} or IceCube's asymmetric one).
 *
 * The event's own position is the event engine's pick across all of these (positionSource on
 * the public event). This module only lists them; it never re-decides the winner.
 */

export interface PositionRow {
  ra_deg: number;
  dec_deg: number;
  error: { type: string; radius?: number; ra_plus?: number; ra_minus?: number; dec_plus?: number; dec_minus?: number; containment?: string | null } | null;
  instrument: string | null;
  of: 'event' | 'counterpart' | null;
  tentative: boolean;
  quote: string;
  event?: string | null;
}

export type PositionSource =
  | { kind: 'notice'; id: string; topic?: string | null }
  | { kind: 'circular'; alertKey: string; instrument: string; of: string | null };

export interface Localisation {
  instrument: string;
  /** 'event': the instrument localised the burst itself; 'counterpart': an afterglow or candidate. */
  role: 'event' | 'counterpart';
  raDeg: number;
  decDeg: number;
  /** Radius of a circle enclosing the error, degrees; null when none was given. */
  errorDeg: number | null;
  containment: string | null;
  tentative: boolean;
  /** When it was reported: the notice's production time or the circular's date. */
  at: string | null;
  from: { kind: 'notice'; id: string; topic: string } | { kind: 'circular'; alertKey: string };
  quote: string | null;
}

interface NoticeLike {
  id: string; topic: string; sourceName?: string | null; producedAt: string | null; t0: string | null;
  raDeg: number | null; decDeg: number | null; posErrorDeg: unknown;
}
interface CircularLike { alertKey: string; date: string; data?: { positions?: { rows?: PositionRow[] } } }

function radius(e: unknown): number | null {
  if (e == null) return null;
  if (typeof e === 'number') return e > 0 ? e : null;
  const o = e as any;
  const r = o.type === 'asymmetric' ? Math.max(o.ra_plus, o.ra_minus, o.dec_plus, o.dec_minus) : Number(o.radius);
  return Number.isFinite(r) && r > 0 ? r : null;
}

/** "Fermi GBM", "Einstein Probe WXT", "SVOM" → the names the parser uses, so one instrument is one row. */
function noticeInstrument(n: NoticeLike): string {
  const s = `${n.sourceName ?? ''} ${n.topic}`;
  if (/GBM/i.test(s)) return 'Fermi-GBM';
  if (/LAT/.test(s)) return 'Fermi-LAT';
  if (/BAT/.test(s)) return 'Swift-BAT';
  if (/XRT/.test(s)) return 'Swift-XRT';
  if (/UVOT/.test(s)) return 'Swift-UVOT';
  if (/WXT/i.test(s)) return 'EP-WXT';
  if (/FXT/i.test(s)) return 'EP-FXT';
  if (/ECLAIRs|svom/i.test(s)) return 'SVOM-ECLAIRs';
  if (/IceCube/i.test(s)) return 'IceCube';
  return n.sourceName || n.topic;
}

export function eventLocalisations(notices: NoticeLike[], circulars: CircularLike[]): Localisation[] {
  const out: Localisation[] = [];
  for (const n of notices) {
    if (n.raDeg == null || n.decDeg == null || (n.raDeg === 0 && n.decDeg === 0)) continue;
    const e = n.posErrorDeg as any;
    out.push({
      instrument: noticeInstrument(n), role: 'event', raDeg: n.raDeg, decDeg: n.decDeg,
      errorDeg: radius(e), containment: e && typeof e === 'object' ? e.containment ?? null : null,
      tentative: false, at: n.producedAt || n.t0, from: { kind: 'notice', id: n.id, topic: n.topic }, quote: null,
    });
  }
  for (const c of circulars) {
    for (const p of c.data?.positions?.rows ?? []) {
      if (!p.instrument) continue;
      out.push({
        instrument: p.instrument, role: p.of === 'event' ? 'event' : 'counterpart',
        raDeg: p.ra_deg, decDeg: p.dec_deg, errorDeg: radius(p.error), containment: p.error?.containment ?? null,
        tentative: p.tentative, at: c.date, from: { kind: 'circular', alertKey: c.alertKey }, quote: p.quote,
      });
    }
  }
  return out.sort((a, b) => (a.at ? Date.parse(a.at) : 0) - (b.at ? Date.parse(b.at) : 0));
}

/** The localisation the event's position came from, or null when it can't be told. */
export function bestLocalisation(locs: Localisation[], source: PositionSource | null | undefined, raDeg: number | null, decDeg: number | null): Localisation | null {
  if (source?.kind === 'notice') return locs.find(l => l.from.kind === 'notice' && l.from.id === source.id) ?? null;
  if (source?.kind === 'circular') {
    return locs.find(l => l.from.kind === 'circular' && l.from.alertKey === source.alertKey && l.instrument === source.instrument
      && (raDeg == null || Math.abs(l.raDeg - raDeg) < 1e-6)) ?? null;
  }
  // Older API without positionSource: the localisation at the event's position.
  if (raDeg == null || decDeg == null) return null;
  return locs.find(l => Math.abs(l.raDeg - raDeg) < 1e-6 && Math.abs(l.decDeg - decDeg) < 1e-6) ?? null;
}

export interface InstrumentSeen {
  instrument: string;
  role: 'event' | 'counterpart';
  /** Its smallest error; null when it never gave one. */
  bestErrorDeg: number | null;
  first: Localisation;
  count: number;
}

/** One entry per instrument that reported a position: localisers first, then counterparts, each in order of first report. */
export function instrumentsSeen(locs: Localisation[]): InstrumentSeen[] {
  const by = new Map<string, InstrumentSeen>();
  for (const l of locs) {
    if (l.tentative) continue;
    const cur = by.get(l.instrument);
    if (!cur) { by.set(l.instrument, { instrument: l.instrument, role: l.role, bestErrorDeg: l.errorDeg, first: l, count: 1 }); continue; }
    cur.count++;
    if (l.role === 'event') cur.role = 'event';
    if (l.errorDeg != null && (cur.bestErrorDeg == null || l.errorDeg < cur.bestErrorDeg)) cur.bestErrorDeg = l.errorDeg;
  }
  const t = (x: InstrumentSeen) => (x.first.at ? Date.parse(x.first.at) : 0);
  return [...by.values()].sort((a, b) => (a.role === b.role ? t(a) - t(b) : a.role === 'event' ? -1 : 1));
}
