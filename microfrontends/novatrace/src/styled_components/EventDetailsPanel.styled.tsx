import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';

export const SidePanel = styled.div`
  position: fixed;
  inset: 2rem 0 2rem auto; /* top/bottom 8 (inset-y-8), right 0 */
  right: 0;
  width: 50%;
  z-index: 9999;
  background-color: ${p => getThemeValue(p.theme, 'background', '#fff')};
  border-left: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')};
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  /* Ensure text selection is allowed inside the panel even if parent disables it */
  -webkit-user-select: text;
  -moz-user-select: text;
  user-select: text;
`;

export const PanelContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${p => getThemeValue(p.theme, 'spacing.2', '1rem')};
  border-bottom: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')};
  border-top: 1px solid ${p => getThemeValue(p.theme, 'border', '#e5e7eb')};
  flex-shrink: 0;
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
`;

export const ContentInner = styled.div`
  padding: ${p => getThemeValue(p.theme, 'spacing.4', '1rem')};
  display: flex;
  flex-direction: column;
  gap: ${p => getThemeValue(p.theme, 'spacing.6', '1.5rem')};
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
  font-size: ${p => getThemeValue(p.theme, 'fontSize.sm', '0.875rem')};
`;

export const TextualMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => getThemeValue(p.theme, 'spacing.1', '0.25rem')};
`;

export const TextualSummary = styled.p`
  font-size: ${p => getThemeValue(p.theme, 'fontSize.sm', '0.875rem')};
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
