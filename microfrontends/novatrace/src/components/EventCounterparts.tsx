import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Section, SectionHead, SectionTitle, SectionNote, Card, Muted, TableWrap, Table, MiniLabel,
  ShowMore, Disclaimer,
} from '../styled_pages/EventRecord.styled';

/* Everything NovaTrace found around an event, in one section: other events cross-match grouped
 * with it, optical candidates from the cone search (Lasair Rubin/ZTF, TNS) with the cross-match
 * model's scores, and Rubin sources in a wide error region (Fink). Shapes mirror the crossMatch /
 * optical fields of GET /api/public/events/:canonicalId. None of it is a confirmed counterpart. */

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
export interface Counterparts {
  crossMatch: { reasoning: string | null; related: RelatedEvent[] } | null;
  optical: {
    queriedAt: string | null; candidates: OpticalCandidate[];
    region: { queriedAt: string; radiusDeg: number | null; sources: RegionSource[] } | null;
  } | null;
}

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

export function counterpartsCount(c: Counterparts): number {
  return (c.crossMatch?.related.length ?? 0) + (c.optical?.candidates.length ?? 0) + (c.optical?.region?.sources.length ?? 0);
}

/* Only blocks with something in them render; with nothing at all, neither does the section (the
 * page's rail drops its entry too, via counterpartsCount). */
export function EventCounterparts({ data }: { data: Counterparts }) {
  const [allRegion, setAllRegion] = useState(false);
  const related = data.crossMatch?.related ?? [];
  const optical = data.optical;
  const candidates = optical?.candidates ?? [];
  const sources = optical?.region?.sources ?? [];
  if (counterpartsCount(data) === 0) return null;
  const region = optical!.region;
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

        <Disclaimer>
          Sources near the position from Lasair, TNS and Fink, and events matched by position and time.
          None is a confirmed counterpart; scores and classes are model-generated.
        </Disclaimer>
      </Card>
    </Section>
  );
}
