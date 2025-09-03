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
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const TitleWrap = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.2xl', '1.5rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  max-width: 42rem; /* max-w-2xl */
`;

export const RightBox = styled.div`
  margin-left: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
  width: 24rem; /* w-96 */
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const Dot = styled.div<{ color?: string }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: ${({ color }) => color || '#10b981'}; /* default green */
`;

