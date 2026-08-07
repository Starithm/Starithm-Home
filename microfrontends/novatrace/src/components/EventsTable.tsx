import React, { useMemo, useState } from 'react';
import { Event } from '@shared/types';
import { kindColor } from '@shared/utils/eventColors';
import { getTimeAgo } from '../utils/duration';
import { posErrorRadius as errorRadius, hasPosition } from '../utils/sky';
import {
  TableShell, Scroller, HeadRow, HeadCell, SortArrow, Row, IdCell, KindChip,
  DesktopCell, MobileMeta, Foot, FootAction, DensityControl, DensityOption, EmptyState,
} from '../styled_pages/EventsTable.styled';

export type Density = 'compact' | 'comfortable';

type SortKey = 'canonicalId' | 'alertKind' | 'sourceName' | 't0' | 'raDeg' | 'decDeg' | 'posErrorDeg';

interface Column {
  key: SortKey;
  label: string;
  sortable?: boolean;
}

const COLUMNS: Column[] = [
  { key: 'canonicalId', label: 'Canonical ID' },
  { key: 'alertKind', label: 'Type' },
  { key: 'sourceName', label: 'Instrument' },
  { key: 't0', label: 'T0 (UTC)' },
  { key: 't0', label: 'Age', sortable: false },   // same underlying field as T0
  { key: 'raDeg', label: 'RA°' },
  { key: 'decDeg', label: 'Dec°' },
  { key: 'posErrorDeg', label: 'Error' },
];

function fmtT0(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
}

const fmtDeg = (v: number | null | undefined, signed = false) =>
  v == null ? '—' : `${signed && v >= 0 ? '+' : ''}${v.toFixed(3)}`;

const fmtErr = (v: unknown) => {
  const r = errorRadius(v);
  return r == null ? '—' : `${r < 1 ? r.toFixed(3) : r.toFixed(2)}°`;
};

function sortValue(e: Event, key: SortKey): string | number {
  switch (key) {
    case 't0': return new Date(e.t0 || 0).getTime();
    case 'raDeg': return e.raDeg ?? Number.NEGATIVE_INFINITY;
    case 'decDeg': return e.decDeg ?? Number.NEGATIVE_INFINITY;
    case 'posErrorDeg': return errorRadius(e.posErrorDeg) ?? Number.NEGATIVE_INFINITY;
    default: return String(e[key] ?? '').toLowerCase();
  }
}

function toCsv(events: Event[]): string {
  const cols = ['canonicalId', 'alertKind', 'sourceName', 't0', 'raDeg', 'decDeg', 'posErrorDeg'];
  const esc = (s: any) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  const rows = events.map(e => [
    e.canonicalId, e.alertKind, e.sourceName, e.t0, e.raDeg, e.decDeg, errorRadius(e.posErrorDeg),
  ].map(esc).join(','));
  return [cols.join(','), ...rows].join('\n');
}

interface Props {
  events: Event[];
  selectedEvent: Event | null;
  onSelect: (e: Event) => void;
  onOpen: (e: Event) => void;
}

export function EventsTable({ events, selectedEvent, onSelect, onOpen }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 't0', dir: 'desc' });
  const [density, setDensity] = useState<Density>('compact');

  const sorted = useMemo(() => {
    const copy = [...events];
    copy.sort((a, b) => {
      const av = sortValue(a, sort.key);
      const bv = sortValue(b, sort.key);
      if (av === bv) return 0;
      const cmp = av < bv ? -1 : 1;
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [events, sort]);

  /* Events with no position never reach the globe. Surfacing the count here is
     the only place a user can tell they exist at all. */
  const positionless = useMemo(() => events.filter(e => !hasPosition(e)).length, [events]);

  const toggleSort = (key: SortKey) =>
    setSort(s => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }));

  const exportCsv = () => {
    const blob = new Blob([toCsv(sorted)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `starithm-events-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TableShell>
      <HeadRow>
        {COLUMNS.map(col => {
          const active = col.sortable !== false && sort.key === col.key;
          return (
            <HeadCell
              key={col.label}
              $active={active}
              $sortable={col.sortable}
              onClick={() => col.sortable !== false && toggleSort(col.key)}
            >
              {col.label}
              {active && <SortArrow>{sort.dir === 'asc' ? '↑' : '↓'}</SortArrow>}
            </HeadCell>
          );
        })}
      </HeadRow>

      <Scroller>
        {sorted.length === 0 && <EmptyState>No events match these filters.</EmptyState>}
        {sorted.map(e => {
          const selected = !!selectedEvent &&
            (e.canonicalId === selectedEvent.canonicalId || e.id === selectedEvent.id);
          const colour = kindColor(e.alertKind);
          return (
            <Row
              key={e.canonicalId || e.id}
              $selected={selected}
              $comfortable={density === 'comfortable'}
              onClick={() => onSelect(e)}
              onDoubleClick={() => onOpen(e)}
              title="Click to select · double-click to open the full record"
            >
              <IdCell>{e.canonicalId || e.id}</IdCell>
              <KindChip $color={colour}>{e.alertKind}</KindChip>
              <DesktopCell $dim={0.7}>{e.sourceName || '—'}</DesktopCell>
              <DesktopCell $dim={0.78}>{fmtT0(e.t0)}</DesktopCell>
              <DesktopCell $dim={0.45}>{e.t0 ? getTimeAgo(new Date(e.t0)) : '—'}</DesktopCell>
              <DesktopCell $dim={0.6}>{hasPosition(e) ? fmtDeg(e.raDeg) : '—'}</DesktopCell>
              <DesktopCell $dim={0.6}>{hasPosition(e) ? fmtDeg(e.decDeg, true) : '—'}</DesktopCell>
              <DesktopCell $dim={0.5}>{fmtErr(e.posErrorDeg)}</DesktopCell>

              <MobileMeta>
                <span>{e.sourceName || '—'}</span>
                <span>{fmtT0(e.t0)}</span>
                <span>{e.t0 ? getTimeAgo(new Date(e.t0)) : '—'}</span>
                {hasPosition(e) && <span>RA {fmtDeg(e.raDeg)}° · Dec {fmtDeg(e.decDeg, true)}°</span>}
                <span>± {fmtErr(e.posErrorDeg)}</span>
              </MobileMeta>
            </Row>
          );
        })}
      </Scroller>

      <Foot>
        <span>
          {events.length} rows
          {positionless > 0 && ` · ${positionless} without position (shown here, absent from the globe)`}
        </span>
        <DensityControl>
          <span>Density</span>
          <DensityOption $active={density === 'compact'} onClick={() => setDensity('compact')}>
            Compact
          </DensityOption>
          <DensityOption $active={density === 'comfortable'} onClick={() => setDensity('comfortable')}>
            Comfortable
          </DensityOption>
          <FootAction onClick={exportCsv}>Export CSV</FootAction>
        </DensityControl>
      </Foot>
    </TableShell>
  );
}
