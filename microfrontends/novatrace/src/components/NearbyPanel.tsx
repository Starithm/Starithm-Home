import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Event } from '@shared/types';
import { kindColor } from '@shared/utils/eventColors';
import { angularSeparation, formatSeparation, hasPosition } from '../utils/sky';

/* Events within a cone of the selected one, in the current filter window.
 *
 * This is proximity on the sky and nothing more — no association logic exists yet
 * (roadmap Layer 02), so the panel says so rather than implying a physical link.
 * Two sources can sit half a degree apart and be unrelated by billions of light
 * years.
 */

const RADIUS_DEG = 30;
const MAX_ROWS = 5;

const mono = "'Google Sans Code', ui-monospace, monospace";
const line = (a: number) => `rgba(231, 223, 221, ${a})`;

const Panel = styled.aside`
  position: absolute;
  right: 20px;
  top: 64px;
  width: 250px;
  z-index: 55;
  border: 1px solid ${line(0.13)};
  border-radius: 12px;
  background: rgba(16, 12, 26, 0.9);
  backdrop-filter: blur(10px);
  overflow: hidden;

  /* The globe is small enough on a phone that an overlay here would cover it;
     the sheet carries this list instead. */
  @media (max-width: 900px) {
    display: none;
  }
`;

const Head = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid ${line(0.08)};
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-family: ${mono};
  font-size: 9px;
`;

const HeadTitle = styled.span`
  font-weight: 500;
  letter-spacing: 0.14em;
  color: ${line(0.45)};
`;

const HeadRadius = styled.span`
  color: ${line(0.35)};
`;

/* Compact: id and separation on one line, instrument tucked beneath at 10px.
   Five of these plus a header should not out-weigh the event card. */
const RowItem = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: 0;
  border-bottom: 1px solid ${line(0.05)};
  padding: 7px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  font-family: ${mono};

  &:hover { background: ${line(0.04)}; }
`;

const RowTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${p => p.$color};
  box-shadow: 0 0 7px ${p => p.$color};
`;

const RowId = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #E7DFDD;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Sep = styled.span`
  margin-left: auto;
  font-size: 10px;
  font-weight: 500;
  color: #FFB400;
  flex-shrink: 0;
`;

const RowSrc = styled.span`
  font-size: 10px;
  color: ${line(0.45)};
  padding-left: 15px;
`;

const Note = styled.div`
  padding: 7px 12px;
  font-family: ${mono};
  font-size: 10px;
  line-height: 1.4;
  color: ${line(0.35)};
`;

interface Props {
  events: Event[];
  selectedEvent: Event | null;
  onSelect: (e: Event) => void;
}

export function NearbyPanel({ events, selectedEvent, onSelect }: Props) {
  const nearby = useMemo(() => {
    if (!selectedEvent || !hasPosition(selectedEvent)) return [];
    return events
      .filter(e => e !== selectedEvent
        && e.canonicalId !== selectedEvent.canonicalId
        && hasPosition(e))
      .map(e => ({
        event: e,
        sep: angularSeparation(selectedEvent.raDeg!, selectedEvent.decDeg!, e.raDeg!, e.decDeg!),
      }))
      .filter(r => r.sep <= RADIUS_DEG)
      .sort((a, b) => a.sep - b.sep)
      .slice(0, MAX_ROWS);
  }, [events, selectedEvent]);

  if (!selectedEvent) return null;

  return (
    <Panel>
      <Head>
        <HeadTitle>NEARBY IN THIS WINDOW</HeadTitle>
        <HeadRadius>≤ {RADIUS_DEG}°</HeadRadius>
      </Head>

      {!hasPosition(selectedEvent) && (
        <Note>The selected event has no position, so nothing can be measured against it.</Note>
      )}

      {hasPosition(selectedEvent) && nearby.length === 0 && (
        <Note>No other positioned event within {RADIUS_DEG}° in this window.</Note>
      )}

      {nearby.map(({ event, sep }) => (
        <RowItem key={event.canonicalId || event.id} onClick={() => onSelect(event)}>
          <RowTop>
            <Dot $color={kindColor(event.alertKind)} />
            <RowId>{event.canonicalId || event.id}</RowId>
            <Sep>{formatSeparation(sep)} away</Sep>
          </RowTop>
          <RowSrc>{event.sourceName || '—'}</RowSrc>
        </RowItem>
      ))}

      <Note>Proximity only — not a physical association.</Note>
    </Panel>
  );
}
