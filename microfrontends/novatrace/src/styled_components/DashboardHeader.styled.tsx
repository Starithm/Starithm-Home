import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';

export const HeaderWrapper = styled.div`
  background-color: ${({ theme }) => `${getThemeValue(theme, 'muted', '#f3f4f6')}80`};
`;

export const Inner = styled.div`
  padding: ${({ theme }) => `${getThemeValue(theme, 'spacing.4', '1rem')} ${getThemeValue(theme, 'spacing.6', '1.5rem')}`};
`;

export const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-4);
`;

export const TitleWrap = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  margin-top: var(--space-2);
  max-width: 42rem; /* max-w-2xl */
`;

export const RightBox = styled.div`
  margin-left: var(--space-8);
  width: 24rem; /* w-96 */
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

export const Dot = styled.div<{ color?: string }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: ${({ color }) => color || '#10b981'}; /* default green */
`;

