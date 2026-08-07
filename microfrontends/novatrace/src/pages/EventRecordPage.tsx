import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { API_ENDPOINTS } from '@shared/lib/config';
import { StarithmLoaderBlock } from '@shared/components/StarithmLoader';
import { CommentThread } from '@shared/components/CommentThread';
import { SignInButton, UserButton, useAuth } from '@clerk/react';
import { saveReturnUrl } from '@shared/lib/auth';
import {
  Page, TopBar, Crumbs, BrandMark, TopActions, GhostButton,
  Shell, Rail, RailHead, RailLink, RailCount, RailFoot, RailFootHead, RailPrompt,
  RailPromptCta, Content,
  MetaRow, SigPill, Kind, Headline, SubMeta,
  Section, SectionHead, SectionTitle, SectionNote, Card, Prose,
  FieldGrid, Field, FieldLabel, FieldValue, FieldHint,
  NarrowRow, NarrowBar, Muted, PositionSplit, Panel, PanelFoot,
  Row, Stack, Topic, Phase, PayloadWrap, PayloadTable,
  Tabs, Tab, CircCard, CircHead, CircTop, CircSummary, Chip, CircBody,
  ValueChips, ValueChip, TableWrap, Table, RawText, InlineActions,
  Cite, Empty, Figures, Figure,
  UrlList, UrlLink, MiniLabel, CircGrid, CircId, CircFacility, CircDate,
  TableChip, MetaLine, TableHead, Disclaimer, Chart, SIGNIFICANCE,
  RedshiftPill, RedshiftChip, RedshiftNote,
} from '../styled_pages/EventRecord.styled';
import { eventRedshifts, needsLabel, readRedshift } from '../utils/redshift';

/* Types mirror GET /api/public/events/:canonicalId exactly — no fields beyond it. */
interface Notice {
  id: string; topic: string; phase: string | null; t0: string | null;
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
  };
  tags?: string[];
}
interface PublicEvent {
  canonicalId: string; alertKind: string; sourceName: string | null; t0: string | null;
  raDeg: number | null; decDeg: number | null;
  posErrorDeg: number | { radius?: number; type?: string } | null;
  noticeCount: number; circularCount: number;
  aiSummary: { headline: string; significance: string; details: string; generatedAt: string } | null;
  notices: Notice[];
  circulars: Circular[];
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

/* Redshift is rendered on its own, in gold — keep it out of the generic chips so
   it is not shown twice. */
const REDSHIFT_KEYS = new Set(['redshift', 'z', 'redshift_z']);

/** Scalar measurements worth surfacing as chips (nulls and tables excluded). */
function scalarValues(m: Record<string, any> | undefined): Array<[string, string]> {
  if (!m) return [];
  const out: Array<[string, string]> = [];
  for (const [k, v] of Object.entries(m)) {
    if (v == null || v === '' || k === 'tables') continue;
    if (REDSHIFT_KEYS.has(k)) continue;
    if (k === 'other_measurements' && typeof v === 'object') {
      for (const [ok, ov] of Object.entries(v as Record<string, any>)) {
        if (ov == null || ov === '' || REDSHIFT_KEYS.has(ok)) continue;
        out.push([ok.replace(/_/g, ' '), String(ov)]);
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
  return out;
}

/* Same matcher the previous page used — circular urls occasionally point at finder
   charts and light-curve PNGs. Most events carry none. */
const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;

const FITS_EXTS = /\.fits(\.gz)?(\?.*)?$/i;

const imageUrls = (urls?: string[] | null): string[] =>
  (urls || []).filter(u => typeof u === 'string' && IMAGE_EXTS.test(u));

/** Label a `*_url` payload key: lightcurve_url -> "lightcurve". */
const urlLabel = (k: string) => k.replace(/_url$/i, '').replace(/_/g, ' ').trim().toLowerCase();

/**
 * Notice assets hang off payload keys ending in `_url` (lightcurve_url,
 * LightCurve_URL, locationmap_url, healpix_url, …) with `links` as a fallback —
 * the same places the previous page looked.
 */
function noticeAssets(n: { payload?: Record<string, any> | null; links?: Record<string, any> | null }) {
  const pool: Array<[string, string]> = [];
  for (const src of [n.payload || {}, n.links || {}]) {
    for (const [k, v] of Object.entries(src)) {
      if (typeof v !== 'string' || !/^https?:\/\//i.test(v)) continue;
      if (!/_url$/i.test(k)) continue;
      if (!pool.some(([, u]) => u === v)) pool.push([urlLabel(k), v]);
    }
  }
  return {
    images: pool.filter(([, u]) => IMAGE_EXTS.test(u)),
    fits: pool.filter(([, u]) => FITS_EXTS.test(u)),
  };
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
  { id: 'notices', label: 'Notices' },
  { id: 'circulars', label: 'Circulars' },
  { id: 'cite', label: 'Cite' },
];

export default function EventRecordPage({ canonicalId }: { canonicalId?: string }) {
  const { isSignedIn } = useAuth();
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState('summary');
  const [openNotice, setOpenNotice] = useState<Set<string>>(new Set());
  const [openCirc, setOpenCirc] = useState<Set<string>>(new Set());
  const [circView, setCircView] = useState<Record<string, 'parsed' | 'raw' | 'files'>>({});
  const [circFilter, setCircFilter] = useState<'all' | 'parsed' | 'tables'>('all');
  const [coordFmt, setCoordFmt] = useState<'hms' | 'deg'>('hms');
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!canonicalId) return;
    fetch(API_ENDPOINTS.publicEvent(canonicalId))
      .then(r => (r.status === 404 ? (setNotFound(true), null) : r.json()))
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

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  /* How the localisation narrowed: notices that carry an error radius, in time order. */
  const narrowing = useMemo(() => {
    if (!event) return [];
    return event.notices
      .map(n => ({ n, err: posErrorRadius(n.posErrorDeg), at: n.producedAt || n.t0 }))
      .filter((x): x is { n: Notice; err: number; at: string } => x.err != null && !!x.at)
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  }, [event]);

  const worstErr = narrowing.length ? Math.max(...narrowing.map(x => x.err)) : 0;

  const facilities = useMemo(() => {
    if (!event) return [];
    const s = new Set<string>();
    if (event.sourceName) s.add(event.sourceName);
    event.circulars.forEach(c => (c.data?.telescopes?.facilities || []).forEach(f => s.add(f)));
    return Array.from(s).slice(0, 4);
  }, [event]);

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

  if (loading) return <Page><StarithmLoaderBlock tone="dark" message="Loading event…" delay={0} /></Page>;
  if (notFound || !event) return <Page><Empty style={{ padding: 40, textAlign: 'center' }}>Event not found.</Empty></Page>;

  const err = posErrorRadius(event.posErrorDeg);
  const sig = (event.aiSummary?.significance || 'medium').toLowerCase();
  const lastActivity = [...event.circulars.map(c => c.date), ...event.notices.map(n => n.producedAt || '')]
    .filter(Boolean).sort().pop() || null;
  const bestNotice = narrowing.length ? narrowing[narrowing.length - 1] : null;

  const counts: Record<string, number | undefined> = {
    notices: event.notices.length,
    circulars: event.circulars.length,
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
          {SECTIONS.map(s => (
            <RailLink
              key={s.id}
              $active={active === s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
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
            <Headline>{event.aiSummary?.headline || event.canonicalId}</Headline>
            <SubMeta>
              {event.t0 ? `T0 ${fmtDate(event.t0)}` : 'T0 unknown'} · {event.noticeCount} notices ·{' '}
              {event.circularCount} circulars
              {lastActivity && ` · last activity ${tPlus(event.t0, lastActivity)}`}
            </SubMeta>
          </header>

          <Section id="summary">
            <SectionHead>
              <SectionTitle>Summary</SectionTitle>
              <SectionNote>Model-generated · unreviewed</SectionNote>
            </SectionHead>
            <Card>
              {event.aiSummary?.details
                ? <Prose>{event.aiSummary.details}</Prose>
                : <Empty>No summary generated for this event yet.</Empty>}
            </Card>
          </Section>

          <Section id="position">
            <SectionHead>
              <SectionTitle>Position</SectionTitle>
              {err != null && <SectionNote>{quality(err)} · ± {fmtErr(err)}</SectionNote>}
            </SectionHead>
            <Card>
              {event.raDeg != null && event.decDeg != null ? (
                <PositionSplit>
                  <Panel>
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

                  {bestNotice && (
                    <PanelFoot>
                      Tightest from <Muted>{bestNotice.n.topic}</Muted> at {tPlus(event.t0, bestNotice.at)}
                    </PanelFoot>
                  )}
                  </Panel>

                  <Panel>
                    {narrowing.length > 1 ? (
                      <>
                        <FieldLabel>How it narrowed</FieldLabel>
                        {(() => {
                          /* Log y — error radii span arcseconds to tens of degrees, so a
                             linear axis would flatten every refinement into one pixel. */
                          const W = 300, H = 130, L = 34, R = 6, T = 8, B = 20;
                          const t0ms = event.t0 ? new Date(event.t0).getTime() : 0;
                          const pts = narrowing.map(({ n, err: e, at }) => ({
                            id: n.id,
                            h: Math.max(0, (new Date(at).getTime() - t0ms) / 3.6e6),
                            e: Math.max(e, 1 / 3600),
                            best: bestNotice != null && n.id === bestNotice.n.id,
                          }));
                          const maxH = Math.max(...pts.map(p => p.h), 0.1);
                          const lo = Math.log10(Math.min(...pts.map(p => p.e)));
                          const hi = Math.log10(Math.max(...pts.map(p => p.e)));
                          const span = hi - lo || 1;
                          const x = (h: number) => L + (maxH ? (h / maxH) : 0) * (W - L - R);
                          const y = (e: number) => T + (1 - (Math.log10(e) - lo) / span) * (H - T - B);
                          const path = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.h).toFixed(1)},${y(p.e).toFixed(1)}`).join(' ');
                          return (
                            <Chart viewBox={`0 0 ${W} ${H}`} role="img"
                              aria-label="Localisation error radius over time">
                              {[0, 0.5, 1].map(f => {
                                const yy = T + f * (H - T - B);
                                const val = 10 ** (hi - f * span);
                                return (
                                  <g key={f}>
                                    <line className="grid" x1={L} x2={W - R} y1={yy} y2={yy} />
                                    <text className="axis" x={0} y={yy + 3}>{fmtErr(val)}</text>
                                  </g>
                                );
                              })}
                              <path className="track" d={path} />
                              {pts.map(p => (
                                <circle key={p.id} className={`dot${p.best ? ' dot--best' : ''}`}
                                  cx={x(p.h)} cy={y(p.e)} r={p.best ? 4 : 3} />
                              ))}
                              <text className="lbl" x={L} y={H - 5}>T+0</text>
                              <text className="lbl" x={W - R} y={H - 5} textAnchor="end">
                                {maxH >= 24 ? `T+${(maxH / 24).toFixed(1)}d` : `T+${maxH.toFixed(1)}h`}
                              </text>
                            </Chart>
                          );
                        })()}
                      </>
                    ) : <Empty>Single localisation — no refinement history.</Empty>}
                  </Panel>
                </PositionSplit>
              ) : <Empty>No position reported.</Empty>}
            </Card>
          </Section>

          <Section id="notices">
            <SectionHead>
              <SectionTitle>Notice timeline</SectionTitle>
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
          </Section>

          <Section id="circulars">
            <SectionHead>
              <SectionTitle>Circulars</SectionTitle>
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
                const z = readRedshift(c.data?.measurements);
                const tables: Array<Record<string, any>> = Array.isArray(c.data?.measurements?.tables)
                  ? c.data!.measurements!.tables : [];
                const author = c.data?.basic_data?.author;
                const figs = imageUrls(c.data?.urls);
                const urls = (c.data?.urls || []).filter(u => typeof u === 'string' && /^https?:\/\//i.test(u));
                return (
                  <CircCard key={c.alertKey} $open={open}>
                    <CircHead onClick={() => toggle(openCirc, setOpenCirc)(c.alertKey)} aria-expanded={open}>
                      <CircGrid>
                        <CircId>{c.alertKey}</CircId>
                        <CircFacility>{(c.data?.telescopes?.facilities || [])[0] || '—'}</CircFacility>
                        <CircSummary>{c.summary}</CircSummary>
                        <span style={{ display: 'flex', gap: 6 }}>
                          {(c.tags || []).slice(0, 2).map(tg => <Chip key={tg}>{tg}</Chip>)}
                          {figs.length > 0 && <Chip>{figs.length} fig</Chip>}
                        </span>
                        <CircDate>{tPlus(event.t0, c.date)}</CircDate>
                      </CircGrid>
                      {/* Collapsed preview only — once open, the Parsed tab shows the same
                          values, so showing both duplicates them. */}
                      {!open && (vals.length > 0 || z) && (
                        <ValueChips style={{ margin: '8px 0 0', alignItems: 'center' }}>
                          <MiniLabel style={{ margin: 0, marginRight: 6 }}>Extracted</MiniLabel>
                          {z && <RedshiftChip>{needsLabel(z.display) && <b>z</b>}{z.display}</RedshiftChip>}
                          {vals.slice(0, 6).map(([k, v]) => (
                            <ValueChip key={k}><b>{k}</b>{v}</ValueChip>
                          ))}
                          {vals.length > 6 && <Chip>+{vals.length - 6} more</Chip>}
                          {tables.length > 0 && (
                            <TableChip>+ {tables.length} rows · table</TableChip>
                          )}
                        </ValueChips>
                      )}
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
                              <ValueChips>
                                {z && <RedshiftChip>{needsLabel(z.display) && <b>z</b>}{z.display}</RedshiftChip>}
                                {vals.map(([k, v]) => (
                                  <ValueChip key={k}><b>{k}</b>{v}</ValueChip>
                                ))}
                              </ValueChips>
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
          </Section>

          <Section id="cite">
            <SectionHead>
              <SectionTitle>Cite this event</SectionTitle>
              <SectionNote>Website reference · not a primary source</SectionNote>
            </SectionHead>
            <Cite>{`@misc{starithm_${event.canonicalId.toLowerCase().replace(/[^a-z0-9]/g, '_')},
  title   = {${event.aiSummary?.headline || event.canonicalId}},
  author  = {{Starithm Platform}},
  year    = {${event.t0 ? new Date(event.t0).getUTCFullYear() : new Date().getUTCFullYear()}},
  url     = {https://starithm.ai/novatrace/events/${event.canonicalId}},
  note    = {Real-time astronomical event monitoring, Starithm}
}`}</Cite>
          </Section>

          <Section id="discussion">
            <SectionHead>
              <SectionTitle>Discussion</SectionTitle>
            </SectionHead>
            <CommentThread canonicalId={event.canonicalId} />
          </Section>
        </Content>
      </Shell>
    </Page>
  );
}
