import styled from 'styled-components';

/**
 * Shared layout primitives — design-library step 3.
 *
 * These exist because the same handful of shapes were being redrawn in every package:
 * `Page` was defined 6 separate times across the repo, `HeaderRow` 5, `Title` and `Row`
 * 4 each, and `Overlay` / `Body` / `EmptyState` / `Section` / `Tab` / `TableWrap` 2–3 each
 * (measured 2026-09-11 across 660 `styled.*` declarations). Every copy drifted slightly.
 *
 * Rules for anything added here:
 *   - Colour, spacing and radius come from CSS custom properties in
 *     `shared/styles/globals.css`. Never a raw hex — `npm run check:no-raw-hex` enforces it.
 *   - Keep them unopinionated. A primitive sets structure; pages layer specifics on top
 *     via styled(Primitive)`…`, which is why each is a styled-component and not a
 *     prop-configured React component.
 *   - Only promote a shape once it genuinely repeats. This file is not a component museum;
 *     the last `ui/` library in this repo reached 52 modules of which 39 had no consumer.
 */

/** Full-viewport page ground. Sets the theme colours so children inherit them. */
export const Page = styled.div`
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
`;

/** Centred reading column. Width is a prop so dense tables can run wider than prose. */
export const Column = styled.div<{ $maxWidth?: number }>`
  max-width: ${p => p.$maxWidth ?? 1240}px;
  margin: 0 auto;
  padding: 48px 24px 96px;
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

/** Title on the left, count/actions on the right; wraps rather than squashing on mobile. */
export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
`;

/** Small-caps section/page label. Deliberately not an <h1> size — these pages are tools. */
export const Title = styled.h1`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0;
  text-wrap: balance;
`;

export const Subtitle = styled.span`
  font-size: 12px;
  color: var(--text-faint);
`;

/** Uppercase micro-label above a block of content. */
export const Eyebrow = styled.span`
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/** One clickable record in a list. `$interactive={false}` for read-only rows. */
export const Row = styled.div<{ $interactive?: boolean }>`
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 9px 10px;
  border-radius: 5px;
  cursor: ${p => (p.$interactive === false ? 'default' : 'pointer')};
  &:hover {
    background: ${p => (p.$interactive === false ? 'transparent' : 'var(--row-hover)')};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  color: var(--text-muted);
  padding: 56px 0;
  font-size: 12.5px;
`;

/** Modal scrim. Pages own the dialog itself; this is just the backdrop + centring. */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--surface-sunken) 82%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  z-index: 50;
`;

/**
 * Horizontal scroll container for wide content.
 * Wide tables must scroll inside their own box — never let the page body scroll sideways.
 */
export const TableWrap = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;

export const TabRow = styled.div`
  display: flex;
  border-bottom: 1px solid var(--line-hairline);
`;

export const Tab = styled.button<{ $active?: boolean }>`
  background: transparent;
  border: none;
  border-bottom: 1px solid ${p => (p.$active ? 'var(--primary)' : 'transparent')};
  margin-bottom: -1px;
  font-family: inherit;
  font-size: 12px;
  padding: 7px 10px;
  cursor: pointer;
  color: ${p => (p.$active ? 'var(--foreground)' : 'var(--text-muted)')};
  &:hover { color: var(--foreground); }
  &:focus-visible { outline: 2px solid var(--primary); outline-offset: -2px; }
`;

/** Hairline divider that fills remaining space next to a label. */
export const Rule = styled.div`
  flex: 1;
  height: 1px;
  background: var(--line-hairline);
`;
