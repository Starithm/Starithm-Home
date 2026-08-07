import styled from 'styled-components';

/* List view (design 2b) — the table that sits behind the Globe/List toggle.
 *
 * Colours are literal rather than themed: this view lives inside the NovaTrace
 * dashboard, which is dark-only, and the design specifies exact alpha ramps over
 * the platinum. Same approach as EventRecord.styled.tsx.
 *
 * The SIG and N · C columns from the 2b mock are deliberately absent — the list
 * endpoint carries neither significance nor per-event counts. See
 * docs/events-page-design-context.md §9.
 */

const PLATINUM = '#E7DFDD';
const line = (a: number) => `rgba(231, 223, 221, ${a})`;
const GOLD = '#FFB400';
const SELECTED = 'rgba(141, 15, 245, 0.10)';

const mono = "'Google Sans Code', ui-monospace, monospace";

/* Eight columns; the mock's last two (N · C, SIG) are dropped. Instrument gets a
   little room to grow for "LIGO-Virgo-KAGRA", and a trailing 1fr track soaks up
   the rest — the mock keeps its columns grouped left with slack on the right
   rather than stretching a data column across the viewport. The trailing track
   has no cell in it; that's intentional. */
export const COLUMNS = '150px 78px minmax(168px, 240px) 152px 74px 92px 92px 78px 1fr';

/* MainContent centres its child (it was written for the globe, which is a fixed
   square). The table needs the full box instead, or its sticky header and footer
   fall outside the visible area. */
export const TableShell = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  height: 100%;
  align-self: stretch;
  border-top: 1px solid ${line(0.1)};
  overflow: hidden;

  @media (max-width: 640px) {
    height: auto;
    min-height: 60vh;
  }
`;

export const Scroller = styled.div`
  flex: 1;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: ${line(0.18)} transparent;
  &::-webkit-scrollbar { width: 8px; height: 8px; }
  &::-webkit-scrollbar-thumb { background: ${line(0.18)}; border-radius: 999px; }
`;

export const HeadRow = styled.div`
  display: grid;
  grid-template-columns: ${COLUMNS};
  padding: 9px 18px;
  border-bottom: 1px solid ${line(0.1)};
  background: ${line(0.02)};
  position: sticky;
  top: 0;
  z-index: 2;
  backdrop-filter: blur(8px);

  @media (max-width: 900px) {
    display: none;
  }
`;

export const HeadCell = styled.button<{ $active?: boolean; $sortable?: boolean }>`
  font-family: ${mono};
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: left;
  background: none;
  border: 0;
  padding: 0;
  color: ${p => (p.$active ? GOLD : line(0.45))};
  cursor: ${p => (p.$sortable === false ? 'default' : 'pointer')};
  white-space: nowrap;

  &:hover {
    color: ${p => (p.$sortable === false ? line(0.45) : PLATINUM)};
  }
`;

export const SortArrow = styled.span`
  margin-left: 4px;
`;

export const Row = styled.div<{ $selected?: boolean; $comfortable?: boolean }>`
  display: grid;
  grid-template-columns: ${COLUMNS};
  align-items: center;
  padding: ${p => (p.$comfortable ? '18px' : '11px')} 18px;
  border-bottom: 1px solid ${line(0.05)};
  background: ${p => (p.$selected ? SELECTED : 'transparent')};
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: ${p => (p.$selected ? SELECTED : line(0.03))};
  }

  /* Below the grid breakpoint each row becomes a stacked card — the eight columns
     can't compress far enough to stay a table on a phone. */
  @media (max-width: 900px) {
    grid-template-columns: 1fr auto;
    gap: 4px 10px;
    padding: 12px 16px;
  }
`;

/* globals.css sets `* { background-color: inherit }`, so a cell would repaint the
   row's semi-transparent fill on top of itself — doubling the alpha over the
   columns and leaving a visible seam where they end. Cells stay transparent;
   KindChip opts back in with its own fill. */
export const Cell = styled.span<{ $dim?: number; $weight?: number; $size?: number }>`
  font-family: ${mono};
  font-size: ${p => p.$size ?? 11}px;
  font-weight: ${p => p.$weight ?? 400};
  color: ${p => line(p.$dim ?? 0.6)};
  background-color: transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const IdCell = styled(Cell)`
  font-size: 12px;
  font-weight: 600;
  color: ${PLATINUM};

  @media (max-width: 900px) {
    grid-column: 1;
  }
`;

export const KindChip = styled.span<{ $color: string }>`
  font-family: ${mono};
  font-size: 10px;
  font-weight: 500;
  padding: 3px 6px;
  border-radius: 4px;
  background: ${p => `${p.$color}28`};
  color: ${p => p.$color};
  justify-self: start;
  white-space: nowrap;

  @media (max-width: 900px) {
    grid-column: 2;
    grid-row: 1;
  }
`;

/* On mobile the remaining cells collapse into one wrapped meta line. */
export const MobileMeta = styled.span`
  display: none;
  background-color: transparent;

  @media (max-width: 900px) {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 12px;
    grid-column: 1 / -1;
    font-family: ${mono};
    font-size: 11px;
    color: ${line(0.5)};
  }
`;

export const DesktopCell = styled(Cell)`
  @media (max-width: 900px) {
    display: none;
  }
`;

export const Foot = styled.div`
  padding: 10px 18px;
  border-top: 1px solid ${line(0.08)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-family: ${mono};
  font-size: 10px;
  color: ${line(0.4)};
`;

export const FootAction = styled.button`
  font-family: ${mono};
  font-size: 10px;
  background: none;
  border: 0;
  padding: 0;
  color: ${line(0.4)};
  cursor: pointer;
  &:hover { color: ${GOLD}; }
`;

export const DensityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${mono};
  font-size: 11px;
  color: ${line(0.4)};
`;

export const DensityOption = styled.button<{ $active: boolean }>`
  font-family: ${mono};
  font-size: 11px;
  font-weight: ${p => (p.$active ? 500 : 400)};
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: ${p => (p.$active ? GOLD : line(0.45))};
  &:hover { color: ${p => (p.$active ? GOLD : PLATINUM)}; }
`;

export const EmptyState = styled.div`
  padding: 48px 18px;
  text-align: center;
  font-family: ${mono};
  font-size: 12px;
  color: ${line(0.4)};
`;
