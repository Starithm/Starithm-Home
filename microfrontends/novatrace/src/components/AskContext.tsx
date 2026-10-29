import React, { useState } from 'react';
import styled from 'styled-components';
import { type AskEventFacts, eventLabel } from '@novatrace/lib/askCosmos';
import { Card, Link, Mono, SectionHead, SectionLabel, SectionNote } from '@novatrace/styled_pages/AskPage.styled';

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
        <Link href={eventPage(event.canonicalId)} style={{ marginLeft: 'auto', fontSize: 12.5 }}>Event page →</Link>
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

function Images({ event }: { event: AskEventFacts }) {
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const imgs: { key: string; src: string; caption: string }[] = [];
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
  const shown = imgs.filter((i) => !broken[i.key]);
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <SectionHead>
        <SectionLabel>Images</SectionLabel>
        <SectionNote>From LVK and sky surveys. Circulars are text only.</SectionNote>
      </SectionHead>
      {shown.length === 0 ? (
        <SectionNote>
          {!realPosition(event) ? 'No images: the position is not reported, so there is no sky cutout.'
            : 'No images: the position is too uncertain for a useful sky cutout.'}
          {event.kind !== 'gw' ? ' Skymaps exist only for gravitational-wave events.' : ''}
        </SectionNote>
      ) : (
        <ImageGrid>
          {shown.map((i) => (
            <figure key={i.key} style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <Img src={i.src} alt={i.caption} loading="lazy" onError={() => setBroken((b) => ({ ...b, [i.key]: true }))} />
              <figcaption style={{ fontSize: 12, color: 'var(--text-muted)' }}>{i.caption}</figcaption>
            </figure>
          ))}
        </ImageGrid>
      )}
    </section>
  );
}

export function EventsInvolved({ events }: { events: (AskEventFacts & { sources: number })[] }) {
  if (!events.length) return null;
  const sorted = [...events].sort((a, b) => (b.t0 ?? '').localeCompare(a.t0 ?? ''));
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHead>
        <SectionLabel>Events involved</SectionLabel>
        <SectionNote>{events.length}</SectionNote>
      </SectionHead>
      <Card>
        {sorted.map((e) => (
          <EventRow key={e.canonicalId} href={eventPage(e.canonicalId)}>
            <span style={{ color: 'var(--text-body)', fontWeight: 500 }}>{eventLabel(e, true)}</span>
            <span style={{ color: 'var(--text-muted)' }}>{e.kind ? KIND[e.kind] ?? e.kind : ''}</span>
            <Mono style={{ color: 'var(--text-muted)' }}>{utc(e.t0)?.slice(0, 10) ?? 'time not reported'}</Mono>
            <Mono style={{ marginLeft: 'auto', color: 'var(--accent-text)' }}>{e.sources} source{e.sources === 1 ? '' : 's'}</Mono>
          </EventRow>
        ))}
      </Card>
    </section>
  );
}

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
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--line-hairline);
  background: var(--surface-sunken);
`;
const EventRow = styled.a`
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 16px;
  font-size: 13px;
  text-decoration: none;
  flex-wrap: wrap;
  & + & { border-top: 1px solid var(--line-hairline); }
  &:hover { background: var(--row-hover); }
`;
