import styled from 'styled-components';
import { T, PAGE_MAX_WIDTH } from '@novatrace/lib/circularArchive';

/**
 * Circulars Archive — styling per design_handoff_gcn_archive.
 * Tokens come from lib/circularArchive.ts so `accent` stays themeable in one place.
 */

export const Page = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  color: ${T.text};
  font-family: 'JetBrains Mono', ui-monospace, monospace;
`;

export const Column = styled.div`
  max-width: ${PAGE_MAX_WIDTH}px;
  margin: 0 auto;
  padding: 48px 24px 96px;
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
`;

export const PageTitle = styled.h1`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${T.muted};
  margin: 0;
`;

export const ResultCount = styled.span`
  font-size: 12px;
  color: ${T.faint};
`;

// ── Filters ───────────────────────────────────────────────────────────────────
export const FilterBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const controlBase = `
  background: ${T.raised};
  border: 1px solid ${T.subtle};
  border-radius: 4px;
  font-size: 12.5px;
  font-family: inherit;
  padding: 7px 10px;
  outline: none;
  &:focus { border-color: ${T.accent}; }
`;

export const TextInput = styled.input<{ $w?: number }>`
  ${controlBase}
  width: ${p => p.$w ?? 120}px;
  color: ${T.body};
  &::placeholder { color: ${T.placeholder}; }
`;

export const Select = styled.select`
  ${controlBase}
  padding: 7px 8px;
  color: ${T.secondary};
  cursor: pointer;
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const ClearButton = styled.button`
  background: none;
  border: none;
  font-family: inherit;
  font-size: 12px;
  color: ${T.faint};
  cursor: pointer;
  padding: 0;
  &:hover { color: ${T.text}; }
`;

export const TabRow = styled.div`
  display: flex;
  border-bottom: 1px solid ${T.hairline};
`;

export const Tab = styled.button<{ $active: boolean }>`
  background: transparent;
  border: none;
  border-bottom: 1px solid ${p => (p.$active ? T.accent : 'transparent')};
  margin-bottom: -1px;
  font-family: inherit;
  font-size: 12px;
  padding: 7px 10px;
  cursor: pointer;
  color: ${p => (p.$active ? T.text : T.muted)};
  &:hover { color: ${T.text}; }
`;

// ── List ──────────────────────────────────────────────────────────────────────
export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
`;

export const GroupDate = styled.span`
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${T.muted};
  white-space: nowrap;
`;

export const GroupRule = styled.div`
  flex: 1;
  height: 1px;
  background: ${T.hairline};
`;

export const GroupCount = styled.span`
  font-size: 11px;
  color: ${T.faint};
  white-space: nowrap;
`;

export const Row = styled.div`
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 9px 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover { background: ${T.rowHover}; }
`;

export const RowTime = styled.span`
  width: 44px;
  flex: 0 0 44px;
  font-size: 12px;
  color: ${T.muted};
`;

export const RowType = styled.span<{ $color: string }>`
  width: 32px;
  flex: 0 0 32px;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: ${p => p.$color};
`;

export const RowSubject = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: ${T.body};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RowGcn = styled.span`
  font-size: 11.5px;
  color: ${T.faint};
  white-space: nowrap;
`;

export const EmptyState = styled.div`
  text-align: center;
  color: ${T.muted};
  padding: 56px 0;
  font-size: 12.5px;
`;

export const SkeletonRow = styled.div`
  height: 34px;
  border-radius: 5px;
  background: ${T.raised};
  opacity: 0.5;
`;

// ── Pagination ────────────────────────────────────────────────────────────────
export const Pagination = styled.div`
  border-top: 1px solid ${T.hairline};
  padding-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

export const PageInfo = styled.span`
  font-size: 11.5px;
  color: ${T.faint};
`;

export const PageButtons = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  background: ${p => (p.$active ? T.accentSurface : 'transparent')};
  border: 1px solid ${p => (p.$active ? T.accentBorder : T.subtle)};
  border-radius: 4px;
  font-family: inherit;
  font-size: 11.5px;
  padding: 4px 9px;
  color: ${p => (p.$disabled ? T.disabled : p.$active ? T.accentText : T.muted)};
  cursor: ${p => (p.$disabled ? 'default' : 'pointer')};
  &:hover { color: ${p => (p.$disabled ? T.disabled : T.text)}; }
`;
