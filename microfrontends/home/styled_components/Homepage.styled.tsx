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

// Layout Components
export const HomepageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  overflow: hidden;
`;

export const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  position: relative;
  z-index: 10;

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    padding: 0 ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
  }
`;

export const HeroGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.12', '3rem')};
  align-items: center;

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => getThemeValue(theme, 'spacing.12', '3rem')};
  }
`;

export const HeroText = styled.div`
  text-align: center;

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    text-align: left;
  }
`;

export const HeroTitle = styled.h1`
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeight.tight', 1.25)};
`;

export const TitleLine1 = styled.span`
  display: block;
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.4xl', '2.25rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  letter-spacing: 0.05em;

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.5xl', '3.75rem')};
  }

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.xl', '1280px')}) {
    font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.6xl', '4.5rem')};
  }
`;

export const TitleLine2 = styled.span`
  display: block;
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.5xl', '3rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.6xl', '4.5rem')};
  }

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.xl', '1280px')}) {
    font-size: 5.25rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.2xl', '1.5rem')};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
  opacity: 0.9;
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeight.relaxed', 1.625)};

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.3xl', '1.875rem')};
  }
`;

export const HeroActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  justify-content: center;

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.sm', '640px')}) {
    flex-direction: row;
  }

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    justify-content: flex-start;
  }
`;

export const AbstractShapes = styled.div`
  position: relative;
  display: none;

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    display: block;
  }
`;

export const ShapesContainer = styled.div`
  position: relative;
  width: 100%;
  height: 24rem;
`;

export const GradientOrb = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 16rem;
  height: 16rem;
  background: linear-gradient(135deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}33,
    ${({ theme }) => getThemeValue(theme, 'starithmVeronica', '#A239CA')}26
  );
  border-radius: 50%;
  filter: blur(24px);
`;

export const SecondaryShape1 = styled.div`
  position: absolute;
  top: 4rem;
  left: 2rem;
  width: 8rem;
  height: 8rem;
  border: 2px solid ${({ theme }) => getThemeValue(theme, 'starithmVeronica', '#A239CA')}80;
  border-radius: 50%;
`;

export const SecondaryShape2 = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 4rem;
  width: 6rem;
  height: 6rem;
  background: linear-gradient(135deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmSelectiveYellow', '#FFB400')}4D,
    transparent
  );
  transform: rotate(45deg);
`;

export const GeometricLine1 = styled.div`
  position: absolute;
  top: 50%;
  left: 25%;
  width: 12rem;
  height: 2px;
  background: linear-gradient(90deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}99,
    transparent
  );
  transform: rotate(12deg);
`;

export const GeometricLine2 = styled.div`
  position: absolute;
  top: 33.33%;
  right: 25%;
  width: 8rem;
  height: 2px;
  background: linear-gradient(270deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmVeronica', '#A239CA')}99,
    transparent
  );
  transform: rotate(-12deg);
`;

// Section Components
export const Section = styled.section`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.24', '6rem')} 0;
`;

export const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    padding: 0 ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
  }
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.16', '4rem')};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.4xl', '2.25rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#770ff5')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.5xl', '3rem')};
  }
`;

export const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xl', '1.25rem')};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  max-width: 48rem;
  margin: 0 auto;
  opacity: 0.7;
`;

// Metrics Grid
export const MetricsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.md', '768px')}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const MetricItem = styled.div`
  text-align: center;
`;

export const MetricValue = styled.div<{ color?: string }>`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.4xl', '2.25rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme, color }) => getThemeValue(theme, `${color}`, '#770ff5')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
`;

export const MetricLabel = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  opacity: 0.7;
`;

// Features Grid
export const FeaturesGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.md', '768px')}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const FeatureCard = styled.div<{ fromColor?: string; toColor?: string }>`
  text-align: center;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
  border-radius: ${({ theme }) => getThemeValue(theme, 'radius', '0.5rem')};
  background: linear-gradient(135deg, 
    ${({ theme, fromColor }) => getThemeValue(theme, `${fromColor}`, '#770ff5')}33,
    ${({ theme, toColor }) => getThemeValue(theme, `${toColor}`, '#A239CA')}1A
  );
`;

export const FeatureIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}33;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.2xl', '1.5rem')};
`;

export const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.2xl', '1.5rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const FeatureDescription = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  opacity: 0.7;
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeight.relaxed', 1.625)};
`;

// NovaTrace Section
export const NovaTraceGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.12', '3rem')};
  align-items: center;

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const NovaTraceContent = styled.div``;

export const NovaTraceTitle = styled.h3`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.3xl', '1.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#770ff5')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
`;

export const NovaTraceDescription = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')};
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeight.relaxed', 1.625)};
  opacity: 0.7;
`;

export const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20rem;
  background: linear-gradient(135deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}1A,
    ${({ theme }) => getThemeValue(theme, 'starithmVeronica', '#A239CA')}1A
  );
  border-radius: ${({ theme }) => getThemeValue(theme, 'radius', '0.5rem')};
  overflow: hidden;
  border: 2px solid ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}4D;
  box-shadow: ${({ theme }) => getThemeValue(theme, 'shadows.lg', '0 10px 15px -3px rgba(0, 0, 0, 0.1)')};
`;

export const VideoIframe = styled.iframe`
  width: 100%;
  height: 100%;
`;

// Footer
export const Footer = styled.div`
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
  border-top: 1px solid ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}33;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.16', '4rem')} 0;
`;

export const FooterGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.10', '2.5rem')};

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.md', '768px')}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const FooterBrand = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1.5rem')};
`;

export const FooterLogo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`;
export const FooterBrandContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
`;

export const FooterTitle = styled.h3`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.2xl', '1.5rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#770ff5')};
`;

export const FooterDescription = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  line-height: ${({ theme }) => getThemeValue(theme, 'lineHeight.relaxed', 1.625)};
  opacity: 0.7;
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const SocialLink = styled.a`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ theme }) => getThemeValue(theme, 'starithmPlatinum', '#E7DFDD')};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  text-decoration: none;
  transition: all ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

  &:hover {
    background: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}4D;
    transform: translateY(-2px);
  }
`;

export const FooterSection = styled.div``;

export const FooterSectionTitle = styled.h4`
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xl', '1.25rem')};
`;

export const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
`;

export const FooterLink = styled.li`
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  opacity: 0.7;

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

    &:hover {
      color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')};
    }
  }

  button {
    background: none;
    border: none;
    color: inherit;
    font-size: inherit;
    cursor: pointer;
    text-align: left;
    transition: color ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

    &:hover {
      color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')};
    }
  }
`;

// Background Gradients
export const MetricsSection = styled(Section)`
  background: linear-gradient(180deg, 
    ${({ theme }) => getThemeValue(theme, 'background', 'white')} 0%,
    ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}0D 100%
  );
`;

export const FeaturesSection = styled(Section)`
  background-color: ${({ theme }) => getThemeValue(theme, 'background', 'white')};
`;

export const NovaTraceSection = styled(Section)`
  background: linear-gradient(180deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}0D 0%,
    ${({ theme }) => getThemeValue(theme, 'background', 'white')} 100%
  );
`;
