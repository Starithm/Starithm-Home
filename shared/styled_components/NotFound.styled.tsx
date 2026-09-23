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
  margin-bottom: var(--space-8);
`;

// Icon
export const NotFoundIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')}4D;
  margin: 0 auto var(--space-4);
`;

// Title
export const NotFoundTitle = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: ${({ theme }) => getThemeValue(theme, 'starithmRichBlack', '#0E0B16')};
  margin-bottom: var(--space-4);
`;

// Description
export const NotFoundDescription = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'starithmRichBlack', '#0E0B16')}B3;
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-8);
`;

// Back link
export const NotFoundBackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  color: inherit;
`;
