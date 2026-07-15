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
  {
    id: '19',
    title: 'Automated Multi-Messenger Spectral Analysis',
    description: 'For confirmed multi-messenger events, automatically run joint spectral analysis across Fermi-GBM, Swift-XRT, and optical data using frameworks like 3ML — producing structured Starithm Analysis Reports with fitted spectral parameters, light curves, and joint posteriors. Researchers get the analysis done within minutes of event confirmation, without running the pipeline themselves.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '20',
    title: 'Optical Counterpart Candidates',
    description: 'Automated cone-search pipeline querying Lasair (ZTF) and Fink for optical transient candidates within the localisation region of each new event. Candidates are scored by real/bogus, Fink ML class, anomaly score, and temporal coincidence with the trigger, then displayed on the event detail page.',
    status: 'in-progress',
    category: 'feature',
  },
  {
    id: '21',
    title: 'Canonical Event Table & Versioned Records',
    description: 'A unified canonical_event table aggregating streaming notices, GCN circulars, and cross-match results into a single source of truth per event. Every parameter change (coordinates, redshift, classification) generates a new versioned revision with a cryptographic hash, enabling full scientific reproducibility.',
    status: 'planned',
    category: 'infrastructure',
  },
  {
    id: '22',
    title: 'Zenodo DOI Auto-Deposit',
    description: 'On major version changes — such as a finalised redshift or host galaxy identification — Starithm automatically deposits the event record to Zenodo via its REST API, returning a persistent DOI. A BibTeX citation block is displayed on the event page so researchers can formally cite the structured event state in literature.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '23',
    title: 'Circular Conflict Detection & Resolution',
    description: 'Automated detection of discordant measurements across GCN circulars for the same event (e.g. conflicting redshifts or coordinates). Conflicts are flagged on the event page with a banner. Claude evaluates the reporting instrumentation and generates a reasoned consensus resolution with justification.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '24',
    title: 'AI-Powered Event Search',
    description: 'Search by canonical ID, event aliases mentioned in GCN circulars (e.g. GRB 260714B, EP240414a), and free-text queries. AI-driven relevance ranking replaces simple string matching, surfacing the most scientifically relevant events first.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '25',
    title: 'User Profiles, Preferences & Personalised Dashboard',
    description: 'Users set preferences for event types (GRBs, gravitational waves, neutrinos), sources, and significance thresholds. The dashboard auto-loads filtered to their preferences on sign-in. A profile page shows activity history: liked posts, followed events, and comments.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '26',
    title: 'Follow Event & Notification Subscriptions',
    description: 'A "Follow" button on every event page lets users subscribe to updates — new notices, circulars, and optical candidates — for that specific event. Users can also subscribe to new blog articles. Notifications delivered via email and in-app.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '27',
    title: 'Blog Engagement — Likes & Comments',
    description: 'Like and comment on blog articles. Comments are threaded and tied to user accounts. Activity is tracked in user_activity tables and shown on the user profile page.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '28',
    title: 'Airmass & Observability Engine',
    description: 'Given an event\'s sky coordinates, compute airmass curves and observability windows (accounting for astronomical twilight and airmass limits) for the user\'s observatory. For poorly localised GW triggers, integrates TilePy to generate optimised tiling grids. Interactive airmass plots rendered on the event detail page.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '29',
    title: 'Target-of-Opportunity Telescope Dispatch',
    description: 'Automated ToO request pipeline connecting to LCO, Gemini, ESO, and Subaru. Transient parameters are mapped to standardised JSON payloads distinguishing RapidToO (within 24h) from StandardToO. The PI receives a WebSocket alert and approves with a single click before dispatch. Supports Rapid Response Mode for VLT/SOAR to repoint in under 6 minutes for nearby binary neutron star mergers.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '30',
    title: 'Bayesian Triangulation & SCiMMA Hopskotch Publisher',
    description: 'Upgrade multi-messenger cross-matching from bounding-box correlation to full Bayesian coincidence scoring using angular separation and trigger time-delay distributions. Includes SNEWS 2.0 triangulation for supernova localisation. Once high-confidence associations are confirmed, Starithm publishes structured JSON-LD results to SCiMMA\'s Hopskotch Kafka network.',
    status: 'planned',
    category: 'infrastructure',
  },
  {
    id: '31',
    title: 'Citizen Science Amateur Observer Portal',
    description: 'When a low-redshift (z < 0.05) or bright (m < 18) transient is identified, the platform dispatches localised target notifications to registered amateur observers in clear-sky regions via web push and Slack. The frontend renders difference imaging stamps for transient verification. Amateurs upload photometry directly, which is grouped under the canonical event timeline.',
    status: 'planned',
    category: 'feature',
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
