import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { API_ENDPOINTS } from '@shared/lib/config';
import { FITS_EXTS, IMAGE_EXTS, imageUrls, noticeAssets } from '@novatrace/lib/eventAssets';
import { StarithmLoaderBlock } from '@shared/components/StarithmLoader';
import { CommentThread } from '@shared/components/CommentThread';
import { SignInButton, UserButton, useAuth } from '@clerk/react';
import { saveReturnUrl } from '@shared/lib/auth';
import {
  Page, TopBar, Crumbs, BrandMark, TopActions, GhostButton,
  Shell, Rail, RailHead, RailLink, RailCount, RailFoot, RailFootHead, RailPrompt,
  RailPromptCta, Content,
  MetaRow, SigPill, Kind, Headline, SubMeta,
  SectionHead, SectionNote, Card, Prose,
  FieldGrid, Field, FieldLabel, FieldValue, FieldHint,
  Muted,
  Row, Stack, Topic, Phase, PayloadWrap, PayloadTable,
  Tabs, Tab, CircCard, CircHead, CircTop, CircSummary, Chip, CircBody,
  MeasureTable, ShowMore, MeasureNote, CircMeasures, TableWrap, Table, RawText, InlineActions,
  Cite, Empty, Figures, Figure,
  UrlList, UrlLink, MiniLabel, CircGrid, CircId, CircFacility, CircDate,
  MetaLine, TableHead, Disclaimer, SIGNIFICANCE, LocBlock, LocRow, LocStar,
  RedshiftPill, RedshiftNote,
} from '../styled_pages/EventRecord.styled';
import { eventRedshifts, needsLabel, readRedshift } from '../utils/redshift';
import { EventCounterparts, counterpartsCount, hasCounterparts, type Counterparts } from '../components/EventCounterparts';
import { eventLocalisations, bestLocalisation, instrumentsSeen, type Localisation, type PositionRow, type PositionSource } from '../utils/localisations';
import { RecordSection, SectionToggle, SectionsProvider, useSections } from '../components/RecordSection';
import { EventObservations } from '../components/EventObservations';
import { shownObservations, type ObservationRow } from '../utils/observations';
import { swiftLinks } from '../utils/swift';

/* Types mirror GET /api/public/events/:canonicalId exactly — no fields beyond it. */
interface Notice {
  id: string; topic: string; sourceName?: string | null; phase: string | null; t0: string | null;
  producedAt: string | null; raDeg: number | null; decDeg: number | null;
  posErrorDeg: number | { radius?: number; type?: string } | null;
  classification: Record<string, number> | null;
  links: Record<string, any> | null; payload: Record<string, any> | null;
}
interface Circular {
  alertKey: string; event: string; summary: string; date: string;
  data?: {
    authors?: { authors?: string[]; institutions?: string[] };
    basic_data?: Record<string, any>;
    measurements?: Record<string, any>;
    telescopes?: { facilities?: string[]; telescopes?: string[]; instruments?: string[] };
    raw?: string;
    urls?: string[];
    positions?: { version: number; rows: PositionRow[] };
    observations?: { version: number | null; rows?: ObservationRow[] };
  };
  tags?: string[];
}
interface PublicEvent {
  canonicalId: string; alertKind: string; sourceName: string | null; t0: string | null;
  /* Absent until the API with circular positions (NovaTrace #105) is deployed. */
  primaryName?: string | null;
  raDeg: number | null; decDeg: number | null;
  posErrorDeg: number | { radius?: number; type?: string } | null;
  /* Where the event engine took the position from (notice or circular); null before re-materialising. */
  positionSource?: PositionSource | null;
  noticeCount: number; circularCount: number;
  aiSummary: { headline: string; significance: string; details: string; generatedAt: string } | null;
  notices: Notice[];
  circulars: Circular[];
  /* Absent until the API with counterparts is deployed. */
  crossMatch?: Counterparts['crossMatch'];
  optical?: Counterparts['optical'];
  catalog?: Counterparts['catalog'];
}

/* posErrorDeg is jsonb ({radius,type}); older rows are plain numbers. */
function posErrorRadius(v: unknown): number | null {
  if (v == null) return null;
  const raw = typeof v === 'object' ? (v as any).radius : v;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function fmtCoord(value: number, type: 'ra' | 'dec'): string {
  const v = Number(value);
  if (type === 'ra') {
    const h = Math.floor(v / 15), m = Math.floor((v % 15) * 4), s = ((v % 15) * 4 - m) * 60;
    return `${h}h ${m}m ${s.toFixed(1)}s`;
  }
  const sign = v >= 0 ? '+' : '-', a = Math.abs(v);
  const d = Math.floor(a), m = Math.floor((a % 1) * 60), s = ((a % 1) * 60 - m) * 60;
  return `${sign}${d}° ${m}' ${s.toFixed(1)}"`;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
  });

/** Offset from T0, e.g. "T+2:22:55". */
function tPlus(t0: string | null, at: string | null): string {
  if (!t0 || !at) return '—';
  const ms = new Date(at).getTime() - new Date(t0).getTime();
  if (!Number.isFinite(ms) || ms < 0) return '—';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  if (h >= 24) return `T+${(h / 24).toFixed(1)} d`;
  return `T+${h}:${String(m).padStart(2, '0')}`;
}

/** Error radius → a plain-language quality label. Derived, not stored. */
function quality(deg: number | null): string {
  if (deg == null) return 'unknown';
  if (deg <= 0.01) return 'precise';
  if (deg <= 0.2) return 'refined';
  if (deg <= 2) return 'coarse';
  return 'wide';
}

const fmtErr = (deg: number) =>
  deg < 0.02 ? `${(deg * 3600).toFixed(1)}″` : deg < 1 ? `${(deg * 60).toFixed(1)}′` : `${deg.toFixed(2)}°`;

/* "gcn.classic.voevent.FERMI_GBM_FIN_POS" → "FERMI_GBM_FIN_POS". */
const noticeTopic = (topic: string) => topic.replace(/^gcn\.(classic\.(voevent|text)\.|notices\.)/, '');

/* Redshift is rendered on its own, in gold — keep it out of the generic chips so
   it is not shown twice. */
const REDSHIFT_KEYS = new Set(['redshift', 'z', 'redshift_z']);

/** Scalar measurements worth surfacing as chips (nulls and tables excluded). */
/**
 * Trim absurd float precision before display. The extractor round-trips through JSON
 * floats, so a declination arrives as "24.192480555555555" — 17 significant figures for
 * a value good to about 5. Left alone it dominates the value column. Only plain decimal
 * numbers are touched; anything non-numeric passes through intact.
 */
function fmtMeasure(v: string): string {
  const t = v.trim();
  if (!/^-?\d*\.?\d+$/.test(t)) return v;
  const n = Number(t);
  if (!Number.isFinite(n)) return v;
  if ((t.split('.')[1] || '').length <= 6) return v;
  return String(Number(n.toFixed(6)));
}

/* Rows shown in a collapsed card before "Show N more". Four keeps a dense list
   scannable while still showing the values readers check first. */
const PREVIEW_ROWS = 4;

/** A measurement value as text. Extraction sometimes nests objects (an exposure as
 *  [{filter, time}, …]); String() rendered those as "[object Object]". */
function measureText(v: any): string {
  if (v == null) return '';
  if (Array.isArray(v)) return v.map(measureText).filter(Boolean).join('; ');
  if (typeof v === 'object') {
    return Object.entries(v).filter(([, x]) => x != null && x !== '')
      .map(([k, x]) => `${k.replace(/_/g, ' ')} ${measureText(x)}`).join(', ');
  }
  return String(v);
}

function scalarValues(m: Record<string, any> | undefined): Array<[string, string]> {
  if (!m) return [];
  const out: Array<[string, string]> = [];
  for (const [k, v] of Object.entries(m)) {
    if (v == null || v === '' || k === 'tables') continue;
    if (REDSHIFT_KEYS.has(k)) continue;
    if (k === 'other_measurements' && typeof v === 'object') {
      for (const [ok, ov] of Object.entries(v as Record<string, any>)) {
        if (ov == null || ov === '' || REDSHIFT_KEYS.has(ok)) continue;
        const text = measureText(ov);
        if (text) out.push([ok.replace(/_/g, ' '), text]);
      }
      continue;
    }
    if (typeof v === 'object') continue;
    out.push([k.replace(/_/g, ' '), String(v)]);
  }
  return out;
}

/**
 * Every field a notice carries, flattened for display.
 *
 * The previous version dropped anything non-scalar and then took `.slice(0, 12)`,
 * so a Fermi GBM notice showed 12 of its 67 fields with no indication the rest
 * existed. Nested objects are flattened one level (`obs_support_info.moon_distance`)
 * and arrays joined, so instrument sub-structures are visible too. Nulls stay
 * hidden — "not reported" is the common case and listing them would bury the
 * fields that do carry a value.
 */
function payloadFields(payload: Record<string, any> | null | undefined): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const [k, v] of Object.entries(payload || {})) {
    if (v == null || v === '') continue;
    if (Array.isArray(v)) {
      if (v.length) out.push([k, v.map(x => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(', ')]);
      continue;
    }
    if (typeof v === 'object') {
      for (const [ik, iv] of Object.entries(v as Record<string, any>)) {
        if (iv == null || iv === '' || typeof iv === 'object') continue;
        out.push([`${k}.${ik}`, String(iv)]);
      }
      continue;
    }
    out.push([k, String(v)]);
  }
  // Embedded binaries (an LVK notice's base64 skymap is ~100 KB) are summarised, not
  // printed: on a phone the blob filled the whole payload table.
  return out.map(([k, v]) => (v.length > 300 && /^[A-Za-z0-9+/=\s]+$/.test(v)
    ? [k, `binary data, ${Math.round((v.length * 3) / 4 / 1024)} KB (not shown)`]
    : [k, v]));
}

const fileName = (u: string) => u.split('/').pop()?.split('?')[0] || u;

const hostOf = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };

/** Extension-derived label for the files list. */
function fileKind(u: string): string {
  if (IMAGE_EXTS.test(u)) return 'img';
  if (FITS_EXTS.test(u)) return 'fits';
  const m = u.split('?')[0].match(/\.([a-z0-9]{1,5})$/i);
  return m ? m[1].toLowerCase() : 'link';
}

const toCsv = (rows: Array<Record<string, any>>) => {
  const cols = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  const esc = (s: any) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  return [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n');
};

const SECTIONS = [
  { id: 'summary', label: 'Summary' },
  { id: 'position', label: 'Position' },
  { id: 'observations', label: 'Observations' },
  { id: 'counterparts', label: 'Counterparts' },
  { id: 'notices', label: 'Notices' },
  { id: 'circulars', label: 'Circulars' },
  { id: 'cite', label: 'Cite' },
];

export default function EventRecordPage(props: { canonicalId?: string }) {
  return <SectionsProvider><EventRecord {...props} /></SectionsProvider>;
}

function EventRecord({ canonicalId }: { canonicalId?: string }) {
  const { expand } = useSections();
  const { isSignedIn } = useAuth();
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState('summary');
  const [openNotice, setOpenNotice] = useState<Set<string>>(new Set());
  const [openCirc, setOpenCirc] = useState<Set<string>>(new Set());
  const [circView, setCircView] = useState<Record<string, 'parsed' | 'raw' | 'files'>>({});
  /* Which collapsed cards have their measurement table expanded past PREVIEW_ROWS. */
  const [valsOpen, setValsOpen] = useState<Set<string>>(new Set());
  const [circFilter, setCircFilter] = useState<'all' | 'parsed' | 'tables'>('all');
  const [coordFmt, setCoordFmt] = useState<'hms' | 'deg'>('hms');
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!canonicalId) return;
    // Any non-2xx is "not found", not data: a 500 body is `{error}`, and storing it as the
    // event crashed the `narrowing` memo (`event.notices.map`) and blanked the page.
    fetch(API_ENDPOINTS.publicEvent(canonicalId))
      .then(r => (r.ok ? r.json() : (setNotFound(true), null)))
      .then(d => { if (d) setEvent(d); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [canonicalId]);

  useEffect(() => {
    if (!event) return;
    document.title = `${event.aiSummary?.headline || event.canonicalId} — Starithm`;
  }, [event]);

  /* Rail marker follows whichever section is nearest the top of the viewport. */
  useEffect(() => {
    if (!event) return;
    const io = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-70px 0px -60% 0px' },
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [event]);

  const toggle = (set: Set<string>, fn: (s: Set<string>) => void) => (id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    fn(next);
  };

  /* The rail only navigates — the composer lives in the discussion section, so a
     signed-out user lands where the sign-in control already is. */
  const goToDiscussion = () =>
    document.getElementById('discussion')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  /* From the localisation table: show that circular's card, open, in place. */
  const openCircular = (alertKey: string) => {
    expand('circulars');
    setCircFilter('all');
    setOpenCirc(prev => new Set(prev).add(alertKey));
    requestAnimationFrame(() =>
      document.getElementById(`circ-${alertKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  /* Every localisation reported, notices and circulars, oldest first (utils/localisations). */
  const localisations = useMemo(
    () => (event ? eventLocalisations(event.notices, event.circulars) : []),
    [event],
  );
  const seen = useMemo(() => instrumentsSeen(localisations), [localisations]);

  /* Header: the instruments that localised the burst; the summariser's facility list only when
     no circular or notice gave a position. */
  const facilities = useMemo(() => {
    if (!event) return [];
    const localisers = seen.filter(x => x.role === 'event').map(x => x.instrument);
    if (localisers.length) return localisers;
    const s = new Set<string>();
    if (event.sourceName) s.add(event.sourceName);
    event.circulars.forEach(c => (c.data?.telescopes?.facilities || []).forEach(f => s.add(f)));
    return Array.from(s).slice(0, 4);
  }, [event, seen]);
  const afterglow = seen.filter(x => x.role === 'counterpart').map(x => x.instrument);

  const totalParsed = useMemo(
    () => (event?.circulars || []).reduce(
      (n, c) => n + scalarValues(c.data?.measurements).length + (readRedshift(c.data?.measurements) ? 1 : 0),
      0,
    ),
    [event],
  );

  /* Redshift is not an event field — it only ever arrives through a Circular.
     More than one entry means the circulars disagree. */
  const redshifts = useMemo(() => eventRedshifts(event?.circulars || []), [event]);

  const circulars = useMemo(() => {
    if (!event) return [];
    return event.circulars.filter(c => {
      if (circFilter === 'all') return true;
      const m = c.data?.measurements;
      if (circFilter === 'tables') return Array.isArray(m?.tables) && m!.tables.length > 0;
      return scalarValues(m).length > 0 || readRedshift(m) != null;
    });
  }, [event, circFilter]);

  if (loading) return <Page><StarithmLoaderBlock tone="dark" message="Loading event…" delay={0} fullscreen /></Page>;
  if (notFound || !event) return <Page><Empty style={{ padding: 40, textAlign: 'center' }}>Event not found.</Empty></Page>;

  const err = posErrorRadius(event.posErrorDeg);
  const sig = (event.aiSummary?.significance || 'medium').toLowerCase();
  const lastActivity = [...event.circulars.map(c => c.date), ...event.notices.map(n => n.producedAt || '')]
    .filter(Boolean).sort().pop() || null;
  const best = bestLocalisation(localisations, event.positionSource, event.raDeg, event.decDeg);
  /* The table: every circular position, and for notices only each instrument's tightest
     (GBM alone sends ten per burst). */
  const tightest = new Map<string, Localisation>();
  localisations.forEach(l => {
    if (l.from.kind !== 'notice' || l.errorDeg == null) return;
    const cur = tightest.get(l.instrument);
    if (!cur || l.errorDeg < cur.errorDeg!) tightest.set(l.instrument, l);
  });
  const locRows = localisations.filter(l => l.errorDeg != null && (l.from.kind === 'circular' || tightest.get(l.instrument) === l));

  const observationsCount = shownObservations(event.circulars).obs.length;
  /* Swift's own pages (GRB table, UKSSDC XRT products) when Swift triggered on this burst. */
  const swift = swiftLinks(event.circulars);
  const counterpartsData: Counterparts = { crossMatch: event.crossMatch ?? null, optical: event.optical ?? null, catalog: event.catalog ?? null };
  const counts: Record<string, number | undefined> = {
    notices: event.notices.length,
    circulars: event.circulars.length,
    counterparts: counterpartsCount(counterpartsData) || undefined,
    observations: observationsCount || undefined,
  };

  return (
    <Page>
      <TopBar>
        <Crumbs>
          <a href="/"><BrandMark src="/logo_without_name.png" alt="Starithm" /></a>
          <a href="/">STARITHM</a>
          <span>/</span>
          <Link to="/novatrace/events">events</Link>
          <span>/</span>
          <strong>{event.canonicalId}</strong>
        </Crumbs>
        <TopActions>
          <GhostButton onClick={copyLink}>
            {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied' : 'Copy link'}
          </GhostButton>
          {isSignedIn ? <UserButton /> : (
            <SignInButton mode="modal" forceRedirectUrl={window.location.href}>
              <GhostButton onClick={saveReturnUrl}>Sign in</GhostButton>
            </SignInButton>
          )}
        </TopActions>
      </TopBar>

      <Shell>
        <Rail>
          <RailHead>On this record</RailHead>
          {/* Counterparts has no section when there is nothing to show, so no rail entry either. */}
          {SECTIONS.filter(s => s.id !== 'counterparts' || hasCounterparts(counterpartsData)).map(s => (
            <RailLink
              key={s.id}
              $active={active === s.id}
              onClick={() => {
                expand(s.id);
                requestAnimationFrame(() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
              }}
            >
              {s.label}
              {counts[s.id] != null && <RailCount>{counts[s.id]}</RailCount>}
            </RailLink>
          ))}

          {/* Routes to the discussion; composing happens in the section itself. */}
          <RailFoot>
            <RailFootHead>Discussion</RailFootHead>
            <RailPrompt onClick={goToDiscussion}>
              Add an observation or a correction
              <RailPromptCta>{isSignedIn ? 'Write a comment ↓' : 'Sign in →'}</RailPromptCta>
            </RailPrompt>
          </RailFoot>
        </Rail>

        <Content ref={contentRef}>
          <header>
            <MetaRow>
              <SigPill $color={SIGNIFICANCE[sig] || '#888'}>{sig}</SigPill>
              <Kind>{event.alertKind?.toUpperCase()}</Kind>
              {redshifts.length > 0 && (
                <RedshiftPill
                  title={
                    redshifts.length === 1
                      ? `Reported in ${redshifts[0].alertKey}`
                      : `Circulars disagree: ${redshifts.map(r => `${r.display} (${r.alertKey})`).join(', ')}`
                  }
                >
                  {needsLabel(redshifts[0].display) ? <><i>z</i> = {redshifts[0].display}</> : redshifts[0].display}
                  {redshifts.length > 1 && <RedshiftNote>· {redshifts.length - 1} other reported</RedshiftNote>}
                </RedshiftPill>
              )}
              {facilities.length > 0 && <span>· {facilities.join(' · ')}</span>}
            </MetaRow>
            <Headline>{event.aiSummary?.headline || event.primaryName || event.canonicalId}</Headline>
            <SubMeta>
              {event.t0 ? `T0 ${fmtDate(event.t0)}` : 'T0 unknown'} · {event.noticeCount} notices ·{' '}
              {event.circularCount} circulars
              {lastActivity && ` · last activity ${tPlus(event.t0, lastActivity)}`}
            </SubMeta>
            {afterglow.length > 0 && <SubMeta>afterglow: {afterglow.join(' · ')}</SubMeta>}
          </header>

          <RecordSection id="summary">
            <SectionHead>
              <SectionToggle>Summary</SectionToggle>
              <SectionNote>Model-generated · unreviewed</SectionNote>
            </SectionHead>
            <Card>
              {event.aiSummary?.details
                ? <Prose>{event.aiSummary.details}</Prose>
                : <Empty>No summary generated for this event yet.</Empty>}
            </Card>
          </RecordSection>

          <RecordSection id="position">
            <SectionHead>
              <SectionToggle>Position</SectionToggle>
              {err != null && <SectionNote>{quality(err)} · ± {fmtErr(err)}</SectionNote>}
            </SectionHead>
            <Card>
              {event.raDeg != null && event.decDeg != null ? (
                <>
                  <FieldGrid>
                    <Field>
                      <FieldLabel>RA</FieldLabel>
                      <FieldValue>
                        {coordFmt === 'hms' ? fmtCoord(event.raDeg, 'ra') : `${event.raDeg.toFixed(4)}°`}
                      </FieldValue>
                    </Field>
                    <Field>
                      <FieldLabel>Dec</FieldLabel>
                      <FieldValue>
                        {coordFmt === 'hms' ? fmtCoord(event.decDeg, 'dec') : `${event.decDeg >= 0 ? '+' : ''}${event.decDeg.toFixed(4)}°`}
                      </FieldValue>
                    </Field>
                    <Field>
                      <FieldLabel>Error</FieldLabel>
                      <FieldValue>
                        {err != null ? `± ${err.toFixed(3)}°` : '—'}
                        {err != null && <FieldHint>({fmtErr(err)})</FieldHint>}
                      </FieldValue>
                    </Field>
                    <Field>
                      <FieldLabel>Units</FieldLabel>
                      <Tabs style={{ marginBottom: 0 }}>
                        <Tab $active={coordFmt === 'hms'} onClick={() => setCoordFmt('hms')}>hms</Tab>
                        <Tab $active={coordFmt === 'deg'} onClick={() => setCoordFmt('deg')}>deg</Tab>
                      </Tabs>
                    </Field>
                  </FieldGrid>

                  {locRows.length > 0 && (
                    <LocBlock>
                      <FieldLabel>Every localisation reported</FieldLabel>
                      <TableWrap>
                        <Table>
                          <thead>
                            <tr><th>Instrument</th><th>Of</th><th>Error</th><th>Reported</th><th>Source</th></tr>
                          </thead>
                          <tbody>
                            {locRows.map((l, i) => (
                              <LocRow key={i} $best={l === best} $tentative={l.tentative}
                                title={l.quote ?? undefined}>
                                <td>{l === best && <LocStar aria-label="event position">★</LocStar>}{l.instrument}</td>
                                <td>{l.role === 'event' ? 'burst' : 'afterglow'}{l.tentative && ' (tentative)'}</td>
                                <td>{fmtErr(l.errorDeg!)}{l.containment && <FieldHint>{l.containment}</FieldHint>}</td>
                                <td>{event.t0 ? tPlus(event.t0, l.at) : l.at ? fmtDate(l.at) : '—'}</td>
                                <td>
                                  {l.from.kind === 'circular'
                                    ? <UrlLink href={`#circ-${l.from.alertKey}`} onClick={ev => { ev.preventDefault(); openCircular((l.from as { alertKey: string }).alertKey); }}>
                                        GCN {l.from.alertKey.replace(/^GCN-/, '')}
                                      </UrlLink>
                                    : <Muted>{noticeTopic(l.from.topic)}</Muted>}
                                </td>
                              </LocRow>
                            ))}
                          </tbody>
                        </Table>
                      </TableWrap>
                    </LocBlock>
                  )}
                </>
              ) : <Empty>No position reported.</Empty>}

              {swift && (
                <LocBlock>
                  <FieldLabel>Swift data · GRB {swift.name} · trigger {swift.trigger}</FieldLabel>
                  {swift.links.map((l, i) => (
                    <React.Fragment key={l.url}>
                      {i > 0 && <Muted> · </Muted>}
                      <UrlLink href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</UrlLink>
                    </React.Fragment>
                  ))}
                </LocBlock>
              )}
            </Card>
          </RecordSection>

          <EventObservations circulars={event.circulars} onOpenCircular={openCircular} />

          <EventCounterparts data={counterpartsData}
            position={event.raDeg != null && event.decDeg != null ? { raDeg: event.raDeg, decDeg: event.decDeg, errorDeg: err } : null} />

          <RecordSection id="notices">
            <SectionHead>
              <SectionToggle>Notice timeline</SectionToggle>
              <SectionNote>{event.notices.length} machine notices</SectionNote>
            </SectionHead>
            <Stack>
              {event.notices.length === 0 && <Empty>No notices on this record.</Empty>}
              {event.notices.map(n => {
                const open = openNotice.has(n.id);
                const assets = noticeAssets(n);
                const metrics = payloadFields(n.payload);
                return (
                  <div key={n.id}>
                    <Row onClick={() => toggle(openNotice, setOpenNotice)(n.id)} aria-expanded={open}>
                      <Muted>{tPlus(event.t0, n.producedAt || n.t0)}</Muted>
                      <Topic>{n.topic}</Topic>
                      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {assets.images.length > 0 && <Chip>{assets.images.length} fig</Chip>}
                        {assets.fits.length > 0 && <Chip>fits</Chip>}
                        <Phase $final={(n.phase || '').toLowerCase() === 'final'}>{n.phase || 'notice'}</Phase>
                      </span>
                    </Row>
                    {/* Figures show without expanding — the light curve is the fastest
                        read on a notice, and hiding it behind a click meant most
                        visitors never saw it. */}
                    {assets.images.length > 0 && (
                      <Figures>
                        {assets.images.map(([label, u]) => (
                          <Figure key={u} href={u} target="_blank" rel="noopener noreferrer">
                            <img src={u} alt={label} loading="lazy" />
                            <figcaption>{label || fileName(u)}</figcaption>
                          </Figure>
                        ))}
                      </Figures>
                    )}
                    {open && assets.fits.length > 0 && (
                      <InlineActions style={{ padding: '0 0 10px' }}>
                        {assets.fits.map(([label, u]) => (
                          <GhostButton key={u} as="a" href={u} target="_blank" rel="noopener noreferrer">
                            {label || 'fits'} <ExternalLink size={11} />
                          </GhostButton>
                        ))}
                      </InlineActions>
                    )}
                    {open && (
                      metrics.length > 0 ? (
                        <PayloadWrap>
                          <PayloadTable>
                            <tbody>
                              {metrics.map(([k, v]) => (
                                <tr key={k}>
                                  <td>{k.replace(/_/g, ' ')}</td>
                                  <td>
                                    {/^https?:\/\//i.test(v)
                                      ? <a href={v} target="_blank" rel="noopener noreferrer">{v}</a>
                                      : v}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </PayloadTable>
                        </PayloadWrap>
                      ) : (
                        <PayloadWrap><Empty>No payload fields.</Empty></PayloadWrap>
                      )
                    )}
                  </div>
                );
              })}
            </Stack>
          </RecordSection>

          <RecordSection id="circulars">
            <SectionHead>
              <SectionToggle>Circulars</SectionToggle>
              <SectionNote>
                {circulars.length} of {event.circulars.length}
                {totalParsed > 0 && ` · ${totalParsed} values parsed from text`}
              </SectionNote>
            </SectionHead>
            <Tabs>
              {(['all', 'parsed', 'tables'] as const).map(f => (
                <Tab key={f} $active={circFilter === f} onClick={() => setCircFilter(f)}>
                  {f === 'all' ? 'All' : f === 'parsed' ? 'With values' : 'With tables'}
                </Tab>
              ))}
            </Tabs>
            <Stack>
              {circulars.length === 0 && <Empty>No circulars match this filter.</Empty>}
              {circulars.map(c => {
                const open = openCirc.has(c.alertKey);
                const view = circView[c.alertKey] || 'parsed';
                const vals = scalarValues(c.data?.measurements);
                const showAll = valsOpen.has(c.alertKey);
                const z = readRedshift(c.data?.measurements);
                const tables: Array<Record<string, any>> = Array.isArray(c.data?.measurements?.tables)
                  ? c.data!.measurements!.tables : [];
                const author = c.data?.basic_data?.author;
                const figs = imageUrls(c.data?.urls);
                const urls = (c.data?.urls || []).filter(u => typeof u === 'string' && /^https?:\/\//i.test(u));
                return (
                  <CircCard key={c.alertKey} id={`circ-${c.alertKey}`} $open={open}>
                    <CircHead onClick={() => toggle(openCirc, setOpenCirc)(c.alertKey)} aria-expanded={open}>
                      <CircGrid>
                        <CircId>{c.alertKey}</CircId>
                        <CircFacility>{(c.data?.telescopes?.facilities || [])[0] || '—'}</CircFacility>
                        <CircSummary>{c.summary}</CircSummary>
                        {/* Measurements ride in their own grid column beside the summary, filling
                            space the capped prose leaves. Clicking the cell still toggles the card;
                            only Show more stops propagation. */}
                        <CircMeasures>
                          {!open && (vals.length > 0 || z) && (
                            <>
                              <MiniLabel style={{ margin: '0 0 4px' }}>Extracted</MiniLabel>
                              <MeasureTable>
                                <tbody>
                                  {z && (
                                    <tr className="z">
                                      <td className="k">redshift</td>
                                      <td className="v">{z.display}</td>
                                    </tr>
                                  )}
                                  {(showAll ? vals : vals.slice(0, PREVIEW_ROWS)).map(([k, v]) => (
                                    <tr key={k}>
                                      <td className="k">{k}</td>
                                      <td className="v">{fmtMeasure(v)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </MeasureTable>
                              {vals.length > PREVIEW_ROWS && (
                                <ShowMore
                                  onClick={e => {
                                    e.stopPropagation();   /* the cell toggles the card; this must not */
                                    setValsOpen(s => {
                                      const n = new Set(s);
                                      n.has(c.alertKey) ? n.delete(c.alertKey) : n.add(c.alertKey);
                                      return n;
                                    });
                                  }}
                                >
                                  {showAll ? 'Show less' : `Show ${vals.length - PREVIEW_ROWS} more`}
                                </ShowMore>
                              )}
                              {tables.length > 0 && (
                                <MeasureNote>+ {tables.length} row table in Parsed view</MeasureNote>
                              )}
                            </>
                          )}
                        </CircMeasures>
                        <span style={{ display: 'flex', gap: 6 }}>
                          {(c.tags || []).slice(0, 2).map(tg => <Chip key={tg}>{tg}</Chip>)}
                          {figs.length > 0 && <Chip>{figs.length} fig</Chip>}
                        </span>
                        <CircDate>{tPlus(event.t0, c.date)}</CircDate>
                      </CircGrid>
                    </CircHead>

                    {figs.length > 0 && (
                      <div style={{ padding: '0 18px 14px' }}>
                        <Figures style={{ margin: 0 }}>
                          {figs.map(u => (
                            <Figure key={u} href={u} target="_blank" rel="noopener noreferrer">
                              <img src={u} alt="" loading="lazy" />
                              <figcaption>{fileName(u)}</figcaption>
                            </Figure>
                          ))}
                        </Figures>
                      </div>
                    )}
                    {open && (
                      <CircBody>
                        <InlineActions>
                          <Tab $active={view === 'parsed'} onClick={() => setCircView(s => ({ ...s, [c.alertKey]: 'parsed' }))}>
                            Parsed{vals.length + (z ? 1 : 0) ? ` · ${vals.length + (z ? 1 : 0)}` : ''}
                          </Tab>
                          <Tab $active={view === 'raw'} onClick={() => setCircView(s => ({ ...s, [c.alertKey]: 'raw' }))}>
                            Raw text
                          </Tab>
                          {urls.length > 0 && (
                            <Tab $active={view === 'files'} onClick={() => setCircView(s => ({ ...s, [c.alertKey]: 'files' }))}>
                              URLs · {urls.length}
                            </Tab>
                          )}
                        </InlineActions>

                        {view === 'parsed' ? (
                          <>
                            {(vals.length > 0 || z) && <MiniLabel>Extracted</MiniLabel>}
                            {(vals.length > 0 || z) && (
                              <MeasureTable>
                                <tbody>
                                  {z && (
                                    <tr className="z">
                                      <td className="k">redshift</td>
                                      <td className="v">{z.display}</td>
                                    </tr>
                                  )}
                                  {vals.map(([k, v]) => (
                                    <tr key={k}>
                                      <td className="k">{k}</td>
                                      <td className="v">{fmtMeasure(v)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </MeasureTable>
                            )}
                            {tables.map((_, ti) => {
                              const rows = tables;
                              if (ti > 0) return null;
                              const cols = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
                              return (
                                <div key="tbl">
                                  <TableHead>
                                    <span>{rows.length} points</span>
                                    <GhostButton onClick={() => navigator.clipboard?.writeText(toCsv(rows))}>
                                      Copy CSV
                                    </GhostButton>
                                  </TableHead>
                                  <TableWrap style={{ marginTop: 0 }}>
                                    <Table>
                                      <thead><tr>{cols.map(col => <th key={col}>{col}</th>)}</tr></thead>
                                      <tbody>
                                        {rows.map((r, i) => (
                                          <tr key={i}>{cols.map(col => <td key={col}>{String(r[col] ?? '')}</td>)}</tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </TableWrap>
                                </div>
                              );
                            })}
                            {vals.length === 0 && tables.length === 0 && (
                              <Empty>No numeric values in this circular — narrative only.</Empty>
                            )}
                            {author?.name && (
                              <MetaLine>
                                <MiniLabel style={{ margin: 0 }}>Authors</MiniLabel>
                                <span>{author.name}{author.institution && <em> — {author.institution}</em>}</span>
                              </MetaLine>
                            )}
                            <Disclaimer>
                              Values are model-parsed from the circular text — check against Raw text before use.
                            </Disclaimer>
                          </>
                        ) : view === 'files' ? (
                          urls.length > 0 ? (
                            <UrlList>
                              {urls.map((u, i) => (
                                <React.Fragment key={u}>
                                  <UrlLink href={u} target="_blank" rel="noopener noreferrer" title={u}>
                                    {fileName(u) || hostOf(u)}
                                  </UrlLink>
                                  {i < urls.length - 1 && ', '}
                                </React.Fragment>
                              ))}
                            </UrlList>
                          ) : <Empty>No links on this circular.</Empty>
                        ) : (
                          c.data?.raw
                            ? <RawText>{c.data.raw}</RawText>
                            : <Empty>Raw text not stored for this circular.</Empty>
                        )}
                      </CircBody>
                    )}
                  </CircCard>
                );
              })}
            </Stack>
          </RecordSection>

          <RecordSection id="cite">
            <SectionHead>
              <SectionToggle>Cite this event</SectionToggle>
              <SectionNote>Website reference · not a primary source</SectionNote>
            </SectionHead>
            <Cite>{`@misc{starithm_${event.canonicalId.toLowerCase().replace(/[^a-z0-9]/g, '_')},
  title   = {${event.aiSummary?.headline || event.canonicalId}},
  author  = {{Starithm Platform}},
  year    = {${event.t0 ? new Date(event.t0).getUTCFullYear() : new Date().getUTCFullYear()}},
  url     = {https://starithm.ai/novatrace/events/${event.canonicalId}},
  note    = {Real-time astronomical event monitoring, Starithm}
}`}</Cite>
          </RecordSection>

          <RecordSection id="discussion">
            <SectionHead>
              <SectionToggle>Discussion</SectionToggle>
            </SectionHead>
            <CommentThread canonicalId={event.canonicalId} />
          </RecordSection>
        </Content>
      </Shell>
    </Page>
  );
}
