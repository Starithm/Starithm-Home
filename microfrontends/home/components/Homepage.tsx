import { Button } from "../../../shared/components/ui/button";
import { StarfieldBackground } from "./StarfieldBackground";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/components/ui/dialog";
import {
  HomepageContainer,
  HeroSection,
  HeroContent,
  HeroGrid,
  HeroText,
  HeroTitle,
  TitleLine1,
  TitleLine2,
  HeroSubtitle,
  HeroActions,
  AbstractShapes,
  ShapesContainer,
  GradientOrb,
  SecondaryShape1,
  SecondaryShape2,
  GeometricLine1,
  GeometricLine2,
  MetricsSection,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  MetricsGrid,
  MetricItem,
  MetricValue,
  MetricLabel,
  FeaturesSection,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  NovaTraceSection,
  NovaTraceGrid,
  NovaTraceContent,
  NovaTraceTitle,
  NovaTraceDescription,
  VideoContainer,
  VideoIframe,
  Footer,
  FooterGrid,
  FooterBrand,
  FooterLogo,
  FooterTitle,
  FooterDescription,
  SocialLinks,
  SocialLink,
  FooterSection,
  FooterSectionTitle,
  FooterLinks,
  FooterLink,
  FooterBrandContainer
} from "../styled_components/Homepage.styled";

export function Homepage() {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  return (
    <HomepageContainer>
      <HeroSection>
        <StarfieldBackground />
        
        <HeroContent>
          <HeroGrid>
            <HeroText>
              <HeroTitle>
                <TitleLine1>
                  Explore the Universe with
                </TitleLine1>
                <TitleLine2>
                  Starithm
                </TitleLine2>
              </HeroTitle>
              
              <HeroSubtitle>
                Instant access to astronomical alerts from trusted global networks — all in one place.
              </HeroSubtitle>
              
              <HeroActions>
                <Button 
                  variant="default"
                  size="lg"
                  onClick={() => {
                    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                    window.open(`${baseUrl}/novatrace/alerts`, '_blank');
                  }}
                >
                  View Live Alerts
                </Button>
              </HeroActions>
            </HeroText>
            
            <AbstractShapes>
              <ShapesContainer>
                <GradientOrb />
                <SecondaryShape1 />
                <SecondaryShape2 />
                <GeometricLine1 />
                <GeometricLine2 />
              </ShapesContainer>
            </AbstractShapes>
          </HeroGrid>
        </HeroContent>
      </HeroSection>

      <MetricsSection>
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>
              Real-Time Astronomical Data
            </SectionTitle>
            <SectionSubtitle>
              Access live alerts from the world's leading astronomical observatories and research institutions
            </SectionSubtitle>
          </SectionHeader>
          
          <MetricsGrid>
            <MetricItem>
              <MetricValue color="starithmElectricViolet">50+</MetricValue>
              <MetricLabel>Observatories</MetricLabel>
            </MetricItem>
            <MetricItem>
              <MetricValue color="starithmVeronica">24/7</MetricValue>
              <MetricLabel>Monitoring</MetricLabel>
            </MetricItem>
            <MetricItem>
              <MetricValue color="starithmGoldenYellow">1000+</MetricValue>
              <MetricLabel>Alerts</MetricLabel>
            </MetricItem>
            <MetricItem>
              <MetricValue color="starithmVeronica">99.9%</MetricValue>
              <MetricLabel>Uptime</MetricLabel>
            </MetricItem>
          </MetricsGrid>
        </SectionContainer>
      </MetricsSection>

      <FeaturesSection>
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>
              Upcoming Powerful Features for Astronomers
            </SectionTitle>
            <SectionSubtitle>
              Everything you need to stay ahead of astronomical discoveries
            </SectionSubtitle>
          </SectionHeader>
          
          <FeaturesGrid>
            <FeatureCard fromColor="starithmElectricViolet" toColor="starithmVeronica">
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureTitle>Real-Time Alerts</FeatureTitle>
              <FeatureDescription>
                Get instant notifications for new astronomical events and discoveries
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard fromColor="starithmVeronica" toColor="starithmGoldenYellow">
              <FeatureIcon>🔍</FeatureIcon>
              <FeatureTitle>Advanced Search</FeatureTitle>
              <FeatureDescription>
                Filter and search through historical data with powerful query tools
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard fromColor="starithmSelectiveYellow" toColor="starithmVeronica">
              <FeatureIcon>🤝</FeatureIcon>
              <FeatureTitle>Collaboration</FeatureTitle>
              <FeatureDescription>
                Connect with researchers worldwide and share findings
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </SectionContainer>
      </FeaturesSection>

      <NovaTraceSection>
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>
              NovaTrace Dashboard
            </SectionTitle>
            <SectionSubtitle>
              Real-time astronomical event intelligence and alert monitoring
            </SectionSubtitle>
          </SectionHeader>
          
          <NovaTraceGrid>
            <NovaTraceContent>
              <NovaTraceTitle>
                Event Intelligence Dashboard
              </NovaTraceTitle>
              <NovaTraceDescription>
                Monitor and analyze astronomical events in real-time through GCN notices and ATel reports. 
                Track gamma-ray bursts, optical transients, neutrino detections, and gravitational waves 
                with comprehensive measurement data and confidence assessments.
              </NovaTraceDescription>
              <Button 
                variant="default"
                size="lg"
                onClick={() => {
                  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                  window.open(`${baseUrl}/novatrace/events`, '_blank');
                }}
              >
                Launch NovaTrace
              </Button>
            </NovaTraceContent>
            
            <VideoContainer>
              <VideoIframe
                src="https://www.youtube.com/embed/AUyLy5NSxk8?modestbranding=1&showinfo=0&rel=0&controls=1"
                title="NovaTrace Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </VideoContainer>
          </NovaTraceGrid>
        </SectionContainer>
      </NovaTraceSection>

      <Footer>
        <SectionContainer>
          <FooterGrid>
            <FooterBrand>
              <FooterBrandContainer>
                <FooterLogo 
                  src="/logo_without_name.png" 
                  alt="Starithm Logo" 
                />
                <FooterTitle>Starithm</FooterTitle>
              </FooterBrandContainer>
              <FooterDescription>
                The astronomer's platform for real-time alerts and collaboration.
              </FooterDescription>
              <SocialLinks>
                <SocialLink 
                  href="https://x.com/starithm_ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  𝕏
                </SocialLink>
              </SocialLinks>
            </FooterBrand>
            
            <FooterSection>
              <FooterSectionTitle>Platform</FooterSectionTitle>
              <FooterLinks>
                <FooterLink>
                  <a href="/novatrace">NovaTrace</a>
                </FooterLink>
              </FooterLinks>
            </FooterSection>
            
            <FooterSection>
              <FooterSectionTitle>Resources</FooterSectionTitle>
              <FooterLinks>
                <FooterLink>
                  <a 
                    href="/blog/roadmap" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Roadmap
                  </a>
                </FooterLink>
                <FooterLink>
                  <a 
                    href="/blog" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Blog
                  </a>
                </FooterLink>
              </FooterLinks>
            </FooterSection>
            
            <FooterSection>
              <FooterSectionTitle>Contact</FooterSectionTitle>
              <FooterLinks>
                <FooterLink>
                  <button onClick={() => setIsContactDialogOpen(true)}>
                    Contact Us
                  </button>
                </FooterLink>
              </FooterLinks>
            </FooterSection>
          </FooterGrid>
        </SectionContainer>
      </Footer>

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-starithm-electric-violet">Contact Us</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-starithm-rich-black/70 dark:text-starithm-platinum/70 text-lg mb-4">
              Get in touch with our team
            </p>
            <p className="text-starithm-electric-violet font-semibold text-lg">
              contact.starithm@gmail.com
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </HomepageContainer>
  );
}
