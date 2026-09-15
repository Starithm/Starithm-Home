import styled from 'styled-components';
import { PAGE_MAX_WIDTH } from '@novatrace/lib/circularArchive';
import {
  Page as BasePage, Column as BaseColumn, HeaderRow as SharedHeaderRow,
  Title as BaseTitle, Subtitle as SharedResultCount, EmptyState as SharedEmptyState,
  Row as SharedRow, TabRow as SharedTabRow, Tab as SharedTab, Rule as SharedRule,
} from '@shared/components/ui/primitives';

/**
 * Circulars Archive — styling per design_handoff_gcn_archive.
 * Tokens come from lib/circularArchive.ts so `accent` stays themeable in one place.
 */

export const Page = styled(BasePage)`
  font-family: var(--font-mono);
`;

export const Column = styled(BaseColumn).attrs({ $maxWidth: PAGE_MAX_WIDTH })``;

export const HeaderRow = SharedHeaderRow;

export const PageTitle = BaseTitle;

export const ResultCount = SharedResultCount;

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
  background: var(--surface-raised);
  border: 1px solid var(--line-subtle);
  border-radius: 4px;
  font-size: 12.5px;
  font-family: inherit;
  padding: 7px 10px;
  outline: none;
  &:focus { border-color: var(--primary); }
`;

export const TextInput = styled.input<{ $w?: number }>`
  ${controlBase}
  width: ${p => p.$w ?? 120}px;
  color: var(--text-body);
  &::placeholder { color: var(--text-placeholder); }
`;

export const Select = styled.select`
  ${controlBase}
  padding: 7px 8px;
  color: var(--text-secondary);
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
  color: var(--text-faint);
  cursor: pointer;
  padding: 0;
  &:hover { color: var(--foreground); }
`;

export const TabRow = SharedTabRow;

export const Tab = SharedTab;

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
  color: var(--text-muted);
  white-space: nowrap;
`;

export const GroupRule = SharedRule;

export const GroupCount = styled.span`
  font-size: 11px;
  color: var(--text-faint);
  white-space: nowrap;
`;

export const Row = SharedRow;

export const RowTime = styled.span`
  width: 44px;
  flex: 0 0 44px;
  font-size: 12px;
  color: var(--text-muted);
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
  color: var(--text-body);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RowGcn = styled.span`
  font-size: 11.5px;
  color: var(--text-faint);
  white-space: nowrap;
`;

export const EmptyState = SharedEmptyState;

export const SkeletonRow = styled.div`
  height: 34px;
  border-radius: 5px;
  background: var(--surface-raised);
  opacity: 0.5;
`;

// ── Pagination ────────────────────────────────────────────────────────────────
export const Pagination = styled.div`
  border-top: 1px solid var(--line-hairline);
  padding-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

export const PageInfo = styled.span`
  font-size: 11.5px;
  color: var(--text-faint);
`;

export const PageButtons = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  background: ${p => (p.$active ? 'var(--accent-surface)' : 'transparent')};
  border: 1px solid ${p => (p.$active ? 'var(--accent-border)' : 'var(--line-subtle)')};
  border-radius: 4px;
  font-family: inherit;
  font-size: 11.5px;
  padding: 4px 9px;
  color: ${p => (p.$disabled ? 'var(--text-disabled)' : p.$active ? 'var(--accent-text)' : 'var(--text-muted)')};
  cursor: ${p => (p.$disabled ? 'default' : 'pointer')};
  &:hover { color: ${p => (p.$disabled ? 'var(--text-disabled)' : 'var(--foreground)')}; }
`;
