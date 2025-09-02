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
    description: 'Connecting with multiple brokers to get the most comprehensive data',
    status: 'in-progress',
    category: 'feature',
  },
  {
    id: '3',
    title: 'Automated Skymap generation for Kafka events',
    description: 'Automated skymap generation for Kafka events',
    status: 'in-progress',
    category: 'feature',
  },
  {
    id: '4',
    title: 'Advanced Search & Filtering',
    description: 'Enhanced search capabilities with multiple filter options',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '5',
    title: 'Collaborative Research Groups',
    description: 'Create and manage research groups for team collaboration',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '6',
    title: 'Data Visualization Dashboard',
    description: 'Interactive charts and 3D visualizations for astronomical data',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '7',
    title: 'API Documentation & SDKs',
    description: 'Comprehensive API documentation and SDKs for developers',
    status: 'planned',
    category: 'infrastructure',
  },
  {
    id: '8',
    title: 'AI First',
    description: 'AI-powered event insights',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '9',
    title: 'International Observatory Integration',
    description: 'Connect with additional global observatories',
    status: 'planned',
    category: 'infrastructure',
  }
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
