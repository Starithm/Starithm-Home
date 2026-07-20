import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  background-color: var(--background);
  color: var(--foreground);
`;

export const Container = styled.div`
  max-width: 90rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (min-width: 640px) { padding: 2rem 1.5rem; }
  @media (min-width: 1024px) { padding: 2rem; }
`;

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: var(--foreground);
`;

export const Subtitle = styled.p`
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.9rem;
`;

/* ── Time-range filter (one row above the charts) ─────────────────────────── */
export const RangeBar = styled.div`
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  background: color-mix(in srgb, var(--muted) 40%, transparent);
`;

export const RangeButton = styled.button<{ $active: boolean }>`
  border: 0;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
  border-radius: 0.45rem;
  color: ${p => (p.$active ? '#fff' : 'var(--muted-foreground)')};
  background: ${p => (p.$active ? 'var(--starithm-veronica)' : 'transparent')};
  transition: background 0.15s ease;
  &:hover { color: var(--foreground); }
`;

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

export const DateField = styled.label<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);

  input {
    font-size: 0.8rem;
    padding: 0.3rem 0.5rem;
    border-radius: 0.45rem;
    border: 1px solid ${p => (p.$active ? 'var(--starithm-veronica)' : 'var(--border)')};
    background: var(--card);
    color: var(--foreground);
    color-scheme: dark light;
  }
`;

export const ClearBtn = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  text-decoration: underline;
  &:hover { color: var(--foreground); }
`;

/* ── Stat tiles ───────────────────────────────────────────────────────────── */
export const TilesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.75rem;
  @media (min-width: 768px) { grid-template-columns: repeat(4, minmax(0, 1fr)); }
`;

export const Tile = styled.div`
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  padding: 1rem 1.1rem;
`;

export const TileValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--foreground);
  font-variant-numeric: tabular-nums;
`;

export const TileLabel = styled.div`
  margin-top: 0.35rem;
  font-size: 0.78rem;
  color: var(--muted-foreground);
`;

/* ── Small-multiples grid ─────────────────────────────────────────────────── */
export const FacetGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  @media (min-width: 640px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (min-width: 1440px) { grid-template-columns: repeat(4, minmax(0, 1fr)); }
`;

export const Facet = styled.div<{ $empty?: boolean }>`
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  padding: 0.85rem 0.9rem 0.6rem;
  opacity: ${p => (p.$empty ? 0.5 : 1)};
  transition: opacity 0.15s ease;
`;

export const FacetHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
`;

export const FacetTitle = styled.div`
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FacetKind = styled.span`
  font-size: 0.68rem;
  color: var(--muted-foreground);
  font-weight: 400;
`;

export const FacetTotal = styled.div<{ $empty?: boolean }>`
  font-size: 0.82rem;
  font-weight: 700;
  color: ${p => (p.$empty ? 'var(--muted-foreground)' : 'var(--starithm-veronica)')};
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
`;

export const FacetAxis = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.15rem;
  font-size: 0.62rem;
  color: var(--muted-foreground);
`;

/* ── Tooltip ──────────────────────────────────────────────────────────────── */
export const TipBox = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.4rem;
  padding: 0.35rem 0.55rem;
  font-size: 0.75rem;
  color: var(--foreground);
  box-shadow: 0 4px 14px rgba(0,0,0,0.25);
`;
export const TipDate = styled.div` color: var(--muted-foreground); `;
export const TipCount = styled.div` font-weight: 700; font-variant-numeric: tabular-nums; `;

/* ── States + table fallback ──────────────────────────────────────────────── */
export const Centered = styled.div`
  display: flex; align-items: center; justify-content: center;
  min-height: 40vh; color: var(--muted-foreground);
`;

export const TableDetails = styled.details`
  margin-top: 2rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  padding: 0.75rem 1rem;
  summary { cursor: pointer; font-size: 0.85rem; color: var(--muted-foreground); }
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.75rem;
  font-size: 0.82rem;
  th, td { text-align: left; padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); }
  th { color: var(--muted-foreground); font-weight: 600; }
  td:last-child, th:last-child { text-align: right; font-variant-numeric: tabular-nums; }
`;
