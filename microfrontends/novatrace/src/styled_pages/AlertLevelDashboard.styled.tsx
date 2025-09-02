import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';

// Main container
export const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;