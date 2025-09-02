import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
export const NotFoundContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Content wrapper
export const NotFoundContent = styled.div`
  text-align: center;
`;

// Icon container
export const NotFoundIconContainer = styled.div`
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
`;

// Icon
export const NotFoundIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}4D;
  margin: 0 auto ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

// Title
export const NotFoundTitle = styled.h1`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.4xl', '2.25rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'starithmRichBlack', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

// Description
export const NotFoundDescription = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'starithmRichBlack', '#0E0B16')}B3;
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
`;

// Back link
export const NotFoundBackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  text-decoration: none;
  color: inherit;
`;
