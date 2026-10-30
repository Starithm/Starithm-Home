import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { API_ENDPOINTS } from '@shared/lib/config';
import { type AskEventFacts, eventLabel } from '@novatrace/lib/askCosmos';
import { imageUrls, noticeAssets } from '@novatrace/lib/eventAssets';
import { Card, Link, Mono, SectionHead, SectionLabel, SectionNote } from '@novatrace/styled_pages/AskPage.styled';
import {
  CardField, CardFieldLabel, CardFieldValue, CardGrid, CardMetaLine, EventPanel, EventPanelBody, EventPanelContent,
  EventPanelLeft, EventPanelTop, EventTitle, KindChip, PrimaryAction,
} from '@novatrace/styled_pages/EventLevelDashboard.styled';
import { kindColor } from '@shared/utils/eventColors';
import { getTimeAgo } from '../utils/duration';
import { hasPosition, posErrorRadius } from '../utils/sky';

/* Left-column context. An event question gets a fact sheet (and real images when they exist);
 * a topic question gets the events behind its sources. Missing fields say "not reported":
 * events minted from circulars alone have no time or position, and a blank or a 0 would lie. */

const KIND: Record<string, string> = {
  gw: 'Gravitational-wave event', grb: 'Gamma-ray burst', neutrino: 'Neutrino alert',
  xray: 'X-ray transient', ep: 'X-ray transient', frb: 'Fast radio burst', optical: 'Optical transient',
  sgr: 'Magnetar burst', sn: 'Supernova',
};

const NOT_REPORTED = <span style={{ color: 'var(--text-faint)' }}>not reported</span>;

function utc(t: string | null) {
  if (!t) return null;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().replace('T', ' ').slice(0, 19);
}

function eventPage(id: string) {
  return `/novatrace/events/${encodeURIComponent(id)}`;
}

/* (0, 0) is a placeholder, not a position: ~586 GBM events were stored there (known data bug).
 * A zero error radius is likewise "unknown", not "exact". */
function realPosition(e: AskEventFacts): boolean {
  return e.raDeg != null && e.decDeg != null && !(e.raDeg === 0 && e.decDeg === 0);
}

export function FactSheet({ event }: { event: AskEventFacts }) {
  const t0 = utc(event.t0);
  const err = event.posErrorDeg && event.posErrorDeg > 0 ? event.posErrorDeg : null;
  const pos = realPosition(event) && event.raDeg != null && event.decDeg != null
    ? `${event.raDeg.toFixed(4)}°, ${event.decDeg >= 0 ? '+' : ''}${event.decDeg.toFixed(4)}°${err != null ? ` ± ${err < 0.1 ? `${(err * 3600).toFixed(1)}″` : `${err.toFixed(2)}°`}` : ''}`
    : null;
  // Aliases include case variants and normalised keys ("s250818k"); show each name once.
  const seen = new Set([eventLabel(event).toLowerCase()]);
  const others = (event.aliases ?? []).filter((a) => /[A-Z]/.test(a) && !seen.has(a.toLowerCase()) && seen.add(a.toLowerCase())).slice(0, 3);
  const rows: [string, React.ReactNode][] = [
    ['Kind', event.kind ? KIND[event.kind] ?? event.kind : NOT_REPORTED],
    ['Trigger (UTC)', t0 ? <Mono>{t0}</Mono> : NOT_REPORTED],
    ['Position', pos ? <Mono>{pos}</Mono> : NOT_REPORTED],
    ['Classification', event.classification || NOT_REPORTED],
    ['Circulars · notices', <Mono key="c">{event.circularCount} · {event.noticeCount}</Mono>],
    ['Skymap', event.hasSkymap ? 'available' : NOT_REPORTED],
    ['Optical counterpart', event.hasOptical ? 'yes' : NOT_REPORTED],
    ...(others.length ? [['Also known as', others.join(', ')] as [string, React.ReactNode]] : []),
  ];
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHead>
        <SectionLabel>Fact sheet</SectionLabel>
        <SectionNote>{eventLabel(event)}</SectionNote>
        {event.noticeCount > 0 && (
          <Link href={eventPage(event.canonicalId)} style={{ marginLeft: 'auto', fontSize: 12.5 }}>Event page →</Link>
        )}
      </SectionHead>
      <Card>
        {rows.map(([label, value]) => (
          <FactRow key={label}><FactLabel>{label}</FactLabel><span>{value}</span></FactRow>
        ))}
      </Card>
      <Images event={event} />
    </section>
  );
}

type Figure = { key: string; src: string; caption: string };


/* Figures linked from the event's notices (Fermi GBM light curve and location plot, …) and
 * circulars (instrument quicklooks, SVOM / GECAM plots), from the same record the event page
 * reads. Events minted from circulars alone 404 there, and simply show none. */
function useRecordFigures(canonicalId: string): Figure[] {
  const [figs, setFigs] = useState<Figure[]>([]);
  useEffect(() => {
    let live = true;
    setFigs([]);
    fetch(API_ENDPOINTS.publicEvent(canonicalId))
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!live || !d) return;
        const out: Figure[] = [];
        // The same file is linked over http by notices and https by circulars.
        const seen = new Set<string>();
        const add = (src: string, caption: string) => {
          const k = src.replace(/^https?:\/\//i, '');
          if (!seen.has(k) && seen.add(k)) out.push({ key: k, src, caption });
        };
        for (const n of d.notices ?? []) {
          for (const [label, u] of noticeAssets(n).images) {
            add(u, `${label}${n.sourceName ? ` · ${n.sourceName}` : ''} notice`);
          }
        }
        for (const c of d.circulars ?? []) {
          for (const u of imageUrls(c.data?.urls)) add(u, c.alertKey.replace(/^GCN-/, 'GCN '));
        }
        setFigs(out);
      })
      .catch(() => {});
    return () => { live = false; };
  }, [canonicalId]);
  return figs;
}

function Images({ event }: { event: AskEventFacts }) {
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const record = useRecordFigures(event.canonicalId);
  const imgs: Figure[] = [];
  if (event.kind === 'gw' && event.hasSkymap) {
    imgs.push({ key: 'skymap', src: `https://gracedb.ligo.org/apiweb/superevents/${encodeURIComponent(event.canonicalId)}/files/bayestar.png`, caption: 'LVK skymap · GraceDB' });
  }
  // A sky cutout only means something for a well-localised source. A GW "position" is the
  // centre of a ~1000 deg² region, and an unknown error could be just as large.
  if (realPosition(event) && event.raDeg != null && event.decDeg != null && event.kind !== 'gw'
      && event.posErrorDeg != null && event.posErrorDeg > 0 && event.posErrorDeg < 0.5) {
    const fov = Math.min(Math.max((event.posErrorDeg ?? 0.02) * 4, 0.05), 1);
    imgs.push({
      key: 'sky',
      src: `https://alasky.cds.unistra.fr/hips-image-services/hips2fits?hips=CDS%2FP%2FPanSTARRS%2FDR1%2Fcolor-z-zg-g&width=400&height=300&fov=${fov}&projection=TAN&coordsys=icrs&ra=${event.raDeg}&dec=${event.decDeg}&format=jpg`,
      caption: `Pan-STARRS · ${event.raDeg.toFixed(4)}°, ${event.decDeg >= 0 ? '+' : ''}${event.decDeg.toFixed(4)}°`,
    });
  }
  imgs.push(...record);
  const shown = imgs.filter((i) => !broken[i.key]);
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <SectionHead>
        <SectionLabel>Images</SectionLabel>
        <SectionNote>Linked from the event's notices and circulars, plus LVK skymaps and sky surveys.</SectionNote>
      </SectionHead>
      {shown.length === 0 ? (
        <SectionNote>
          No images: none of this event's notices or circulars link one, and{' '}
          {!realPosition(event) ? 'the position is not reported, so there is no sky cutout.'
            : 'the position is too uncertain for a useful sky cutout.'}
        </SectionNote>
      ) : (
        <ImageGrid>
          {shown.map((i) => (
            <figure key={i.key} style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <a href={i.src} target="_blank" rel="noopener noreferrer">
                <Img src={i.src} alt={i.caption} loading="lazy" onError={() => setBroken((b) => ({ ...b, [i.key]: true }))} />
              </a>
              <figcaption style={{ fontSize: 12, color: 'var(--text-muted)' }}>{i.caption}</figcaption>
            </figure>
          ))}
        </ImageGrid>
      )}
    </section>
  );
}

/* Sexagesimal, as the /events card shows it. */
function hms(ra: number): string {
  const h = Math.floor(ra / 15), m = Math.floor((ra % 15) * 4), sec = ((ra % 15) * 4 - m) * 60;
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${sec.toFixed(1)}s`;
}
function dms(dec: number): string {
  const a = Math.abs(dec), d = Math.floor(a), m = Math.floor((a % 1) * 60), sec = ((a % 1) * 60 - m) * 60;
  return `${dec >= 0 ? '+' : '-'}${String(d).padStart(2, '0')}° ${String(m).padStart(2, '0')}' ${sec.toFixed(1)}"`;
}

/**
 * The events behind an answer as a vertical list of the /events page's floating event card
 * (same styled pieces: title + kind chip, meta line, T0 / error / RA / Dec grid, "Open full
 * record"), so an event reads the same on both pages.
 */
export function EventsInvolved({ events }: { events: (AskEventFacts & { sources: number })[] }) {
  // Only events with a page: circular-only events (no notices) have none and their links 404.
  const withPages = events.filter((e) => Number(e.noticeCount) > 0);
  if (!withPages.length) return null;
  const sorted = [...withPages].sort((a, b) => String(b.t0 ?? '').localeCompare(String(a.t0 ?? '')));
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHead>
        <SectionLabel>Events involved</SectionLabel>
        <SectionNote>{withPages.length}</SectionNote>
      </SectionHead>
      <CardList>
        {sorted.map((e) => {
          const err = posErrorRadius(e.posErrorDeg);
          const pos = hasPosition(e) && !(e.raDeg === 0 && e.decDeg === 0);
          return (
            <ListPanel key={e.canonicalId}>
              <EventPanelContent>
                <EventPanelTop>
                  <EventPanelLeft>
                    <EventTitle>{eventLabel(e, true)}</EventTitle>
                    {e.kind && <KindChip $color={kindColor(e.kind)}>{e.kind}</KindChip>}
                  </EventPanelLeft>
                </EventPanelTop>
              </EventPanelContent>
              <EventPanelBody>
                <CardMetaLine>
                  {[
                    `${e.noticeCount} notice${Number(e.noticeCount) === 1 ? '' : 's'}`,
                    `${e.circularCount} circular${Number(e.circularCount) === 1 ? '' : 's'}`,
                    e.t0 && getTimeAgo(new Date(e.t0)),
                    e.sources ? `${e.sources} source${e.sources === 1 ? '' : 's'} here` : null,
                  ].filter(Boolean).join(' · ')}
                </CardMetaLine>
                <CardGrid>
                  <CardField>
                    <CardFieldLabel>T0 (UTC)</CardFieldLabel>
                    <CardFieldValue>{utc(e.t0) ?? '—'}</CardFieldValue>
                  </CardField>
                  <CardField>
                    <CardFieldLabel>Error</CardFieldLabel>
                    <CardFieldValue>{err != null ? `± ${err.toFixed(3)}°` : 'not reported'}</CardFieldValue>
                  </CardField>
                  <CardField>
                    <CardFieldLabel>RA</CardFieldLabel>
                    <CardFieldValue>{pos ? hms(e.raDeg!) : '—'}</CardFieldValue>
                  </CardField>
                  <CardField>
                    <CardFieldLabel>Dec</CardFieldLabel>
                    <CardFieldValue>{pos ? dms(e.decDeg!) : '—'}</CardFieldValue>
                  </CardField>
                </CardGrid>
                <PrimaryAction as="a" href={eventPage(e.canonicalId)} style={{ marginTop: 12 }}>
                  Open full record →
                </PrimaryAction>
              </EventPanelBody>
            </ListPanel>
          );
        })}
      </CardList>
    </section>
  );
}

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
/* The /events card, in a list rather than floating: its phone style is a full-height bottom
   sheet, which a list item must not be. */
const ListPanel = styled(EventPanel)`
  @media (max-width: 640px) {
    height: auto;
    display: block;
    border: 1px solid var(--line-subtle);
    border-radius: 1rem;
  }
`;

const FactRow = styled.div`
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 12px;
  padding: 9px 16px;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text-body);
  & + & { border-top: 1px solid var(--line-hairline); }
  @media (max-width: 560px) { grid-template-columns: 112px minmax(0, 1fr); padding: 9px 12px; }
`;
const FactLabel = styled.span`color: var(--text-muted);`;
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;
const Img = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  /* Plots and location maps: cropping would cut off axes and labels. */
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--line-hairline);
  background: var(--surface-sunken);
`;
