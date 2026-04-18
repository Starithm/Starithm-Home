import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, Clock, CircleFadingPlus, Cog, Target } from 'lucide-react';
import {
  RoadmapContainer,
  Header,
  HeaderContainer,
  HeaderContent,
  BackLink,
  HeaderCenter,
  HeaderTitle,
  HeaderSubtitle,
  HeaderSpacer,
  Main,
  OverviewSection,
  OverviewTitle,
  OverviewGrid,
  OverviewCard,
  OverviewCardHeader,
  OverviewCardIcon,
  OverviewCardTitle,
  OverviewCardValue,
  OverviewCardDescription,
  RoadmapItemsSection,
  RoadmapSection,
  RoadmapSectionTitle,
  RoadmapSectionIcon,
  RoadmapItemsGrid,
  RoadmapItemContainer,
  RoadmapItemHeader,
  RoadmapItemLeft,
  RoadmapItemStatusIcon,
  RoadmapItemTitle,
  RoadmapItemRight,
  RoadmapItemCategoryIcon,
  RoadmapItemDescription,
  RoadmapItemFooter,
  RoadmapItemStatus
} from '../styled_components/Roadmap.styled';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  category: 'feature' | 'improvement' | 'infrastructure';
}

const roadmapItems: RoadmapItem[] = [
  // ── Completed ────────────────────────────────────────────────────────────
  {
    id: '1',
    title: 'Multi-Broker Real-Time Ingestion',
    description: 'Live GCN Kafka stream consuming alerts from Swift, Fermi, LIGO, IceCube, Einstein Probe, SVOM, CHIME, and DSA-110 with automatic schema normalisation',
    status: 'completed',
    category: 'infrastructure',
  },
  {
    id: '2',
    title: 'AI-Powered Event Summaries',
    description: 'LLM-generated headlines, significance ratings, and scientific summaries for every detected event, synthesising notices and GCN circulars into concise analysis',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '3',
    title: 'Interactive Celestial Sphere',
    description: 'Real-time 3D sky map showing all detected events by position, type, and significance — drag to rotate, click for details',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '4',
    title: 'GCN Circular Measurement Extraction',
    description: 'Automated extraction of structured measurements from GCN circulars — RA/Dec, fluence, peak flux, spectral parameters, redshift, and more — using a fine-tuned LLM pipeline',
    status: 'completed',
    category: 'infrastructure',
  },
  {
    id: '5',
    title: 'Research Blog Auto-Generation',
    description: 'Daily pipeline that fetches new arXiv papers in high-energy astrophysics and gravitational wave astronomy, generates accurate blog summaries, and publishes them automatically',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '6',
    title: 'SEO & Pre-rendered Event Pages',
    description: 'Bot-detection edge function serves pre-rendered HTML from R2 to search engines and AI crawlers, enabling full indexing of all event and blog pages',
    status: 'completed',
    category: 'infrastructure',
  },
  {
    id: '7',
    title: 'GCN Circulars Search Dashboard',
    description: 'Search and browse the full GCN circulars archive by date range, source, alert type, and event ID',
    status: 'completed',
    category: 'feature',
  },
  // ── In Progress ───────────────────────────────────────────────────────────
  {
    id: '8',
    title: 'Multi-Messenger Cross-Matching',
    description: 'Bayesian pipeline to automatically correlate gravitational wave, gamma-ray burst, neutrino, and optical detections from the same astrophysical source, with LLM-assisted verification',
    status: 'in-progress',
    category: 'feature',
  },
  {
    id: '9',
    title: 'Advanced Search & Filtering',
    description: 'Enhanced event search with filters for date range, source instrument, alert kind, significance level, and cross-matched detections',
    status: 'in-progress',
    category: 'feature',
  },
  // ── Planned ───────────────────────────────────────────────────────────────
  {
    id: '11',
    title: 'Event Subscription & Alert Notifications',
    description: 'Subscribe to specific event types or sources and receive push or email notifications the moment a new high-significance detection is confirmed',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '13',
    title: 'Follow-up Observation Scheduling',
    description: 'Integrated tools to plan and coordinate telescope follow-up observations for newly detected transients, with sky tiling and visibility constraints',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '13b',
    title: 'TilePy Observation Planning Integration',
    description: 'Integration with TilePy — an open-source Python library for multi-messenger follow-up planning — to rank telescope pointings by localisation probability and schedule optimal sky tiling strategies for GW and GRB events',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '14',
    title: 'Cross-Match Confidence Dashboard',
    description: 'Visual interface showing Bayesian false alarm probabilities and association confidence scores for multi-messenger event groups',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '15',
    title: 'Public API Access',
    description: 'Open API for researchers and developers to programmatically access Starithm event data, AI summaries, and cross-match results',
    status: 'planned',
    category: 'infrastructure',
  },
  {
    id: '16',
    title: 'Collaborative Research Groups',
    description: 'Create and manage research groups for team collaboration on event analysis, annotation, and follow-up coordination',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '17',
    title: 'Mobile App / PWA',
    description: 'Native mobile experience for monitoring live astronomical events on the go',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '18',
    title: 'International Observatory Integration',
    description: 'Connect with additional global observatories and alert brokers for broader sky coverage and faster multi-wavelength response',
    status: 'planned',
    category: 'infrastructure',
  },
];

const getStatusIcon = (status: RoadmapItem['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={20} />;
    case 'in-progress':
      return <Clock size={20} />;
    case 'planned':
      return <Circle size={20} />;
  }
};

const getCategoryIcon = (category: RoadmapItem['category']) => {
  switch (category) {
    case 'feature':
      return <Target size={16} />;
    case 'improvement':
      return <CircleFadingPlus size={16} />;
    case 'infrastructure':
      return <Cog size={16} />;
  }
};

export default function Roadmap() {
  const completedItems = roadmapItems.filter(item => item.status === 'completed');
  const inProgressItems = roadmapItems.filter(item => item.status === 'in-progress');
  const plannedItems = roadmapItems.filter(item => item.status === 'planned');

  return (
    <RoadmapContainer>
      {/* Header */}
      <Header>
        <HeaderContainer>
          <HeaderContent>
            <BackLink to="/blog">
              <ArrowLeft size={20} />
              <span>Back to Blog</span>
            </BackLink>
            <HeaderCenter>
              <HeaderTitle>Starithm Roadmap</HeaderTitle>
              <HeaderSubtitle>Upcoming Features & Development Timeline</HeaderSubtitle>
            </HeaderCenter>
            <HeaderSpacer />
          </HeaderContent>
        </HeaderContainer>
      </Header>

      {/* Content */}
      <Main>
        {/* Overview */}
        <OverviewSection>
          <OverviewTitle>Development Overview</OverviewTitle>
          <OverviewGrid>
            <OverviewCard>
              <OverviewCardHeader>
                <OverviewCardIcon>
                  <CheckCircle size={24} />
                </OverviewCardIcon>
                <OverviewCardTitle>Completed</OverviewCardTitle>
              </OverviewCardHeader>
              <OverviewCardValue color="#10b981">{completedItems.length}</OverviewCardValue>
              <OverviewCardDescription>Features delivered</OverviewCardDescription>
            </OverviewCard>
            <OverviewCard>
              <OverviewCardHeader>
                <OverviewCardIcon>
                  <Clock size={24} />
                </OverviewCardIcon>
                <OverviewCardTitle>In Progress</OverviewCardTitle>
              </OverviewCardHeader>
              <OverviewCardValue color="#3b82f6">{inProgressItems.length}</OverviewCardValue>
              <OverviewCardDescription>Currently developing</OverviewCardDescription>
            </OverviewCard>
            <OverviewCard>
              <OverviewCardHeader>
                <OverviewCardIcon>
                  <Circle size={24} />
                </OverviewCardIcon>
                <OverviewCardTitle>Planned</OverviewCardTitle>
              </OverviewCardHeader>
              <OverviewCardValue>{plannedItems.length}</OverviewCardValue>
              <OverviewCardDescription>Upcoming features</OverviewCardDescription>
            </OverviewCard>
          </OverviewGrid>
        </OverviewSection>

        {/* Roadmap Items */}
        <RoadmapItemsSection>
          {/* Completed */}
          {completedItems.length > 0 && (
            <RoadmapSection>
              <RoadmapSectionTitle>
                <RoadmapSectionIcon color="#10b981">
                  <CheckCircle size={24} />
                </RoadmapSectionIcon>
                <span>Completed Features</span>
              </RoadmapSectionTitle>
              <RoadmapItemsGrid>
                {completedItems.map(item => (
                  <RoadmapItem key={item.id} item={item} />
                ))}
              </RoadmapItemsGrid>
            </RoadmapSection>
          )}

          {/* In Progress */}
          {inProgressItems.length > 0 && (
            <RoadmapSection>
              <RoadmapSectionTitle>
                <RoadmapSectionIcon color="#3b82f6">
                  <Clock size={24} />
                </RoadmapSectionIcon>
                <span>In Progress</span>
              </RoadmapSectionTitle>
              <RoadmapItemsGrid>
                {inProgressItems.map(item => (
                  <RoadmapItem key={item.id} item={item} />
                ))}
              </RoadmapItemsGrid>
            </RoadmapSection>
          )}

          {/* Planned */}
          {plannedItems.length > 0 && (
            <RoadmapSection>
              <RoadmapSectionTitle>
                <RoadmapSectionIcon>
                  <Circle size={24} />
                </RoadmapSectionIcon>
                <span>Planned Features</span>
              </RoadmapSectionTitle>
              <RoadmapItemsGrid>
                {plannedItems.map(item => (
                  <RoadmapItem key={item.id} item={item} />
                ))}
              </RoadmapItemsGrid>
            </RoadmapSection>
          )}
        </RoadmapItemsSection>
      </Main>
    </RoadmapContainer>
  );
}

function RoadmapItem({ item }: { item: RoadmapItem }) {
  return (
    <RoadmapItemContainer>
      <RoadmapItemHeader>
        <RoadmapItemLeft>
          <RoadmapItemStatusIcon 
            color={
              item.status === 'completed' ? '#10b981' : 
              item.status === 'in-progress' ? '#3b82f6' : 
              undefined
            }
          >
            {getStatusIcon(item.status)}
          </RoadmapItemStatusIcon>
          <RoadmapItemTitle>{item.title}</RoadmapItemTitle>
        </RoadmapItemLeft>
        <RoadmapItemRight>
          <RoadmapItemCategoryIcon 
            color={
              item.category === 'feature' ? 'starithmElectricViolet' : 
              item.category === 'improvement' ? 'starithmVeronica' : 
              'starithmGoldenYellow'
            }
          >
            {getCategoryIcon(item.category)}
          </RoadmapItemCategoryIcon>
        </RoadmapItemRight>
      </RoadmapItemHeader>
      
      <RoadmapItemDescription>{item.description}</RoadmapItemDescription>
      
      <RoadmapItemFooter>
        <RoadmapItemStatus status={item.status}>
          {item.status.replace('-', ' ')}
        </RoadmapItemStatus>
      </RoadmapItemFooter>
    </RoadmapItemContainer>
  );
}
