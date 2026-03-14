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
  {
    id: '1',
    title: 'Real-Time Alert Notifications',
    description: 'Push notifications and email alerts for new astronomical events',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '2',
    title: 'Multiple Brokers Integration',
    description: 'Connected Swift, Fermi, LIGO, IceCube and GCN for comprehensive multi-messenger coverage',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '3',
    title: 'AI-Powered Event Insights',
    description: 'AI-generated summaries for astronomical events, synthesising notices and GCN circulars into concise scientific analysis',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '4',
    title: 'Advanced Search & Filtering',
    description: 'Enhanced search capabilities with filters for date range, source, alert type and more',
    status: 'in-progress',
    category: 'feature',
  },
  {
    id: '5',
    title: 'Automated Skymap Generation',
    description: 'Automated skymap generation and visualisation for gravitational wave and gamma-ray events',
    status: 'in-progress',
    category: 'feature',
  },
  {
    id: '6',
    title: 'Multi-Messenger Event Correlation',
    description: 'Automatically link gravitational wave, gamma-ray burst, and neutrino detections from the same astrophysical event',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '7',
    title: 'Event Subscription Alerts',
    description: 'Subscribe to specific event types or sources and get notified the moment a new detection is confirmed',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '8',
    title: 'Follow-up Observation Scheduling',
    description: 'Tools to plan and coordinate follow-up telescope observations for newly detected transients',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '9',
    title: 'Collaborative Research Groups',
    description: 'Create and manage research groups for team collaboration on event analysis',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '10',
    title: 'Public API Access',
    description: 'Open API for researchers and developers to programmatically access Starithm event data and summaries',
    status: 'planned',
    category: 'infrastructure',
  },
  {
    id: '11',
    title: 'Mobile App / PWA',
    description: 'Native mobile experience for monitoring live astronomical events on the go',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '12',
    title: 'International Observatory Integration',
    description: 'Connect with additional global observatories and brokers for broader sky coverage',
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
