import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Event } from '@shared/types';

/* Event counts across the current date window, as a sparkline in the filter row.
 *
 * Drag across it to narrow the window: the drag maps back to dates and replaces
 * the range, which is a faster way to zoom into a busy night than opening the
 * date picker twice. Bins are UTC, matching every other time display here.
 */

const BINS = 56;
const mono = "'Google Sans Code', ui-monospace, monospace";
const line = (a: number) => `rgba(231, 223, 221, ${a})`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 12px 5px 13px;
  border-radius: 999px;
  border: 1px solid ${line(0.14)};
  background: rgba(14, 11, 22, 0.6);
  user-select: none;

  @media (max-width: 900px) {
    display: none;
  }
`;

const Label = styled.span`
  font-family: ${mono};
  font-size: 10px;
  letter-spacing: 0.08em;
  color: ${line(0.4)};
`;

const Track = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1.5px;
  height: 18px;
  width: 220px;
  cursor: ew-resize;
  position: relative;
`;

const Bin = styled.div<{ $h: string; $on: boolean; $sel: boolean }>`
  flex: 1;
  min-width: 0;
  border-radius: 1px 1px 0 0;
  height: ${p => p.$h};
  background: ${p =>
    p.$sel ? 'rgba(255, 195, 50, 0.9)'
      : p.$on ? 'rgba(141, 15, 245, 0.85)'
      : 'rgba(141, 15, 245, 0.38)'};
`;

const Hint = styled.span`
  font-family: ${mono};
  font-size: 10px;
  color: ${line(0.4)};
  white-space: nowrap;
`;

const DAY = 86400000;

interface Props {
  events: Event[];
  start: string;             // YYYY-MM-DD
  end: string;               // YYYY-MM-DD
  onNarrow: (start: string, end: string) => void;
}

const toDateString = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function ActivityRibbon({ events, start, end, onNarrow }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ from: number; to: number } | null>(null);

  const startMs = new Date(`${start}T00:00:00Z`).getTime();
  // The range is inclusive of the end day, so bin across to its final moment.
  const endMs = new Date(`${end}T00:00:00Z`).getTime() + DAY;
  const span = Math.max(DAY, endMs - startMs);

  const { bins, peak } = useMemo(() => {
    const counts = new Array(BINS).fill(0);
    for (const e of events) {
      if (!e.t0) continue;
      const t = new Date(e.t0).getTime();
      if (!Number.isFinite(t) || t < startMs || t >= endMs) continue;
      const i = Math.min(BINS - 1, Math.floor(((t - startMs) / span) * BINS));
      counts[i] += 1;
    }
    return { bins: counts, peak: Math.max(1, ...counts) };
  }, [events, startMs, endMs, span]);

  const binFromClientX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const frac = (clientX - rect.left) / rect.width;
    return Math.min(BINS - 1, Math.max(0, Math.floor(frac * BINS)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const i = binFromClientX(e.clientX);
    setDrag({ from: i, to: i });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    setDrag(d => (d ? { ...d, to: binFromClientX(e.clientX) } : d));
  };

  const onPointerUp = () => {
    if (!drag) return;
    const lo = Math.min(drag.from, drag.to);
    const hi = Math.max(drag.from, drag.to);
    setDrag(null);
    // A click rather than a drag — don't collapse the window to one bin.
    if (hi - lo < 1) return;
    const from = startMs + (lo / BINS) * span;
    const to = startMs + ((hi + 1) / BINS) * span;
    onNarrow(toDateString(from), toDateString(to - 1));
  };

  const days = Math.round(span / DAY);
  const selection = drag
    ? { lo: Math.min(drag.from, drag.to), hi: Math.max(drag.from, drag.to) }
    : null;

  return (
    <Wrap>
      <Label>ACTIVITY</Label>
      <Track
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        title="Drag across to narrow the date range"
      >
        {bins.map((n, i) => (
          <Bin
            key={i}
            $h={`${Math.max(6, (n / peak) * 100)}%`}
            /* Second half of the window reads as "recent" and sits brighter, as
               in the mock — it's the part you're most likely acting on. */
            $on={i > BINS * 0.8}
            $sel={!!selection && i >= selection.lo && i <= selection.hi}
          />
        ))}
      </Track>
      <Hint>{days}d · drag to narrow</Hint>
    </Wrap>
  );
}
