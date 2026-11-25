import React from 'react';
import { Link } from 'react-router-dom';
import {
  SectionHead, SectionNote, Card, Muted, TableWrap, Table, MiniLabel,
  Disclaimer,
} from '../styled_pages/EventRecord.styled';
import { EventSkyMap, type PointKind, type SkyPoint, type SkyRegion } from './EventSkyMap';
import { RecordSection, SectionToggle } from './RecordSection';
import { utcMinute } from '@shared/utils/time';

/* Everything NovaTrace found around an event, in one section: other events cross-match grouped
 * with it, optical candidates from the cone search (Lasair Rubin/ZTF, TNS) with the cross-match
 * model's scores, Rubin sources in a wide error region (Fink), and known catalogued sources in the
 * region (4FGL, TeVCat, XMM, ROSAT, Swift-XRT via HEASARC). Shapes mirror the crossMatch / optical / catalog
 * fields of GET /api/public/events/:canonicalId. None of it is a confirmed counterpart. */

export interface RelatedEvent {
  canonicalId: string; name: string | null; alertKind: string | null;
  confidence: number | null; matchMethod: string | null; fap: number | null;
  /** Matched to another member, not to this event: its name (cross-match pairs, 2026-11-14). */
  viaName?: string | null;
}
export interface OpticalCandidate {
  objectId: string; brokers: string[]; url: string | null; ra?: number | null; dec?: number | null; separationArcsec: number | null;
  dtTriggerMin: number | null; mag: number | null; magFilter: string | null;
  finkClass: string | null; finkClassScore: number | null; sherlockClass: string | null; tnsClass: string | null;
  llmConfidence: number | null; llmReason: string | null;
}
export interface RegionSource {
  objectId: string; url: string | null; ra?: number | null; dec?: number | null; separationDeg: number | null; dtTriggerMin: number | null;
  nDetections: number | null; mag: number | null; magFilter: string | null;
  finkClass: string | null; finkClassScore: number | null;
}
/* One source from data_extraction_microservice/catalogs/heasarc.py; `extra` holds catalog-specific fields. */
export interface CatalogSource {
  catalog: string; name: string; ra: number | null; dec: number | null; sep_deg: number | null; err_deg: number | null;
  class: string | null; assoc: string | null; flux: number | null; flux_unit: string | null;
  variable: boolean | null; url?: string | null; extra?: Record<string, unknown>;
  /* With a map region: the smallest credible region holding the source (0.2 = the 20% region). */
  region_level?: number | null;
}
export interface Counterparts {
  crossMatch: { reasoning: string | null; related: RelatedEvent[] } | null;
  optical: {
    queriedAt: string | null; candidates: OpticalCandidate[];
    region: { queriedAt: string; radiusDeg: number | null; sources: RegionSource[] } | null;
  } | null;
  catalog?: {
    queriedAt: string | null; radiusDeg: number | null; sources: CatalogSource[];
    /* With a map region, `core` counts the 50% region and `chance` what the region holds by chance. */
    catalogs: Record<string, { total: number | null; kept: number; error?: string; core?: number; chance?: number | null }>;
    /* The localisation map's credible region, when that was searched instead of a circle. */
    region?: SkyRegion | null;
  } | null;
}

const CATALOG_LABEL: Record<string, string> = { '4FGL': 'Fermi-LAT 4FGL', TeVCat: 'TeVCat', XMM: 'XMM 5XMM', '2RXS': 'ROSAT 2RXS', '2SXPS': 'Swift-XRT 2SXPS' };
// Display order, gamma-ray first. Not the stored order: JSONB re-sorts keys (2RXS, 2SXPS, 4FGL, XMM).
const CATALOG_ORDER = ['4FGL', 'TeVCat', 'XMM', '2SXPS', '2RXS'];
const GAMMA = ['4FGL', 'TeVCat'];



const pct = (x: number | null) => (x == null ? '—' : `${Math.round(x * 100)}%`);
const utc = (iso: string | null) => (iso ? `${utcMinute(iso)} UTC` : null);
function since(min: number | null): string {
  if (min == null) return '—';
  const h = min / 60;
  return `T${h < 0 ? '−' : '+'}${Math.abs(h) < 48 ? `${Math.abs(h).toFixed(1)}h` : `${Math.abs(h / 24).toFixed(1)}d`}`;
}
const mag = (m: number | null, band: string | null) => (m == null ? '—' : `${m.toFixed(1)}${band ? ` ${band}` : ''}`);
const survey = (brokers: string[]) => brokers.map(b => b.replace(/^Lasair-/, '')).join(' · ') || '—';
function candidateClass(c: OpticalCandidate): React.ReactNode {
  if (c.finkClass) return <>{c.finkClass}{c.finkClassScore != null && <Muted> {pct(c.finkClassScore)}</Muted>}</>;
  if (c.tnsClass) return <>TNS: {c.tnsClass}</>;
  if (c.sherlockClass) return <>Host: {c.sherlockClass}</>;
  return '—';
}
const Ext = ({ href, children }: { href: string | null; children: React.ReactNode }) =>
  href ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{children}</a> : <>{children}</>;

/* Related events and optical sources. Known catalog sources are left out: a 0.5° X-ray field holds
 * a couple of hundred, which would drown the rail count. */
export function counterpartsCount(c: Counterparts): number {
  return (c.crossMatch?.related.length ?? 0) + (c.optical?.candidates.length ?? 0) + (c.optical?.region?.sources.length ?? 0);
}

/* Whether the section has anything to show, catalog sources included. */
export const hasCounterparts = (c: Counterparts) => counterpartsCount(c) > 0 || (c.catalog?.sources.length ?? 0) > 0
  || emptySearches(c.catalog).length > 0;

/* Catalogs searched that hold nothing in the region. For a neutrino the first question is whether a
 * gamma-ray blazar sits in it, and an empty 4FGL search answers it (IceCube-260930A, 2026-11-16). */
function emptySearches(cat: Counterparts['catalog']): string[] {
  if (!cat) return [];
  return CATALOG_ORDER.filter(n => cat.catalogs[n] && !cat.catalogs[n].error && cat.catalogs[n].total === 0).map(n => CATALOG_LABEL[n]);
}
/* "A, B or C" */
const orList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}`);

const num = (v: unknown) => (typeof v === 'number' ? (Math.abs(v) < 1e-3 || Math.abs(v) >= 1e5 ? v.toExponential(2) : String(+v.toFixed(3))) : String(v));

/* Every source with coordinates, as map points with their details-card rows. */
function skyPoints(c: Counterparts): SkyPoint[] {
  const pts: SkyPoint[] = [];
  for (const o of c.optical?.candidates ?? []) {
    if (o.ra == null || o.dec == null) continue;
    pts.push({
      key: `optical:${o.objectId}`, kind: 'optical', name: o.objectId, ra: o.ra, dec: o.dec, url: o.url,
      sepDeg: o.separationArcsec != null ? o.separationArcsec / 3600 : null,
      details: [['Survey', survey(o.brokers)], ['First seen', since(o.dtTriggerMin)], ['Mag', mag(o.mag, o.magFilter)],
        ['Class', candidateClass(o)], ['Model score', o.llmConfidence == null ? null : pct(o.llmConfidence)], ['Model reason', o.llmReason]],
    });
  }
  for (const r of c.optical?.region?.sources ?? []) {
    if (r.ra == null || r.dec == null) continue;
    pts.push({
      key: `region:${r.objectId}`, kind: 'region', name: r.objectId, ra: r.ra, dec: r.dec, url: r.url, sepDeg: r.separationDeg,
      details: [['First seen', since(r.dtTriggerMin)], ['Detections', r.nDetections], ['Mag', mag(r.mag, r.magFilter)],
        ['Fink class', r.finkClass ? `${r.finkClass}${r.finkClassScore != null ? ` (${pct(r.finkClassScore)})` : ''}` : null]],
    });
  }
  // Sources of one deep archival observation fold into one list row (pointings).
  const groupOf = new Map<CatalogSource, string>();
  for (const g of pointings(c.catalog?.sources ?? [])) for (const s of g) groupOf.set(s, pointingLabel(g));
  for (const s of c.catalog?.sources ?? []) {
    if (s.ra == null || s.dec == null || !CATALOG_LABEL[s.catalog]) continue;
    pts.push({
      group: groupOf.get(s),
      key: `${s.catalog}:${s.name}`, kind: s.catalog as PointKind, name: s.name, ra: s.ra, dec: s.dec, sepDeg: s.sep_deg, url: s.url ?? null,
      level: s.region_level ?? null, minor: s.catalog === '4FGL' && !s.assoc,
      details: [['Class', s.class], ['Association', s.assoc], ['Variable', s.variable == null ? null : s.variable ? 'yes' : 'no'],
        ['Flux', s.flux == null ? null : <>{s.flux.toExponential(2)} <Muted>{s.flux_unit}</Muted></>],
        ...Object.entries(s.extra ?? {}).map(([k, v]) => [k.replace(/_/g, ' '), num(v)] as [string, React.ReactNode])],
    });
  }
  return pts;
}

/* Under the map: the region searched, how many sources sit in its core and how many it would hold
 * by chance, which catalogs kept only their brightest sources or failed, and that X-ray catalogs
 * are left out of wide regions (heasarc.py searches them up to 1°). */
function catalogNote(cat: Counterparts['catalog']): React.ReactNode {
  if (!cat) return null;
  const region = cat.region?.areaDeg2 != null
    ? ` inside the ${Math.round((cat.region.level ?? 0.9) * 100)}% localisation region (${Math.round(cat.region.areaDeg2).toLocaleString()} deg²)` : '';
  const xray = Object.keys(cat.catalogs).some(n => !GAMMA.includes(n)) ? '' : ' X-ray catalogs are searched only in regions up to 1° across.';
  const core = `${Math.round((cat.region?.coreLevel ?? 0.5) * 100)}%`;
  const parts = CATALOG_ORDER.filter(n => cat.catalogs[n]).map(n => {
    const m = cat.catalogs[n];
    if (m.error) return `${n}: lookup failed`;
    if (cat.region && m.total != null) {
      return [`${n}: ${m.total.toLocaleString()}`, m.core != null && `${m.core} in the ${core} region`,
        m.chance != null && `~${Math.round(m.chance)} expected by chance`].filter(Boolean).join(', ');
    }
    return m.total != null && m.kept < m.total ? `${n}: ${m.kept} brightest of ${m.total.toLocaleString()}` : null;
  }).filter(Boolean);
  return `Known sources from HEASARC${region}.${parts.length ? ` ${parts.join(' · ')}.` : ''}${xray}${pointingNote(cat.sources)}`;
}

/* X-ray sources sharing one observation (same start time), 5 or more, are one archival pointing's
 * field: faint background sources that show where the telescope looked, not candidates
 * (IceCube-261020A: 21 XMM sources from a 2017 observation at the edge of the region). Same rule as
 * NovaTrace's event-html-generator splitPointings. */
function pointings(sources: CatalogSource[]): CatalogSource[][] {
  const groups = new Map<string, CatalogSource[]>();
  for (const s of sources) {
    const t = s.extra?.first_mjd;
    if ((s.catalog === 'XMM' || s.catalog === '2SXPS') && typeof t === 'number') {
      const k = `${s.catalog}|${t}`;
      groups.set(k, [...(groups.get(k) ?? []), s]);
    }
  }
  return [...groups.values()].filter(g => g.length >= 5);
}
const pointingDate = (g: CatalogSource[]) => new Date(((g[0].extra!.first_mjd as number) - 40587) * 86400000).toISOString().slice(0, 10);
const pointingLabel = (g: CatalogSource[]) => `${g.length} ${g[0].catalog} sources from one observation, ${pointingDate(g)}`;

function pointingNote(sources: CatalogSource[]): string {
  return pointings(sources).map(g =>
    ` ${g.length} ${g[0].catalog} sources come from one archival observation (${pointingDate(g)}): a deep X-ray image holds many faint background sources wherever it points.`).join('');
}

/* Only blocks with something in them render; with nothing at all, neither does the section (the
 * page's rail drops its entry too, via counterpartsCount). */
export function EventCounterparts({ data, position }: {
  data: Counterparts; position: { raDeg: number; decDeg: number; errorDeg: number | null } | null;
}) {
  const related = data.crossMatch?.related ?? [];
  const optical = data.optical;
  const candidates = optical?.candidates ?? [];
  if (!hasCounterparts(data)) return null;
  const points = position ? skyPoints(data) : [];
  // Catalogued sources are what is known in the region, not counterpart candidates: only related
  // events and optical candidates make this a section of candidates (IceCube-260930A: 34 archival
  // X-ray sources under "Counterparts · candidates").
  const scored = related.length > 0 || candidates.length > 0;
  const empty = emptySearches(data.catalog);

  return (
    <RecordSection id="counterparts">
      <SectionHead>
        <SectionToggle>{scored ? 'Counterparts' : 'Known sources'}</SectionToggle>
        <SectionNote>{scored ? 'Candidates · not confirmed' : 'Catalogued · not candidates'}</SectionNote>
      </SectionHead>
      <Card>
        {related.length > 0 && (
          <>
            <MiniLabel>Related events · {related.length}</MiniLabel>
            <TableWrap>
              <Table>
                <thead><tr><th>Event</th><th>Kind</th><th>Match</th><th>Confidence</th><th>FAP</th></tr></thead>
                <tbody>{related.map(r => (
                  <tr key={r.canonicalId}>
                    <td><Link to={`/novatrace/events/${encodeURIComponent(r.canonicalId)}`} style={{ color: 'inherit' }}>{r.name || r.canonicalId}</Link></td>
                    <td><Muted>{r.alertKind ?? '—'}</Muted></td>
                    <td><Muted>{r.matchMethod ?? '—'}{r.viaName ? ` · via ${r.viaName}` : ''}</Muted></td>
                    <td>{pct(r.confidence)}</td>
                    <td>{r.fap == null ? '—' : `${(r.fap * 100).toFixed(2)}%`}</td>
                  </tr>
                ))}</tbody>
              </Table>
            </TableWrap>
          </>
        )}

        {candidates.length > 0 && (
          <>
            <MiniLabel style={{ marginTop: related.length ? 18 : 0 }}>
              Optical candidates · {candidates.length}
              {optical?.queriedAt && ` · cone search ${utc(optical.queriedAt)}`}
            </MiniLabel>
            <TableWrap>
              <Table>
                <thead><tr><th>Object</th><th>Survey</th><th>Sep</th><th>First seen</th><th>Mag</th><th>Class</th><th>Score</th></tr></thead>
                <tbody>{candidates.map(c => (
                  <React.Fragment key={c.objectId}>
                    <tr>
                      <td><Ext href={c.url}>{c.objectId}</Ext></td>
                      <td><Muted>{survey(c.brokers)}</Muted></td>
                      <td>{c.separationArcsec == null ? '—' : `${c.separationArcsec.toFixed(0)}″`}</td>
                      <td>{since(c.dtTriggerMin)}</td>
                      <td>{mag(c.mag, c.magFilter)}</td>
                      <td>{candidateClass(c)}</td>
                      <td>{c.llmConfidence == null ? <Muted>not scored</Muted> : pct(c.llmConfidence)}</td>
                    </tr>
                    {c.llmReason && (
                      <tr><td colSpan={7} style={{ whiteSpace: 'normal', paddingTop: 0 }}><Muted>{c.llmReason}</Muted></td></tr>
                    )}
                  </React.Fragment>
                ))}</tbody>
              </Table>
            </TableWrap>
          </>
        )}

        {position && points.length > 0 && (
          <>
            <MiniLabel style={{ marginTop: related.length || candidates.length ? 18 : 0 }}>
              Known sources in and around the error region · {points.length}
            </MiniLabel>
            {empty.length > 0 && <Muted as="p" style={{ margin: '0 0 10px', fontSize: 12 }}>No {orList(empty)} source in the region.</Muted>}
            <EventSkyMap points={points} raDeg={position.raDeg} decDeg={position.decDeg} errorDeg={position.errorDeg}
              region={data.catalog?.region} note={catalogNote(data.catalog)} />
          </>
        )}

        {(!position || points.length === 0) && empty.length > 0 && (
          <>
            <MiniLabel style={{ marginTop: related.length || candidates.length ? 18 : 0 }}>Known sources in the region</MiniLabel>
            <Muted as="p" style={{ margin: '0 0 10px', fontSize: 12 }}>
              No {orList(empty)} source in the region{data.catalog?.radiusDeg != null ? ` (${data.catalog.radiusDeg}°)` : ''}.
            </Muted>
          </>
        )}

        <Disclaimer>
          Sources near the position from Lasair, TNS and Fink, events matched by position and time, and
          known sources from existing catalogs (HEASARC). None is a confirmed counterpart; scores and
          optical classes are model-generated.
        </Disclaimer>
      </Card>
    </RecordSection>
  );
}
