import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';
import { Card, CardContent } from '@shared/components/ui/card';

export const Page = styled.div`
  min-height: 100vh;
  background-color: ${props => getThemeValue(props.theme, 'muted', '#f3f4f6')}33;
`;

export const Container = styled.div`
  max-width: 80rem; /* max-w-7xl */
  margin: 0 auto;
  padding: ${props => `${getThemeValue(props.theme, 'spacing.8', '2rem')} ${getThemeValue(props.theme, 'spacing.4', '1rem')}`};
  @media (min-width: 640px) {
    padding-left: ${props => getThemeValue(props.theme, 'spacing.6', '1.5rem')};
    padding-right: ${props => getThemeValue(props.theme, 'spacing.6', '1.5rem')};
  }
  @media (min-width: 1024px) {
    padding-left: ${props => getThemeValue(props.theme, 'spacing.8', '2rem')};
    padding-right: ${props => getThemeValue(props.theme, 'spacing.8', '2rem')};
  }
`;

export const Header = styled.div`
  margin-bottom: ${props => getThemeValue(props.theme, 'spacing.8', '2rem')};
`;

export const Title = styled.h1`
  font-size: ${props => getThemeValue(props.theme, 'fontSize.3xl', '1.875rem')};
  font-weight: ${props => getThemeValue(props.theme, 'fontWeight.bold', 700)};
  color: ${props => getThemeValue(props.theme, 'starithmRichBlack', '#0E0B16')};
  margin-bottom: ${props => getThemeValue(props.theme, 'spacing.2', '0.5rem')};
`;

export const Subtitle = styled.p`
  color: ${props => getThemeValue(props.theme, 'starithmRichBlack', '#0E0B16')}B3; /* 70% */
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => getThemeValue(props.theme, 'spacing.8', '2rem')};
  margin-top: ${props => getThemeValue(props.theme, 'spacing.8', '2rem')};

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const LeftCol = styled.div`
  @media (min-width: 1024px) {
    grid-column: span 2 / span 2;
  }
`;

export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => getThemeValue(props.theme, 'spacing.6', '1.5rem')};
`;

export const ActionsCard = styled(Card)``;
export const ActionsContent = styled(CardContent)`
  padding: ${props => getThemeValue(props.theme, 'spacing.6', '1.5rem')};
`;

export const ActionsTitle = styled.h3`
  font-size: ${props => getThemeValue(props.theme, 'fontSize.lg', '1.125rem')};
  font-weight: ${props => getThemeValue(props.theme, 'fontWeight.semibold', 600)};
  margin-bottom: ${props => getThemeValue(props.theme, 'spacing.4', '1rem')};
`;

export const ActionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => getThemeValue(props.theme, 'spacing.3', '0.75rem')};
`;

export const Footer = styled.footer`
  margin-top: auto;
  padding: ${props => getThemeValue(props.theme, 'spacing.6', '1.5rem')} 0;
  background-color: ${props => getThemeValue(props.theme, 'card', '#ffffff')};
  border-top: 1px solid ${props => getThemeValue(props.theme, 'border', '#e5e7eb')};
`;

export const FooterInner = styled.div`
  max-width: 56rem; /* max-w-4xl */
  margin: 0 auto;
  padding: 0 ${props => getThemeValue(props.theme, 'spacing.4', '1rem')};
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => getThemeValue(props.theme, 'spacing.4', '1rem')};
`;

export const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => getThemeValue(props.theme, 'spacing.2', '0.5rem')};
`;

export const FooterLogo = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background-color: ${props => getThemeValue(props.theme, 'starithmElectricViolet', '#770ff5')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: ${props => getThemeValue(props.theme, 'fontWeight.bold', 700)};
`;

export const FooterBrandName = styled.span`
  font-size: ${props => getThemeValue(props.theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${props => getThemeValue(props.theme, 'fontWeight.medium', 500)};
  color: ${props => getThemeValue(props.theme, 'starithmElectricViolet', '#770ff5')};
`;

export const FooterText = styled.p`
  font-size: ${props => getThemeValue(props.theme, 'fontSize.xs', '0.75rem')};
  color: ${props => getThemeValue(props.theme, 'mutedForeground', '#6b7280')};
`;

