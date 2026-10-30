import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { type AskSource, circularUrl, opensInPopup, sourceLabel } from '@novatrace/lib/askCosmos';
import { Link, Mono, SectionLabel } from '@novatrace/styled_pages/AskPage.styled';

/* The source rail: every circular retrieved, as a filterable vertical list (not a carousel:
 * researchers scan 20–40 sources). Archive-only circulars (embedded, not yet extracted) get a
 * dashed card and a gcn.nasa.gov link, since they have no event page yet. */

type Sort = 'relevance' | 'date';

interface Props {
  sources: AskSource[] | null;
  countText: string;
  hoverKey: string | null;
  onHover: (key: string | null) => void;
  /** Open a circular in the popup (the same one the circular archive uses). */
  onOpen: (key: string) => void;
}

export default function AskSources({ sources, countText, hoverKey, onHover, onOpen }: Props) {
  const [event, setEvent] = useState('all');
  const [sort, setSort] = useState<Sort>('relevance');

  const events = useMemo(() => {
    const seen = new Map<string, string>();
    for (const s of sources ?? []) if (s.event) seen.set(s.event, s.eventName ?? s.event);
    return [...seen.entries()];
  }, [sources]);

  const shown = useMemo(() => {
    let list = (sources ?? []).filter((s) => event === 'all' || s.event === event);
    if (sort === 'date') list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    return list;
  }, [sources, event, sort]);

  return (
    <Wrap>
      <Head>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <SectionLabel>Sources</SectionLabel>
          <Mono style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{countText}</Mono>
        </span>
        <Select aria-label="Sort sources" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="relevance">Relevance</option>
          <option value="date">Newest</option>
        </Select>
      </Head>

      {sources && events.length > 1 && (
        <Filters>
          {(
            <Select aria-label="Filter by event" value={event} onChange={(e) => setEvent(e.target.value)} $active={event !== 'all'}>
              <option value="all">Event: all</option>
              {events.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </Select>
          )}
        </Filters>
      )}

      {!sources && (
        <List>{[0, 1, 2].map((i) => <Skeleton key={i}><Bar $w={40} /><Bar $w={90} /><Bar $w={70} /></Skeleton>)}</List>
      )}

      <Scroller tabIndex={0} aria-label="Sources list">
        {shown.map((s, i) => (
          <SourceCard key={s.key} $archive={s.archive} $active={hoverKey === s.key} $clickable={opensInPopup(s.key)}
            onMouseEnter={() => onHover(s.key)} onMouseLeave={() => onHover(null)}
            role={opensInPopup(s.key) ? 'button' : undefined} tabIndex={opensInPopup(s.key) ? 0 : undefined}
            onClick={() => opensInPopup(s.key) && onOpen(s.key)}
            onKeyDown={(e) => { if (opensInPopup(s.key) && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onOpen(s.key); } }}>
            <CardTop>
              <Mono style={{ color: 'var(--accent-text)', fontWeight: 500 }}>
                {sourceLabel(s)}
              </Mono>
              <Mono style={{ color: 'var(--text-muted)' }}>{s.date}</Mono>
              <span style={{ flex: 1 }} />
              {s.match === 'keyword' && <Tag>keyword</Tag>}
              {s.eventName && (s.event && s.eventPage ? (
                <EventTag as="a" href={`/novatrace/events/${encodeURIComponent(s.event)}`} onClick={(e) => e.stopPropagation()}
                  title="Open the event page">{s.eventName.replace(/^LIGO\/Virgo\/KAGRA /, '')}</EventTag>
              ) : <EventTag>{s.eventName.replace(/^LIGO\/Virgo\/KAGRA /, '')}</EventTag>)}
              {s.archive && <Tag>Archive · not extracted</Tag>}
            </CardTop>
            <Subject>{s.subject}</Subject>
            {s.snippet && <Snippet>{s.snippet}</Snippet>}
            {opensInPopup(s.key) ? (
              <OpenHint>{s.archive ? 'Open circular (archive text)' : 'Open circular'}</OpenHint>
            ) : (
              <Link href={circularUrl(s)} style={{ fontSize: 12 }} onClick={(e) => e.stopPropagation()}>{s.key.startsWith('EVENTS-') ? 'All events →' : 'Event page →'}</Link>
            )}
            <SrIndex>[{i + 1}]</SrIndex>
          </SourceCard>
        ))}
        {sources && shown.length === 0 && <Snippet>No sources match this filter.</Snippet>}
      </Scroller>
    </Wrap>
  );
}

const Wrap = styled.div`display: flex; flex-direction: column; gap: 12px; font-family: var(--font-mono);`;
const Head = styled.div`display: flex; align-items: baseline; justify-content: space-between; gap: 12px;`;
const Filters = styled.div`display: flex; flex-wrap: wrap; gap: 6px;`;
const Select = styled.select<{ $active?: boolean }>`
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid ${(p) => (p.$active ? 'var(--primary)' : 'var(--line-subtle)')};
  background: ${(p) => (p.$active ? 'var(--accent-surface)' : 'var(--surface-raised)')};
  color: ${(p) => (p.$active ? 'var(--accent-text)' : 'var(--text-secondary)')};
  font-family: var(--font-mono);
  font-size: 12.5px;
  max-width: 100%;
`;
const List = styled.div`display: flex; flex-direction: column; gap: 8px;`;
/* About five cards tall; the rest scroll inside the rail rather than lengthening the page. */
const Scroller = styled(List)`
  max-height: 720px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--line-control) transparent;
  &:focus-visible { outline: 1px solid var(--primary); outline-offset: 2px; border-radius: 8px; }
  @media (max-width: 860px) { max-height: none; overflow: visible; }
`;
const SourceCard = styled.div<{ $archive: boolean; $active: boolean; $clickable: boolean }>`
  position: relative;
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  &:focus-visible { outline: 1px solid var(--primary); outline-offset: 2px; }
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px ${(p) => (p.$archive && !p.$active ? 'dashed' : 'solid')}
    ${(p) => (p.$active ? 'var(--primary)' : p.$archive ? 'var(--line-subtle)' : 'var(--line-hairline)')};
  background: ${(p) => (p.$active ? 'var(--accent-surface)' : p.$archive ? 'var(--surface-sunken)' : 'var(--surface-raised)')};
  transition: background 0.15s, border-color 0.15s;
`;
const CardTop = styled.div`display: flex; align-items: center; gap: 8px; font-size: 12px; flex-wrap: wrap;`;
const Tag = styled.span`
  padding: 2px 6px; border-radius: 4px; border: 1px solid var(--line-subtle);
  color: var(--text-muted); font-size: 11px;
`;
const EventTag = styled.span`
  padding: 2px 7px; border-radius: 4px; background: var(--accent-surface);
  color: var(--accent-text); font-size: 11.5px; text-decoration: none;
  &[href]:hover { text-decoration: underline; }
`;
const OpenHint = styled.span`font-size: 12px; color: var(--starithm-link);`;
const Subject = styled.div`font-size: 13.5px; line-height: 1.4; font-weight: 500; color: var(--text-body); text-wrap: pretty;`;
const Snippet = styled.div`font-size: 12.5px; line-height: 1.5; color: var(--text-muted); text-wrap: pretty;`;
const SrIndex = styled.span`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0);`;
const Skeleton = styled.div`
  border: 1px solid var(--line-hairline); border-radius: 8px; background: var(--surface-raised);
  padding: 14px; display: flex; flex-direction: column; gap: 8px;
`;
const Bar = styled.div<{ $w: number }>`width: ${(p) => p.$w}%; height: 9px; border-radius: 4px; background: var(--line-subtle);`;
