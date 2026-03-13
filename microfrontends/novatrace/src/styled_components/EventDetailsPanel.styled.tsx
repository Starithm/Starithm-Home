import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';

export const SidePanel = styled.div`
  position: fixed;
  inset: 1rem 0 1rem auto;
  right: 0;
  width: 50%;
  z-index: 9999;
  background-color: ${p => getThemeValue(p.theme, 'background', '#fff')};
  border: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')};
  border-right: none;
  border-radius: 1rem 0 0 1rem;
  box-shadow: -8px 0 40px -4px rgba(0,0,0,0.4);
  -webkit-user-select: text;
  -moz-user-select: text;
  user-select: text;
`;

export const OverviewSectionCard = styled.div`
  border: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')}80;
  border-radius: 0.625rem;
  overflow: hidden;
  background-color: ${p => `${getThemeValue(p.theme, 'muted', '#f3f4f6')}30`};
`;

export const OverviewSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem 0.625rem;
  border-bottom: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')};
`;

export const OverviewSectionTitle = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${p => getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
`;

export const OverviewSectionBody = styled.div`
  padding: 1.125rem 1rem 1.125rem;
`;

export const IdentityCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')};
  border-radius: 0.5rem;
  background-color: ${p => `${getThemeValue(p.theme, 'muted', '#f3f4f6')}20`};
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem 2rem;
`;

export const FieldItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const FieldLabel = styled.div`
  font-size: 0.7rem;
  color: ${p => getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
`;

export const FieldValue = styled.div`
  font-size: 0.875rem;
`;

export const TabBarContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  gap: 0.375rem;
  border-bottom: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')}40;
  background-color: ${p => `${getThemeValue(p.theme, 'muted', '#f3f4f6')}20`};
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.4rem 0;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid ${p => p.$active
    ? getThemeValue(p.theme, 'starithmSelectiveYellow', '#FFB400')
    : 'transparent'};
  border-radius: 9999px;
  color: ${p => p.$active
    ? getThemeValue(p.theme, 'starithmSelectiveYellow', '#FFB400')
    : getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
  background-color: ${p => p.$active
    ? `${getThemeValue(p.theme, 'starithmSelectiveYellow', '#FFB400')}18`
    : 'transparent'};
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s;
  &:hover {
    color: ${p => getThemeValue(p.theme, 'foreground', '#111')};
    background-color: ${p => `${getThemeValue(p.theme, 'muted', '#f3f4f6')}40`};
  }
`;

export const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')};
  font-size: 0.875rem;
  text-decoration: none;
  color: ${p => getThemeValue(p.theme, 'foreground', '#111')};
  transition: background-color 0.15s;
  &:hover {
    background-color: ${p => `${getThemeValue(p.theme, 'muted', '#f3f4f6')}60`};
  }
`;

export const PanelContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.875rem;
  border-bottom: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')}40;
  flex-shrink: 0;
`;

export const PanelHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const PanelTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

export const PanelSubtitle = styled.div`
  font-size: 0.75rem;
  color: ${p => getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
`;

export const EventIdentitySection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')}40;
  flex-shrink: 0;
`;

export const EventIdentityLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
`;

export const EventIdentityName = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  word-break: break-all;
`;

export const EventIdentityMeta = styled.div`
  font-size: 0.8125rem;
  color: ${p => getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
`;

export const EventIdentityRight = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

export const EventIdentityTime = styled.div`
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const EventIdentityDate = styled.div`
  font-size: 0.8125rem;
  color: ${p => getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
`;

export const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => getThemeValue(p.theme, 'spacing.3', '0.75rem')};
  font-weight: ${p => getThemeValue(p.theme, 'fontWeight.medium', 500)};
`;

export const ContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: ${p => getThemeValue(p.theme, 'border', '#e5e7eb')}60 transparent;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${p => getThemeValue(p.theme, 'border', '#e5e7eb')}50;
    border-radius: 9999px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${p => getThemeValue(p.theme, 'border', '#e5e7eb')}90;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

export const ContentInner = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${p => getThemeValue(p.theme, 'spacing.4', '1rem')};
  padding: ${p => getThemeValue(p.theme, 'spacing.4', '1rem')};
  background-color: ${p => `${getThemeValue(p.theme, 'muted', '#f3f4f6')}80`};
  border-radius: 0.5rem;
`;

export const StatBox = styled.div`
  text-align: center;
`;

export const StatNumber = styled.div`
  font-size: ${p => getThemeValue(p.theme, 'fontSize.2xl', '1.5rem')};
  font-weight: ${p => getThemeValue(p.theme, 'fontWeight.bold', 700)};
  color: ${p => getThemeValue(p.theme, 'secondary', '#A239CA')};
`;

export const StatLabel = styled.div`
  font-size: ${p => getThemeValue(p.theme, 'fontSize.sm', '0.875rem')};
  color: ${p => getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${p => getThemeValue(p.theme, 'spacing.4', '1rem')};
`;

export const ImageItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${p => getThemeValue(p.theme, 'spacing.4', '1rem')};
`;

export const SkymapImage = styled.img`
  width: 100%;
  max-width: 32rem; /* max-w-md */
  border-radius: 0.5rem;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 80rem; /* max-w-7xl */
  height: 90vh;
  background-color: ${p => getThemeValue(p.theme, 'background', '#fff')};
  border: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')};
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  z-index: 10001;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${p => getThemeValue(p.theme, 'spacing.4', '1rem')};
  border-bottom: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')};
  flex-shrink: 0;
`;

export const ModalContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const TextualContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${p => getThemeValue(p.theme, 'spacing.2', '0.5rem')};
`;

export const TextualMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => getThemeValue(p.theme, 'spacing.4', '1rem')};
  font-size: 0.7rem;
`;

export const TextualMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => getThemeValue(p.theme, 'spacing.1', '0.25rem')};
`;

export const TextualSummary = styled.p`
  font-size: 0.7rem;
  color: ${p => getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
`;

// Timeline list and items
export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${p => getThemeValue(p.theme, 'spacing.4', '1rem')};
`;

export const TimelineItemCard = styled.div`
  border-left: 3px solid ${p => getThemeValue(p.theme, 'secondary', '#A239CA')};
  border-radius: 0.5rem;
  background-color: ${p => getThemeValue(p.theme, 'card', '#ffffff')};
`;

export const TimelineItemContent = styled.div`
  padding: ${p => getThemeValue(p.theme, 'spacing.4', '1rem')};
`;

export const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${p => getThemeValue(p.theme, 'spacing.3', '0.75rem')};
`;

export const IndicatorCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const IndicatorDot = styled.div`
  width: 0.75rem; /* w-3 */
  height: 0.75rem;
  border-radius: 9999px;
  background-color: ${p => getThemeValue(p.theme, 'starithmSelectiveYellow', '#FFB400')};
`;

export const IndicatorConnector = styled.div`
  width: 2px; /* w-0.5 */
  height: 2rem; /* h-8 */
  background-color: ${p => getThemeValue(p.theme, 'border', '#e5e7eb')};
  margin-top: 0.25rem; /* mt-1 */
`;

export const ItemContent = styled.div`
  flex: 1;
`;

export const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${p => getThemeValue(p.theme, 'spacing.2', '0.5rem')};
`;

export const ItemHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => getThemeValue(p.theme, 'spacing.2', '0.5rem')};
  font-weight: ${p => getThemeValue(p.theme, 'fontWeight.medium', 500)};
`;

export const ItemTimestamp = styled.div`
  font-size: ${p => getThemeValue(p.theme, 'fontSize.sm', '0.875rem')};
  color: ${p => getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
`;

export const StreamContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${p => getThemeValue(p.theme, 'spacing.2', '0.5rem')};
`;
