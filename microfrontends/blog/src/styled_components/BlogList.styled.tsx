import styled from 'styled-components';
import { Link } from 'react-router-dom';

/* Blog index — design 4A.
 *
 * A dense, typographic index rather than a card grid: one row per piece, with
 * the metadata that piece actually carries (significance and alert counts for
 * event reports, authors and arXiv id for paper summaries). Two filter axes
 * sit above the list — type of writing, and science category.
 *
 * Palette is fixed rather than themed: the page is its own dark canvas, a
 * shade below the shell chrome.
 */
const C = {
  page: '#07060A',
  featured: '#0F0918',
  featuredBorder: '#2A1B3E',
  rowHover: '#0E0B16',
  rule: '#1B1626',
  hairline: '#16121F',
  chipBorder: '#251F33',
  accent: '#8D0FF5',
  ink: '#F2EFF7',
  rowInk: '#EDEAF2',
  body: '#9A93AC',
  muted: '#8B8499',
  dim: '#7A7390',
  dimmer: '#6E6880',
  label: '#5F5975',
  faint: '#4E4863',
  disabled: '#332C44',
};

/* The mock was drawn in JetBrains Mono; the site ships Google Sans Code, so the
 * blog stays on the site's own mono rather than pulling a second webfont. */
export const MONO = '"Google Sans Code", ui-monospace, SFMono-Regular, Menlo, monospace';

export const BlogContainer = styled.div`
  min-height: 100vh;
  background: ${C.page};
  color: ${C.ink};
  font-family: ${MONO};

  /* The shell wraps microfrontends in 2rem of padding; bleed the canvas back
     out to the window edges so the page reads as one surface. */
  box-shadow: 0 0 0 100vmax ${C.page};
  clip-path: inset(0 -100vmax);
`;

export const Page = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 56px 32px 72px;

  @media (max-width: 720px) {
    padding: 36px 20px 56px;
  }
`;

/* ---- masthead ---- */

export const Masthead = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid ${C.rule};

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

export const MastheadText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Eyebrow = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${C.accent};
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: ${C.ink};

  @media (max-width: 720px) {
    font-size: 32px;
  }
`;

export const Standfirst = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.65;
  color: ${C.muted};
  max-width: 62ch;
  text-wrap: pretty;
`;

export const FeedLink = styled.a`
  flex-shrink: 0;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: ${C.muted};
  border: 1px solid ${C.chipBorder};
  border-radius: 8px;
  padding: 9px 14px;
  text-decoration: none;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: ${C.accent};
    color: ${C.ink};
  }
`;

/* ---- pinned roadmap ---- */

export const Featured = styled(Link)`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 40px;
  align-items: end;
  margin-top: 28px;
  padding: 28px 30px;
  border: 1px solid ${C.featuredBorder};
  border-radius: 14px;
  background: ${C.featured};
  text-decoration: none;
  transform-style: preserve-3d;
  will-change: transform;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${C.accent};
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 24px 22px;
  }
`;

export const FeaturedBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

export const FeaturedKicker = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const FeaturedTag = styled.span`
  color: ${C.page};
  background: ${C.accent};
  padding: 4px 9px;
  border-radius: 4px;
  font-weight: 700;
`;

export const FeaturedMeta = styled.span`
  color: ${C.dim};
`;

export const FeaturedTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: ${C.ink};
`;

export const FeaturedExcerpt = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: ${C.body};
  max-width: 72ch;
  text-wrap: pretty;
`;

export const FeaturedCta = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${C.page};
  background: ${C.accent};
  padding: 12px 18px;
  border-radius: 9px;
  white-space: nowrap;
  justify-self: start;
`;

/* ---- filters ---- */

export const Filters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 30px 0 6px;
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterLabel = styled.span`
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${C.label};
  width: 62px;
  flex-shrink: 0;
`;

export const Chip = styled.button<{ $on?: boolean; $hue?: string }>`
  font-family: ${MONO};
  font-size: 12px;
  letter-spacing: 0.04em;
  padding: 8px 13px;
  border-radius: 7px;
  cursor: pointer;
  border: 1px solid ${({ $on, $hue }) => ($on ? $hue || C.accent : C.chipBorder)};
  color: ${({ $on }) => ($on ? C.ink : C.muted)};
  background: ${({ $on }) => ($on ? 'rgba(141, 15, 245, 0.15)' : 'transparent')};
  transition: border-color 0.15s, color 0.15s, background 0.15s;

  &:hover {
    color: ${C.ink};
    border-color: ${({ $on, $hue }) => ($on ? $hue || C.accent : '#3A3050')};
  }
`;

export const ChipCount = styled.span`
  opacity: 0.5;
`;

/* ---- the index itself ---- */

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 18px;
`;

export const Row = styled(Link)`
  display: grid;
  grid-template-columns: 76px 3px 1fr 240px;
  align-items: start;
  gap: 22px;
  border-top: 1px solid ${C.hairline};
  padding: 20px 8px 20px 0;
  color: inherit;
  text-decoration: none;
  transition: background 0.15s;

  &:hover {
    background: ${C.rowHover};
  }

  @media (max-width: 1024px) {
    grid-template-columns: 68px 3px 1fr;
    gap: 18px;
  }

  @media (max-width: 620px) {
    grid-template-columns: 3px 1fr;
    gap: 14px;
  }
`;

export const RowDate = styled.span`
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 2px;
  font-size: 13px;
  color: ${C.muted};
  letter-spacing: 0.03em;

  small {
    font-size: 11px;
    color: ${C.dimmer};
  }

  @media (max-width: 620px) {
    grid-column: 2;
    flex-direction: row;
    align-items: baseline;
    gap: 6px;
    padding-top: 0;
  }
`;

export const RowSpine = styled.span<{ $hue: string }>`
  align-self: stretch;
  border-radius: 2px;
  background: ${({ $hue }) => $hue};

  @media (max-width: 620px) {
    grid-row: 1 / span 3;
    grid-column: 1;
  }
`;

export const RowBody = styled.span`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  @media (max-width: 620px) {
    grid-column: 2;
  }
`;

export const RowKicker = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const RowKind = styled.span<{ $hue: string }>`
  color: ${({ $hue }) => $hue};
`;

export const RowCategory = styled.span<{ $hue: string }>`
  color: ${({ $hue }) => $hue};
`;

export const RowTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: ${C.rowInk};
`;

export const RowExcerpt = styled.span`
  font-size: 13px;
  line-height: 1.65;
  color: ${C.dim};
  max-width: 78ch;
  text-wrap: pretty;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const RowMeta = styled.span`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-end;
  padding-top: 2px;

  @media (max-width: 1024px) {
    grid-column: 3;
    flex-direction: row;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 6px 16px;
    padding-top: 2px;
  }

  @media (max-width: 620px) {
    grid-column: 2;
  }
`;

export const RowMetaItem = styled.span<{ $hue: string }>`
  font-size: 11px;
  letter-spacing: 0.05em;
  text-align: right;
  color: ${({ $hue }) => $hue};

  @media (max-width: 1024px) {
    text-align: left;
  }
`;

export const RowRead = styled.span`
  font-size: 11px;
  color: ${C.dimmer};
  padding-top: 3px;

  @media (max-width: 1024px) {
    padding-top: 0;
  }
`;

export const EmptyState = styled.p`
  padding: 48px 0;
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.04em;
  color: ${C.dimmer};
`;

/* ---- pagination ---- */

export const Pager = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 26px;
  border-top: 1px solid ${C.rule};
`;

export const PagerRange = styled.span`
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${C.faint};
`;

export const PagerButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 7px;
`;

export const PagerButton = styled.button<{ $on?: boolean }>`
  font-family: ${MONO};
  font-size: 13px;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid ${({ $on }) => ($on ? C.accent : C.chipBorder)};
  color: ${({ $on }) => ($on ? C.ink : C.muted)};
  background: ${({ $on }) => ($on ? C.accent : 'transparent')};
  transition: border-color 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    border-color: ${C.accent};
  }

  &:disabled {
    color: ${C.disabled};
    cursor: default;
  }
`;
