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
export const BlogContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

// Header section
export const Header = styled.header`
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.12', '3rem')} 0;
`;

export const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  text-align: center;

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    padding: 0 ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
  }
`;

export const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.4xl', '2.25rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const HeaderSubtitle = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xl', '1.25rem')};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')}CC;
  max-width: 42rem;
  margin: 0 auto;
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

// Featured post section
export const FeaturedPostSection = styled.div`
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.12', '3rem')};
`;

export const FeaturedPostCard = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => getThemeValue(theme, 'primary', '#770ff5')}0D,
    ${({ theme }) => getThemeValue(theme, 'secondary', '#C84BF7')}0D
  );
  border-radius: 1rem;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const CategoryBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const CategoryIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'secondaryForeground', '#770ff5')};
`;

export const CategoryText = styled.span`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  color: ${({ theme }) => getThemeValue(theme, 'secondaryForeground', '#770ff5')};
`;

export const FeaturedPostTitle = styled.h3`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.2xl', '1.5rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const FeaturedPostExcerpt = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeight.relaxed', 1.625)};
`;

export const FeaturedPostFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.25rem')};
`;

export const MetaIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

// Blog post card (for future use)
export const BlogPostCardContainer = styled.article`
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  transition: box-shadow ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

  &:hover {
    box-shadow: ${({ theme }) => getThemeValue(theme, 'shadows.md', '0 4px 6px -1px rgba(0, 0, 0, 0.1)')};
  }
`;

export const PostCardCategory = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const PostCardCategoryText = styled.span`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
`;

export const PostCardTitle = styled.h3`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xl', '1.25rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
`;

export const PostCardExcerpt = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeight.relaxed', 1.625)};
`;

export const PostCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PostCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
`;

export const PostCardMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.25rem')};
`;

export const PostCardMetaIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
`;

export const PostCardLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  text-decoration: none;
  transition: color ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

  &:hover {
    color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}CC;
  }
`;
