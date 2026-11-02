import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Section, SectionHead, SectionTitle, SectionNote, Card, Muted, TableWrap, Table, MiniLabel,
  ShowMore, Disclaimer,
} from '../styled_pages/EventRecord.styled';

/* Everything NovaTrace found around an event, in one section: other events cross-match grouped
 * with it, optical candidates from the cone search (Lasair Rubin/ZTF, TNS) with the cross-match
 * model's scores, Rubin sources in a wide error region (Fink), and known catalogued sources in the
 * region (4FGL, XMM, ROSAT, Swift-XRT via HEASARC). Shapes mirror the crossMatch / optical / catalog
 * fields of GET /api/public/events/:canonicalId. None of it is a confirmed counterpart. */

export interface RelatedEvent {
  canonicalId: string; name: string | null; alertKind: string | null;
  confidence: number | null; matchMethod: string | null; fap: number | null;
}
export interface OpticalCandidate {
  objectId: string; brokers: string[]; url: string | null; separationArcsec: number | null;
  dtTriggerMin: number | null; mag: number | null; magFilter: string | null;
  finkClass: string | null; finkClassScore: number | null; sherlockClass: string | null; tnsClass: string | null;
  llmConfidence: number | null; llmReason: string | null;
}
export interface RegionSource {
  objectId: string; url: string | null; separationDeg: number | null; dtTriggerMin: number | null;
  nDetections: number | null; mag: number | null; magFilter: string | null;
  finkClass: string | null; finkClassScore: number | null;
}
/* One source from data_extraction_microservice/catalogs/heasarc.py; `extra` holds catalog-specific fields. */
export interface CatalogSource {
  catalog: string; name: string; sep_deg: number | null; err_deg: number | null;
  class: string | null; assoc: string | null; flux: number | null; flux_unit: string | null;
  variable: boolean | null; extra?: Record<string, unknown>;
}
export interface Counterparts {
  crossMatch: { reasoning: string | null; related: RelatedEvent[] } | null;
  optical: {
    queriedAt: string | null; candidates: OpticalCandidate[];
    region: { queriedAt: string; radiusDeg: number | null; sources: RegionSource[] } | null;
  } | null;
  catalog?: {
    queriedAt: string | null; radiusDeg: number | null; sources: CatalogSource[];
    catalogs: Record<string, { total: number | null; kept: number; error?: string }>;
  } | null;
}

const CATALOG_LABEL: Record<string, string> = { '4FGL': 'Fermi-LAT 4FGL', XMM: 'XMM 5XMM', '2RXS': 'ROSAT 2RXS', '2SXPS': 'Swift-XRT 2SXPS' };
const CATALOG_PREVIEW = 3;

const REGION_PREVIEW = 3;

const pct = (x: number | null) => (x == null ? '—' : `${Math.round(x * 100)}%`);
const utc = (iso: string | null) => (iso ? `${new Date(iso).toISOString().slice(0, 16).replace('T', ' ')} UTC` : null);
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
export const hasCounterparts = (c: Counterparts) => counterpartsCount(c) > 0 || (c.catalog?.sources.length ?? 0) > 0;

const sepText = (d: number | null) => (d == null ? '—' : d < 0.1 ? `${(d * 3600).toFixed(0)}″` : `${d.toFixed(2)}°`);

/* Known sources, one table, grouped by catalog; each catalog shows its nearest few until expanded,
 * with "N of total" since wide regions keep only the brightest. */
function KnownSources({ catalog, offset }: { catalog: NonNullable<Counterparts['catalog']>; offset: boolean }) {
  const [all, setAll] = useState(false);
  const groups = Object.entries(catalog.catalogs)
    .map(([name, meta]) => ({ name, meta, rows: catalog.sources.filter(s => s.catalog === name) }))
    .filter(g => g.rows.length > 0);
  const hidden = groups.reduce((n, g) => n + Math.max(0, g.rows.length - CATALOG_PREVIEW), 0);
  return (
    <>
      <MiniLabel style={{ marginTop: offset ? 18 : 0 }}>
        Known sources in the region · {groups.map(g => `${g.name} ${g.rows.length < (g.meta.total ?? 0) ? `${g.rows.length} of ${(g.meta.total ?? 0).toLocaleString()}` : g.rows.length}`).join(' · ')}
        {catalog.radiusDeg != null && ` · within ${catalog.radiusDeg < 1 ? catalog.radiusDeg.toFixed(2) : catalog.radiusDeg.toFixed(1)}°`}
      </MiniLabel>
      <TableWrap>
        <Table>
          <thead><tr><th>Catalog</th><th>Source</th><th>Sep</th><th>Class · association</th><th>Flux</th><th>Variable</th></tr></thead>
          <tbody>{groups.flatMap(g => (all ? g.rows : g.rows.slice(0, CATALOG_PREVIEW)).map(s => (
            <tr key={`${s.catalog}:${s.name}`}>
              <td><Muted>{CATALOG_LABEL[s.catalog] ?? s.catalog}</Muted></td>
              <td>{s.name}</td>
              <td>{sepText(s.sep_deg)}</td>
              <td>{[s.class, s.assoc].filter(Boolean).join(' · ') || '—'}</td>
              <td>{s.flux == null ? '—' : <>{s.flux.toExponential(2)} <Muted>{s.flux_unit}</Muted></>}</td>
              <td>{s.variable == null ? '—' : s.variable ? 'yes' : 'no'}</td>
            </tr>
          )))}</tbody>
        </Table>
      </TableWrap>
      {hidden > 0 && <ShowMore onClick={() => setAll(v => !v)}>{all ? 'Show fewer' : `Show all (${hidden} more)`}</ShowMore>}
    </>
  );
}

/* Only blocks with something in them render; with nothing at all, neither does the section (the
 * page's rail drops its entry too, via counterpartsCount). */
export function EventCounterparts({ data }: { data: Counterparts }) {
  const [allRegion, setAllRegion] = useState(false);
  const related = data.crossMatch?.related ?? [];
  const optical = data.optical;
  const candidates = optical?.candidates ?? [];
  const sources = optical?.region?.sources ?? [];
  if (!hasCounterparts(data)) return null;
  const region = optical?.region ?? null;
  const shown = allRegion ? sources : sources.slice(0, REGION_PREVIEW);

  return (
    <Section id="counterparts">
      <SectionHead>
        <SectionTitle>Counterparts</SectionTitle>
        <SectionNote>Candidates · not confirmed</SectionNote>
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
                    <td><Muted>{r.matchMethod ?? '—'}</Muted></td>
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

        {region && sources.length > 0 && (
          <>
            <MiniLabel style={{ marginTop: related.length || candidates.length ? 18 : 0 }}>
              Sources in the region · {sources.length} Rubin object{sources.length === 1 ? '' : 's'}
              {region.radiusDeg != null && ` within ${region.radiusDeg.toFixed(region.radiusDeg < 1 ? 2 : 1)}°`} · {utc(region.queriedAt)}
            </MiniLabel>
            {(
              <>
                <TableWrap>
                  <Table>
                    <thead><tr><th>Rubin object</th><th>Sep</th><th>First seen</th><th>Det.</th><th>Mag</th><th>Fink class</th></tr></thead>
                    <tbody>{shown.map(s => (
                      <tr key={s.objectId}>
                        <td><Ext href={s.url}>{s.objectId}</Ext></td>
                        <td>{s.separationDeg == null ? '—' : `${s.separationDeg.toFixed(2)}°`}</td>
                        <td>{since(s.dtTriggerMin)}</td>
                        <td>{s.nDetections ?? '—'}</td>
                        <td>{mag(s.mag, s.magFilter)}</td>
                        <td>{s.finkClass ?? '—'}{s.finkClass && s.finkClassScore != null && <Muted> {pct(s.finkClassScore)}</Muted>}</td>
                      </tr>
                    ))}</tbody>
                  </Table>
                </TableWrap>
                {sources.length > REGION_PREVIEW && (
                  <ShowMore onClick={() => setAllRegion(v => !v)}>
                    {allRegion ? 'Show fewer' : `Show all ${sources.length}`}
                  </ShowMore>
                )}
              </>
            )}
          </>
        )}

        {data.catalog && data.catalog.sources.length > 0 && (
          <KnownSources catalog={data.catalog} offset={related.length > 0 || candidates.length > 0 || sources.length > 0} />
        )}

        <Disclaimer>
          Sources near the position from Lasair, TNS and Fink, events matched by position and time, and
          known sources from existing catalogs (HEASARC). None is a confirmed counterpart; scores and
          optical classes are model-generated.
        </Disclaimer>
      </Card>
    </Section>
  );
}
