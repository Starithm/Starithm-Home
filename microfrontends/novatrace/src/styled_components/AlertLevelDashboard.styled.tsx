import styled from 'styled-components';

// Helper function to safely access theme properties
const getThemeValue = (theme: any, path: string, fallback: any) => {
  if (!theme) return fallback;
  const keys = path.split('.');
  let value = theme;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }
  return value || fallback;
};

// Main container
export const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

// Error container
export const ErrorContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Main content area
export const MainContent = styled.div`
  display: flex;
  height: calc(100vh - 150px);
  overflow: hidden;
`;
