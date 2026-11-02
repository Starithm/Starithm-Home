import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Section, SectionHead, SectionTitle, SectionNote, Card, Muted, TableWrap, Table, MiniLabel,
  Empty, ShowMore, Disclaimer,
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

/* The optical worker's limits (scripts/main/optical-candidates-worker.ts): Lasair cone up to 1°,
 * Fink region search up to 2°. */
const REGION_MAX_DEG = 2;
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

export function EventCounterparts({ data, errorDeg }: { data: Counterparts; errorDeg: number | null }) {
  const [allRegion, setAllRegion] = useState(false);
  const related = data.crossMatch?.related ?? [];
  const optical = data.optical;
  const region = optical?.region ?? null;
  const shown = region ? (allRegion ? region.sources : region.sources.slice(0, REGION_PREVIEW)) : [];

  return (
    <Section id="counterparts">
      <SectionHead>
        <SectionTitle>Counterparts</SectionTitle>
        <SectionNote>Candidates · not confirmed</SectionNote>
      </SectionHead>
      <Card>
        <MiniLabel>Related events · {related.length}</MiniLabel>
        {related.length ? (
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
        ) : <Empty>No other event matched by position and time.</Empty>}

        <MiniLabel style={{ marginTop: 18 }}>
          Optical candidates · {optical?.candidates.length ?? 0}
          {optical?.queriedAt && ` · cone search ${utc(optical.queriedAt)}`}
        </MiniLabel>
        {!optical ? (
          <Empty>{errorDeg != null && errorDeg > REGION_MAX_DEG
            ? `Not searched: the error region (± ${errorDeg.toFixed(1)}°) is too wide for an optical search.`
            : 'Not searched yet.'}</Empty>
        ) : optical.candidates.length === 0 ? (
          <Empty>{region ? 'No cone search: the error region is wider than a Lasair cone (0.28°); see the region search below.' : 'None found in the cone search.'}</Empty>
        ) : (
          <TableWrap>
            <Table>
              <thead><tr><th>Object</th><th>Survey</th><th>Sep</th><th>First seen</th><th>Mag</th><th>Class</th><th>Score</th></tr></thead>
              <tbody>{optical.candidates.map(c => (
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
        )}

        {region && (
          <>
            <MiniLabel style={{ marginTop: 18 }}>
              Sources in the region · {region.sources.length} Rubin object{region.sources.length === 1 ? '' : 's'}
              {region.radiusDeg != null && ` within ${region.radiusDeg.toFixed(region.radiusDeg < 1 ? 2 : 1)}°`} · {utc(region.queriedAt)}
            </MiniLabel>
            {region.sources.length === 0 ? (
              <Empty>No Rubin object first seen after the trigger, detected at least twice, in the region.</Empty>
            ) : (
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
                {region.sources.length > REGION_PREVIEW && (
                  <ShowMore onClick={() => setAllRegion(v => !v)}>
                    {allRegion ? 'Show fewer' : `Show all ${region.sources.length}`}
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
