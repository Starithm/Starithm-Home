import styled, { css } from 'styled-components';
import type { RoadmapStatus } from '../data/roadmap';

/* Roadmap — "the frontier".
 *
 * Colours come from the Starithm palette in shared/styles/globals.css, referenced as
 * custom properties so a palette change propagates for free. The reference design used
 * its own greens and violets; those are mapped here:
 *   held     -> #10b981, the green this page already used for completed items
 *   crossing -> --starithm-electric-violet-dark (brand, "active") in place of an
 *               off-brand blue
 *   ahead    -> muted platinum
 */

/* The roadmap card carries its own near-neutral black surface (from the reference
   design, flatter than the violet-tinted --starithm-rich-black). The page around it
   is left transparent so the treatment stays scoped to the roadmap itself. */
const CARD_BG = '#0A0810';
const RULE = '#1B1626';
const AHEAD_BG = '#0C0A12';
const VIOLET = 'var(--starithm-electric-violet, #8D0FF5)';
const VIOLET_D = 'var(--starithm-electric-violet-dark, #9A48FF)';
const PLATINUM = 'var(--starithm-platinum, #E7DFDD)';

const HELD = '#10b981';

/* Alpha variants of --starithm-platinum (231,223,221). */
const line = (a: number) => `rgba(231, 223, 221, ${a})`;

export const STATUS_COLOR: Record<RoadmapStatus, string> = {
  held: HELD,
  crossing: VIOLET_D,
  ahead: line(0.32),
};

export const STATUS_GLYPH: Record<RoadmapStatus, string> = {
  held: '✓',
  crossing: '◐',
  ahead: '○',
};

/* Column template drives both the header row and every band, so they stay aligned. */
const GRID = css`
  display: grid;
  grid-template-columns: 186px minmax(0, 280px) minmax(0, 280px) minmax(0, 1fr);
  gap: 0 24px;
  @media (max-width: 1100px) {
    grid-template-columns: 160px minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: 0 16px;
  }
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const Page = styled.div`
  color: ${PLATINUM};
  padding: 0 clamp(14px, 3vw, 24px) 48px;
  display: flex;
  justify-content: center;
`;

export const Shell = styled.div`
  width: 100%;
  max-width: min(100%, 1300px);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${line(0.5)};
  text-decoration: none;
  &:hover { color: ${PLATINUM}; }
`;

export const Card = styled.div`
  background: ${CARD_BG};
  border: 1px solid ${RULE};
  border-radius: 16px;
  padding: clamp(20px, 2.5vw, 34px) clamp(18px, 4vw, 60px) clamp(32px, 4vw, 56px);
`;

export const Masthead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(20px, 4vw, 48px);
  flex-wrap: wrap;
  padding-bottom: 28px;
  border-bottom: 1px solid ${RULE};
`;

export const Kicker = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${VIOLET_D};
`;

export const Title = styled.h1`
  margin: 12px 0 0;
  font-size: clamp(28px, 4.4vw, 42px);
  font-weight: 700;
  letter-spacing: -0.025em;
  color: ${PLATINUM};
`;

export const Lede = styled.p`
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.65;
  color: ${line(0.55)};
  max-width: 62ch;
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: ${line(0.45)};
`;

export const LegendRow = styled.div<{ $status: RoadmapStatus }>`
  display: flex;
  align-items: center;
  gap: 10px;
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${p => STATUS_COLOR[p.$status]};
    flex-shrink: 0;
  }
`;

/* ── the frontier grid ─────────────────────────────────────────────────── */

export const Grid = styled.div`
  position: relative;
  padding-top: 34px;
`;

/* Dashed rule sitting between "Crossing" and "Ahead": everything left of it runs
   today. Positioned off the same track sizes as the grid, and hidden once the
   layout stacks. */
export const Frontier = styled.div`
  position: absolute;
  top: 0;
  bottom: 18px;
  left: calc(186px + 280px + 280px + 24px * 3 - 12px);
  border-left: 1px dashed ${VIOLET};
  pointer-events: none;
  @media (max-width: 1100px), (max-width: 820px) { display: none; }
`;

export const FrontierLabel = styled.div`
  position: absolute;
  top: -6px;
  left: calc(186px + 280px + 280px + 24px * 3 - 2px);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${VIOLET_D};
  pointer-events: none;
  @media (max-width: 1100px), (max-width: 820px) { display: none; }
`;

export const ColumnHead = styled.div`
  ${GRID};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${line(0.35)};
  padding-bottom: 16px;
  @media (max-width: 820px) { display: none; }
`;

export const ColumnLabel = styled.span<{ $status?: RoadmapStatus }>`
  color: ${p => (p.$status ? STATUS_COLOR[p.$status] : 'inherit')};
`;

export const Band = styled.div`
  ${GRID};
  align-items: start;
  border-top: 1px solid ${RULE};
  padding: 22px 0 26px;
`;

export const BandMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 8px;
`;

export const BandDepth = styled.span`
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${line(0.3)};
`;

export const BandName = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: ${PLATINUM};
`;

export const BandNote = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: ${line(0.42)};
`;

export const Column = styled.div<{ $split?: boolean }>`
  display: ${p => (p.$split ? 'grid' : 'flex')};
  ${p => (p.$split
    ? 'grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); align-content: start;'
    : 'flex-direction: column;')}
  gap: 8px;
  min-width: 0;
`;

/* Stacked layout needs a visible column label, since the header row is hidden. */
export const ColumnTag = styled.div<{ $status: RoadmapStatus }>`
  display: none;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${p => STATUS_COLOR[p.$status]};
  @media (max-width: 820px) { display: block; }
`;

export const Item = styled.button<{ $status: RoadmapStatus; $open: boolean }>`
  width: 100%;
  text-align: left;
  font: inherit;
  cursor: pointer;
  border-radius: 9px;
  padding: 11px 13px;
  transition: border-color 0.15s, background 0.15s;
  background: ${p => (p.$status === 'ahead' ? AHEAD_BG : `color-mix(in srgb, ${STATUS_COLOR[p.$status]} 9%, ${CARD_BG})`)};
  border: 1px solid ${p => (p.$open
    ? STATUS_COLOR[p.$status]
    : `color-mix(in srgb, ${STATUS_COLOR[p.$status]} 32%, transparent)`)};
  &:hover { border-color: ${p => STATUS_COLOR[p.$status]}; }
  &:focus-visible { outline: 2px solid ${VIOLET_D}; outline-offset: 2px; }
`;

export const ItemHead = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 9px;
`;

export const ItemGlyph = styled.span<{ $status: RoadmapStatus }>`
  font-size: 12px;
  line-height: 1.45;
  color: ${p => STATUS_COLOR[p.$status]};
  flex-shrink: 0;
`;

export const ItemTitle = styled.span<{ $status: RoadmapStatus }>`
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  color: ${p => (p.$status === 'ahead' ? line(0.62) : PLATINUM)};
`;

export const ItemBody = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.7;
  color: ${line(0.5)};
  padding: 9px 0 2px 21px;
`;

export const Empty = styled.div`
  font-size: 12px;
  color: ${line(0.18)};
  padding: 4px 0;
  @media (max-width: 820px) { display: none; }
`;

export const Footnote = styled.p`
  margin: 28px 0 0;
  font-size: 12px;
  line-height: 1.7;
  color: ${line(0.4)};
  a { color: ${VIOLET_D}; }
`;
