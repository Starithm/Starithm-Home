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
export const RoadmapContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

// Header section
export const Header = styled.header`
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')} 0;
`;

export const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    padding: 0 ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  transition: opacity ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

  &:hover {
    opacity: 0.8;
  }
`;

export const HeaderCenter = styled.div`
  text-align: center;
`;

export const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.3xl', '1.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
`;

export const HeaderSubtitle = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')}CC;
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const HeaderSpacer = styled.div`
  width: 6rem;
`;

// Main content
export const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')} ${({ theme }) => getThemeValue(theme, 'spacing.12', '3rem')};

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    padding: 0 ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')} ${({ theme }) => getThemeValue(theme, 'spacing.12', '3rem')};
  }
`;

// Overview section
export const OverviewSection = styled.div`
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.12', '3rem')};
`;

export const OverviewTitle = styled.h2`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.2xl', '1.5rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
`;

export const OverviewGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.md', '768px')}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const OverviewCard = styled.div`
  background-color: ${({ theme }) => getThemeValue(theme, 'card', 'white')};
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  box-shadow: ${({ theme }) => getThemeValue(theme, 'shadows.lg', '0 10px 15px -3px rgba(0, 0, 0, 0.1)')};
  transition: box-shadow ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

  &:hover {
    box-shadow: ${({ theme }) => getThemeValue(theme, 'shadows.xl', '0 20px 25px -5px rgba(0, 0, 0, 0.1)')};
  }
`;

export const OverviewCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const OverviewCardIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'primary', '#770ff5')};
`;

export const OverviewCardTitle = styled.h3`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.semibold', 600)};
  color: ${({ theme }) => getThemeValue(theme, 'cardForeground', '#0E0B16')};
`;

export const OverviewCardValue = styled.div<{ color?: string }>`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.2xl', '1.5rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme, color }) => color || getThemeValue(theme, 'primary', '#770ff5')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.25rem')};
`;

export const OverviewCardDescription = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

// Roadmap items section
export const RoadmapItemsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
`;

export const RoadmapSection = styled.section``;

export const RoadmapSectionTitle = styled.h3`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xl', '1.25rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const RoadmapSectionIcon = styled.div<{ color?: string }>`
  color: ${({ color, theme }) => color || getThemeValue(theme, 'primary', '#770ff5')};
`;

export const RoadmapItemsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
`;

// Individual roadmap item
export const RoadmapItemContainer = styled.div`
  background-color: ${({ theme }) => getThemeValue(theme, 'card', 'white')};
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  box-shadow: ${({ theme }) => getThemeValue(theme, 'shadows.lg', '0 10px 15px -3px rgba(0, 0, 0, 0.1)')};
  transition: all ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};
  transform: translateY(0);

  &:hover {
    box-shadow: ${({ theme }) => getThemeValue(theme, 'shadows.xl', '0 20px 25px -5px rgba(0, 0, 0, 0.1)')};
    transform: translateY(-4px);
  }
`;

export const RoadmapItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const RoadmapItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
`;

export const RoadmapItemStatusIcon = styled.div<{ color?: string }>`
  color: ${({ color, theme }) => color || getThemeValue(theme, 'primary', '#770ff5')};
`;

export const RoadmapItemTitle = styled.h4`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.semibold', 600)};
  color: ${({ theme }) => getThemeValue(theme, 'cardForeground', '#0E0B16')};
`;

export const RoadmapItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const RoadmapItemCategoryIcon = styled.div<{ color?: string }>`
  color: ${({ color, theme }) => color || getThemeValue(theme, `${color}`, '#770ff5')};
`;

export const RoadmapItemDescription = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const RoadmapItemFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RoadmapItemStatus = styled.span<{ 
  status: 'completed' | 'in-progress' | 'planned';
}>`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.25rem')} ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
  border-radius: 9999px;
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  border: 1px solid;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'completed':
        return `
          background-color: #10b9811A;
          color: #10b981;
          border-color: #10b98133;
        `;
      case 'in-progress':
        return `
          background-color: #3b82f61A;
          color: #3b82f6;
          border-color: #3b82f633;
        `;
      case 'planned':
        return `
          background-color: ${getThemeValue(theme, 'muted', '#f3f4f6')};
          color: ${getThemeValue(theme, 'mutedForeground', '#6b7280')};
          border-color: ${getThemeValue(theme, 'border', '#d1d5db')};
        `;
      default:
        return '';
    }
  }}
`;
