import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';
import { Card, CardContent, CardHeader } from '@shared/components/ui/card';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  background-color: ${({ theme }) => `${getThemeValue(theme, 'background', '#fff')}80`};
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  width: 100%;
  max-width: 80rem; /* max-w-7xl */
  height: 90vh;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', '#fff')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  padding: var(--space-6);
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const HeaderContainer = styled.div`
  flex-shrink: 0;
  margin-bottom: var(--space-4);
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
`;

export const Subtitle = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  margin-top: var(--space-2);
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
`;

export const LeftPanel = styled.div`
  width: 33.3333%;
  border-right: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const TimelineCard = styled(Card)`
  height: 100%;
  border-radius: 0;
  border: 0;
  display: flex;
  flex-direction: column;
`;

export const TimelineHeader = styled(CardHeader)`
  flex-shrink: 0;
`;

export const TimelineContent = styled(CardContent)`
  padding: 0;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}60 transparent;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}50;
    border-radius: 9999px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}90;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

export const TimelineInner = styled.div`
  position: relative;
  padding: var(--space-4);
`;

export const TimelineLine = styled.div`
  position: absolute;
  left: 1rem; /* left-4 */
  top: 0;
  bottom: 0;
  width: 2px; /* w-0.5 */
  background-color: ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

export const TimelineItemRow = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
`;

export const TimelineDot = styled.div<{ isCurrent?: boolean }>`
  position: absolute;
  left: 0.75rem; /* left-3 */
  width: 0.75rem; /* w-3 */
  height: 0.75rem; /* h-3 */
  border-radius: 9999px;
  border: 2px solid #ffffff;
  background-color: ${({ isCurrent, theme }) =>
    isCurrent
      ? getThemeValue(theme, 'primary', '#8D0FF5')
      : getThemeValue(theme, 'muted', '#f3f4f6')};
`;

export const TimelineEntry = styled.div<{ selected?: boolean }>`
  margin-left: 2rem; /* ml-8 */
  flex: 1;
  background-color: ${({ theme }) => `${getThemeValue(theme, 'muted', '#f3f4f6')}80`};
  border-radius: 0.5rem;
  padding: var(--space-3);
  transition: background-color var(--transition-normal);
  cursor: pointer;
  border: ${({ selected, theme }) => (selected ? `1px solid ${getThemeValue(theme, 'primary', '#8D0FF5')}` : 'none')};
  background-clip: padding-box;
  background-color: ${({ selected, theme }) =>
    selected
      ? `${getThemeValue(theme, 'primary', '#8D0FF5')}0D`
      : `${getThemeValue(theme, 'muted', '#f3f4f6')}80`};

  &:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')};
  }
`;

export const RightPanel = styled.div`
  width: 66.6667%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}60 transparent;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}50;
    border-radius: 9999px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}90;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

export const TimelineEmpty = styled.div`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  margin-left: 2rem; /* ml-8 */
`;

