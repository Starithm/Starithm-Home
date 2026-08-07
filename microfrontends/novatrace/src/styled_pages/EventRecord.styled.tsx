import styled, { css } from 'styled-components';

/* Standalone event record — scroll layout with a dividerless left rail.
 *
 * Built against the CURRENT public-event API only. The reference design also showed
 * conflict detection, record versioning + sha, DOI, and per-measurement provenance
 * quotes; none of those exist in the payload yet, so they are absent rather than faked.
 *
 * Colours are the Starithm palette (the reference already used it).
 */

const BG = '#0E0B16';
/* The design tints surfaces with alpha platinum over the page rather than filling
   them with a solid colour — so rows read as a lift off #0E0B16, not as a
   different (slightly violet) material. */
const SURFACE = 'rgba(231, 223, 221, 0.03)';
const SUNKEN = 'rgba(231, 223, 221, 0.05)';
const GOLD = 'var(--starithm-golden-yellow, #ffc332)';
/* Veronica, muted for this page: same hue as --starithm-veronica-dark (283.6°),
   saturation dropped 91% → 62%, lightness held at 63% so contrast on the near-black
   background doesn't fall with it. Local to the record page — the palette token
   itself is unchanged. */
const VERONICA_D = '#BB66DB';
const VIOLET_D = '#BB66DB'; // design uses veronica, not violet-dark
/* Gold tints the design uses for active/accent surfaces. */
const goldA = (a: number) => `rgba(255, 195, 50, ${a})`;

/* Extracted values. The ribbon down the left of each chip is the logo's outer arc:
   #9D5CFF at 0.42 — the same colour and opacity as the outermost ring in
   public/logo-mark.svg. Kept as rgba rather than a flat hex so it composites over
   whatever surface the chip sits on, exactly as the mark does. */
const ARC = (a: number) => `rgba(157, 92, 255, ${a})`;
const ARC_OUTER = ARC(0.42);
const PLATINUM = 'var(--starithm-platinum, #E7DFDD)';

const line = (a: number) => `rgba(231, 223, 221, ${a})`;

export const SIGNIFICANCE: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

const mono = css`
  font-family: 'Google Sans Code', ui-monospace, monospace;
`;

/* One knob for the whole record's type scale. The numbers passed to fs() are the
   design's original sizes; BUMP shifts every one of them together, so the
   hierarchy is set in one place instead of 45 declarations. */
const BUMP = 2;
const fs = (px: number) => `${px + BUMP}px`;

export const Page = styled.div`
  ${mono};
  background: ${BG};
  color: ${PLATINUM};
  min-height: 100vh;
`;

/* ── top bar ──────────────────────────────────────────────────────────── */

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 14px clamp(16px, 3vw, 30px);
  border-bottom: 1px solid ${line(0.1)};
  position: sticky;
  top: 0;
  z-index: 30;
  background: ${BG};
`;

export const Crumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: ${fs(11.5)};
  color: ${line(0.42)};
  a { color: inherit; text-decoration: none; }
  a:hover { color: ${PLATINUM}; }
  strong { color: ${PLATINUM}; font-weight: 600; }
`;

export const BrandMark = styled.img`
  width: 22px;
  height: 22px;
  display: block;
`;

export const TopActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const GhostButton = styled.button`
  ${mono};
  font-size: ${fs(10.5)};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: none;
  border: 1px solid ${line(0.18)};
  color: ${line(0.7)};
  padding: 6px 12px;
  border-radius: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  &:hover { border-color: ${line(0.4)}; color: ${PLATINUM}; }
`;

/* ── shell: rail + content ────────────────────────────────────────────── */

export const Shell = styled.div`
  display: grid;
  grid-template-columns: 196px minmax(0, 1fr);
  gap: clamp(14px, 1.6vw, 24px);
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(18px, 2vw, 26px) clamp(14px, 2vw, 22px) 96px;
  @media (max-width: 900px) { grid-template-columns: 1fr; gap: 18px; }
`;

/* No divider — the rail reads as margin, held by the active marker alone. */
export const Rail = styled.aside`
  position: sticky;
  top: 68px;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 2px;
  @media (max-width: 900px) {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
    padding-bottom: 6px;
  }
`;

export const RailHead = styled.div`
  font-size: ${fs(11)};
  padding-left: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${line(0.3)};
  padding: 0 0 9px;
  @media (max-width: 900px) { display: none; }
`;

export const RailLink = styled.button<{ $active: boolean }>`
  ${mono};
  position: relative;
  text-align: left;
  background: none;
  border: 0;
  cursor: pointer;
  padding: 6px 0 6px 11px;
  font-size: ${fs(13.5)};
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: ${p => (p.$active ? GOLD : line(0.4))};
  &:hover { color: ${PLATINUM}; }

  /* the marker replaces the divider line */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: ${p => (p.$active ? '14px' : '0')};
    background: ${GOLD};
    border-radius: 0;
    transition: height 0.15s;
  }
  @media (max-width: 900px) {
    padding: 5px 10px;
    border: 1px solid ${p => (p.$active ? goldA(0.5) : line(0.12))};
    background: ${p => (p.$active ? goldA(0.05) : 'transparent')};
    border-radius: 999px;
    &::before { display: none; }
  }
`;

export const RailCount = styled.span`
  margin-left: auto;
  font-size: ${fs(11)};
  color: ${line(0.28)};
  @media (max-width: 900px) { margin-left: 0; }
`;

/* Discussion prompt pinned to the foot of the rail — always in view, never over the
   data, so a 60-circular event doesn't bury it. It only *routes* to the discussion:
   composing happens in the section itself, not here. */
export const RailFoot = styled.div`
  margin-top: 22px;
  padding: 12px 0 0 12px;
  border-top: 1px solid ${line(0.08)};
  display: flex;
  flex-direction: column;
  gap: 8px;
  @media (max-width: 900px) {
    margin-top: 8px;
    padding: 10px 0 0;
    width: 100%;
  }
`;

export const RailFootHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: ${fs(11)};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${line(0.34)};
`;

export const RailPrompt = styled.button`
  font-family: inherit;
  text-align: left;
  background: none;
  border: 1px dashed ${line(0.16)};
  border-radius: 0;
  padding: 9px 10px;
  cursor: pointer;
  font-size: ${fs(12.5)};
  line-height: 1.5;
  color: ${line(0.45)};
  &:hover { border-color: ${line(0.34)}; color: ${PLATINUM}; }
  &:focus-visible { outline: 1px solid ${line(0.3)}; outline-offset: 2px; }
`;

export const RailPromptCta = styled.span`
  display: block;
  margin-top: 5px;
  color: ${VERONICA_D};
  font-size: ${fs(12)};
  letter-spacing: 0.06em;
`;

export const Content = styled.main`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(28px, 4vw, 44px);
`;

/* ── record header ────────────────────────────────────────────────────── */

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: ${fs(10.5)};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${line(0.4)};
`;

export const SigPill = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${p => p.$color};
  font-weight: 600;
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${p => p.$color};
  }
`;

export const Kind = styled.span`
  color: ${VERONICA_D};
  font-weight: 600;
`;

/* Redshift is the one extracted quantity that belongs in the record's masthead —
   it fixes the event in distance, and nothing else parsed from the Circulars
   does. Gold, and pill-shaped so it does not read as another active control. */
export const RedshiftPill = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${goldA(0.45)};
  background: ${goldA(0.08)};
  color: ${GOLD};
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: none;

  i {
    font-style: italic;
    opacity: 0.75;
  }
`;

/* Same value inside a circular's chip strip — same anatomy as ValueChip so the
   strip stays one system, with a gold bar and gold text marking it out from the
   values around it. */
export const RedshiftChip = styled.span`
  font-size: ${fs(10)};
  letter-spacing: 0.04em;
  padding: 5px 10px;
  background: ${goldA(0.07)};
  border: 1px solid ${goldA(0.28)};
  border-left: 3px solid ${GOLD};
  color: ${GOLD};
  white-space: nowrap;

  b {
    font-weight: 400;
    font-style: italic;
    color: inherit;
    &::after { content: '='; margin: 0 6px; font-style: normal; color: ${goldA(0.6)}; }
  }
`;

/* Disagreement between circulars is stated, never resolved away. */
export const RedshiftNote = styled.span`
  color: ${goldA(0.7)};
`;

export const Headline = styled.h1`
  margin: 14px 0 0;
  font-size: clamp(${fs(20)}, 2.6vw, ${fs(27)});
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: ${PLATINUM};
`;

export const SubMeta = styled.div`
  margin-top: 12px;
  font-size: ${fs(11.5)};
  line-height: 1.7;
  color: ${line(0.45)};
`;

/* ── generic section ──────────────────────────────────────────────────── */

export const Section = styled.section`
  scroll-margin-top: 76px;
`;

export const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
  padding-top: 16px;
  border-top: 1px solid ${line(0.12)};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${fs(10.5)};
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${GOLD};
`;

export const SectionNote = styled.span`
  font-size: ${fs(10)};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${line(0.3)};
`;

/* Not a box — content sits on the page, separated by a hairline above it. */
export const Card = styled.div`
  padding: 2px 0 0;
`;

export const Prose = styled.p`
  margin: 0;
  font-size: ${fs(13)};
  line-height: 1.85;
  color: ${line(0.72)};
  /* Italic marks the summary as model-written rather than reported text. */
  font-style: italic;
`;

/* ── position ─────────────────────────────────────────────────────────── */

/* Position and "how it narrowed" sit side by side, per the design's 1fr 1fr. */
export const PositionSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
  @media (max-width: 820px) { grid-template-columns: 1fr; gap: 20px; }
`;

/* Each half of the position split is its own bordered box —
   border: 1px solid rgba(231,223,221,.1); padding: 15px 17px. */
export const Panel = styled.div`
  border: 1px solid ${line(0.1)};
  padding: 15px 17px;
  display: flex;
  flex-direction: column;
  gap: 11px;
  min-width: 0;
`;

/* Footer line inside a panel, e.g. "tightest from …". */
export const PanelFoot = styled.div`
  padding-top: 11px;
  border-top: 1px solid ${line(0.08)};
  font-size: ${fs(11)};
  color: ${line(0.5)};
  overflow-wrap: anywhere;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 120px), 1fr));
  gap: 14px 18px;
`;

export const Field = styled.div`
  min-width: 0;
`;

export const FieldLabel = styled.div`
  font-size: ${fs(9.5)};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${line(0.32)};
  margin-bottom: 5px;
`;

export const FieldValue = styled.div`
  font-size: ${fs(13.5)};
  color: ${PLATINUM};
  word-break: break-word;
`;

export const FieldHint = styled.span`
  font-size: ${fs(11)};
  color: ${line(0.38)};
  margin-left: 6px;
`;

/* Error radius shrinking across notices — the record narrowing over time. */
export const NarrowRow = styled.div`
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 7px 0;
  font-size: ${fs(11.5)};
  border-top: 1px solid ${line(0.06)};
  &:first-of-type { border-top: 0; }
`;

export const NarrowBar = styled.div<{ $pct: number; $best?: boolean }>`
  height: 4px;
  border-radius: 0;
  background: ${line(0.08)};
  overflow: hidden;
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${p => Math.max(2, Math.min(100, p.$pct))}%;
    background: linear-gradient(90deg, rgba(141, 15, 245, 0.85), rgba(200, 75, 247, 0.55));
  }
`;

export const Muted = styled.span`
  color: ${line(0.4)};
`;

/* ── notices ──────────────────────────────────────────────────────────── */

export const Row = styled.button`
  ${mono};
  width: 100%;
  text-align: left;
  background: none;
  border: 0;
  padding: 13px 18px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  font-size: ${fs(11.5)};
  color: ${PLATINUM};
  &:hover { background: ${line(0.03)}; }
  &:focus-visible { outline: 1px solid ${line(0.3)}; outline-offset: -1px; }
  @media (max-width: 620px) { grid-template-columns: 1fr; gap: 4px; }
`;

/* The design wraps notices/circulars in a single bordered container; rows are
   separated by a hairline, not by gaps or per-row fills. */
export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${line(0.1)};
  > * { border-bottom: 1px solid ${line(0.06)}; }
  > *:last-child { border-bottom: 0; }
`;

export const Topic = styled.span`
  color: ${line(0.72)};
  overflow-wrap: anywhere;
`;

export const Phase = styled.span<{ $final?: boolean }>`
  font-size: ${fs(9.5)};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid ${p => (p.$final ? line(0.3) : line(0.14))};
  color: ${p => (p.$final ? PLATINUM : line(0.42))};
  white-space: nowrap;
`;

/* Hairline grid: the container tint shows through 1px gaps, and each cell repaints
   with the page colour. Without the cell background the tint washes the whole block. */
/* Notice payload as a plain two-column table: field, value.
   A grid forced every cell to one column width, so a long value (the LightCurve
   URL is ~120 chars) wrapped to nine lines and stretched its whole row. In a
   table the value column takes what it needs and only that row is tall. */
export const PayloadWrap = styled.div`
  max-height: 320px;
  overflow-y: auto;
  border-top: 1px solid ${line(0.06)};
  scrollbar-width: thin;
  scrollbar-color: ${line(0.18)} transparent;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: ${line(0.18)}; border-radius: 999px; }
`;

export const PayloadTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${fs(10.5)};

  td {
    padding: 4px 11px;
    vertical-align: top;
    border-bottom: 1px solid ${line(0.05)};
  }

  /* Field name: fixed, quiet, never wraps. */
  td:first-child {
    width: 34%;
    color: ${line(0.38)};
    white-space: nowrap;
  }

  /* Value: takes the rest and wraps only when it genuinely must. */
  td:last-child {
    color: ${PLATINUM};
    overflow-wrap: anywhere;
  }

  tr:last-child td { border-bottom: 0; }
  tr:hover td { background: ${line(0.025)}; }

  a { color: ${VERONICA_D}; }
`;


export const KV = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: baseline;
  background: ${BG};
  padding: 5px 11px;
  span:first-child { color: ${line(0.38)}; }
  span:last-child { color: ${PLATINUM}; text-align: right; overflow-wrap: anywhere; }
`;

/* ── circulars ────────────────────────────────────────────────────────── */

export const Tabs = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  ${mono};
  font-size: ${fs(10.5)};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 5px 11px;
  /* Square, like every other edge on this page — the rest of the record has no
     rounded corners. */
  border-radius: 0;
  cursor: pointer;
  background: ${p => (p.$active ? goldA(0.05) : 'transparent')};
  border: 1px solid ${p => (p.$active ? goldA(0.5) : line(0.12))};
  color: ${p => (p.$active ? GOLD : line(0.45))};
  &:hover { color: ${PLATINUM}; }
`;

/* Rows sit flush inside Stack with no gaps, so the open row is marked with an
   inset ring rather than a real border — a border would shift every row below it
   by a pixel on each expand. Gold is already this page's "you are here" (rail
   marker, active tabs). */
export const CircCard = styled.div<{ $open?: boolean }>`
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.15s;
  ${p => p.$open && css`
    box-shadow: inset 0 0 0 1px ${goldA(0.45)};
  `}
`;

export const CircHead = styled.button`
  ${mono};
  width: 100%;
  text-align: left;
  background: none;
  border: 0;
  cursor: pointer;
  padding: 13px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: ${PLATINUM};
  &:hover { background: ${line(0.03)}; }
  &:focus-visible { outline: 1px solid ${line(0.3)}; outline-offset: -1px; }
`;

export const CircTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: ${fs(11)};
  color: ${line(0.42)};
  strong { color: ${GOLD}; font-weight: 600; letter-spacing: 0.06em; }
`;

export const CircSummary = styled.div`
  font-size: ${fs(12.5)};
  line-height: 1.6;
  color: ${line(0.75)};
`;

export const Chip = styled.span`
  font-size: ${fs(9.5)};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid ${line(0.14)};
  color: ${line(0.5)};
  white-space: nowrap;
`;

export const CircBody = styled.div`
  border-top: 1px solid ${line(0.06)};
  padding: 14px 18px 16px;
  background: ${BG};
`;

export const ValueChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

/* Extracted values read as `key = value` in plain platinum, held in a neutral
   box with the logo's outer-arc violet as a ribbon down the left edge. The ribbon
   carries the "parsed from text" meaning; the value itself stays legible, which
   colouring the text never managed at this size. */
export const ValueChip = styled.span`
  font-size: ${fs(10)};
  letter-spacing: 0.04em;
  padding: 5px 10px;
  background: ${line(0.03)};
  border: 1px solid ${line(0.14)};
  border-left: 3px solid ${ARC_OUTER};
  color: ${PLATINUM};
  white-space: nowrap;

  b {
    font-weight: 400;
    color: inherit;
    &::after { content: '='; margin: 0 6px; color: ${line(0.45)}; }
  }
`;

export const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${line(0.1)};
  border-radius: 0;
  margin-bottom: 12px;
  scrollbar-width: thin;
  scrollbar-color: ${line(0.18)} transparent;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: ${line(0.18)}; border-radius: 999px; }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${fs(11.5)};
  th, td {
    padding: 7px 11px;
    text-align: left;
    white-space: nowrap;
    border-bottom: 1px solid ${line(0.06)};
  }
  th {
    font-size: ${fs(9.5)};
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${line(0.36)};
    background: ${line(0.03)};
  }
  td { color: ${line(0.78)}; }
  tr:last-child td { border-bottom: 0; }
`;

export const RawText = styled.pre`
  ${mono};
  margin: 0;
  font-size: ${fs(11.5)};
  line-height: 1.7;
  color: ${line(0.62)};
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 460px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${line(0.18)} transparent;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: ${line(0.18)}; border-radius: 999px; }
`;

export const InlineActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

export const Cite = styled.pre`
  ${mono};
  margin: 0;
  font-size: ${fs(11.5)};
  line-height: 1.7;
  color: ${line(0.72)};
  background: ${SUNKEN};
  border: 1px solid ${line(0.1)};
  border-radius: 0;
  padding: 14px 16px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: ${line(0.18)} transparent;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: ${line(0.18)}; border-radius: 999px; }
`;

export const Empty = styled.div`
  font-size: ${fs(12)};
  color: ${line(0.3)};
  padding: 10px 0;
`;


/* Figures ride with the item that published them. Sourced from data.urls / links
   with an image extension; absent when a circular carries none. */
export const Figures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr));
  gap: 8px;
  margin: 10px 0 12px;
`;

export const Figure = styled.a`
  display: block;
  border: 1px solid ${line(0.1)};
  background: ${SUNKEN};
  padding: 6px;
  img { display: block; width: 100%; height: auto; }
  figcaption {
    display: block;
    margin-top: 6px;
    font-size: ${fs(10)};
    color: ${line(0.35)};
    overflow-wrap: anywhere;
  }
  &:hover { border-color: ${line(0.3)}; }
`;


/* URLs — inline, comma separated, wrapping. Matches how circular links were
   presented before: a run of links, not a file table. */
export const UrlList = styled.div`
  font-size: ${fs(11.5)};
  line-height: 2;
  color: ${line(0.35)};
  overflow-wrap: anywhere;
`;

export const UrlLink = styled.a`
  color: ${VIOLET_D};
  text-decoration: none;
  &:hover { text-decoration: underline; color: ${VERONICA_D}; }
`;


/* "EXTRACTED" label above the parsed value chips. */
export const MiniLabel = styled.div`
  font-size: ${fs(9)};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${line(0.3)};
  margin-bottom: 7px;
`;


/* Collapsed circular row: id · facility · summary · tags · date */
export const CircGrid = styled.div`
  display: grid;
  grid-template-columns: 92px 128px minmax(0, 1fr) auto auto;
  gap: 14px;
  align-items: baseline;
  width: 100%;
  @media (max-width: 900px) {
    grid-template-columns: 92px minmax(0, 1fr);
    row-gap: 6px;
  }
`;

export const CircId = styled.span`
  color: ${VERONICA_D};
  font-size: ${fs(11.5)};
`;

export const CircFacility = styled.span`
  color: ${line(0.7)};
  font-size: ${fs(11.5)};
  overflow-wrap: anywhere;
`;

export const CircDate = styled.span`
  color: ${line(0.35)};
  font-size: ${fs(11)};
  white-space: nowrap;
`;

/* Table chip is gold and dashed — it points at rows, not a parsed scalar. */
export const TableChip = styled.span`
  font-size: ${fs(10)};
  letter-spacing: 0.04em;
  padding: 3px 7px;
  border: 1px dashed rgba(255, 195, 50, 0.5);
  color: ${GOLD};
  white-space: nowrap;
`;

export const MetaLine = styled.div`
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 14px;
  align-items: baseline;
  font-size: ${fs(11.5)};
  margin-top: 10px;
  color: ${line(0.65)};
  em { color: ${line(0.4)}; font-style: italic; }
`;

export const TableHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 12px;
  border: 1px solid ${line(0.1)};
  border-bottom: 0;
  font-size: ${fs(9.5)};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${line(0.4)};
`;

export const Disclaimer = styled.div`
  margin-top: 12px;
  font-size: ${fs(11)};
  color: ${line(0.3)};
`;


/* Localisation-vs-time chart: x = hours since T0, y = error radius (log). */
export const Chart = styled.svg`
  width: 100%;
  height: 168px;
  display: block;
  overflow: visible;
  .grid { stroke: ${line(0.07)}; stroke-width: 1; }
  .axis { fill: ${line(0.3)}; font-size: ${fs(8.5)}; letter-spacing: 0.06em; }
  .track { fill: none; stroke: rgba(200, 75, 247, 0.45); stroke-width: 1.5; }
  .dot { fill: rgba(141, 15, 245, 0.95); stroke: ${BG}; stroke-width: 1.5; }
  .dot--best { fill: ${GOLD}; }
  .lbl { fill: ${line(0.5)}; font-size: ${fs(8.5)}; }
`;
