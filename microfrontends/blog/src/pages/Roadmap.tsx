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
  // Ordered to lead with the record layer: ingestion → extraction → linking →
  // canonical records, then the surfaces built on top.
  {
    id: '1',
    title: 'Real-Time Multi-Instrument Ingestion',
    description: 'Live ingestion from GCN across gamma-ray, X-ray, gravitational-wave, neutrino and fast-radio-burst instruments — Fermi GBM and LAT, Swift, Einstein Probe, SVOM, LIGO-Virgo-KAGRA, IceCube, Super-Kamiokande, CHIME and DSA-110 — with each mission\'s own alert format normalised into one common event model.',
    status: 'completed',
    category: 'infrastructure',
  },
  {
    id: '2',
    title: 'Measurement Extraction from GCN Circulars',
    description: 'Structured measurements pulled automatically from the free text of GCN Circulars: positions, fluence, peak flux, spectral parameters, T90, energy range and redshift, together with the telescopes, observers and institutions reporting them, and a short abstract of each Circular. Extraction is automated end to end — nothing is hand-curated.',
    status: 'completed',
    category: 'infrastructure',
  },
  {
    id: '3',
    title: 'Circulars Linked to Their Event',
    description: 'Every Circular is resolved to the event it reports on, so a burst\'s twenty follow-up Circulars arrive on one record instead of as twenty unconnected texts. Each link records how the match was made and how confident it is, rather than being guessed at read time.',
    status: 'completed',
    category: 'infrastructure',
  },
  {
    id: '4',
    title: 'One Unified Record Per Event',
    description: 'A single record per event, assembled as alerts arrive: every notice, every linked Circular, the best available position, and each name the event is known by. Built as the data lands rather than reassembled on every page view.',
    status: 'completed',
    category: 'infrastructure',
  },
  {
    id: '5',
    title: 'AI Event Summaries',
    description: 'A headline, significance rating and narrative summary for every event, written from the full set of notices and Circulars it has accumulated and refreshed as the record grows. Each summary records exactly which sources it was generated from.',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '6',
    title: 'AI Output Quality Guards',
    description: 'Every generated summary is checked before it can reach a page — field validity, length, and the failure mode where a language model collapses into repetition. The checks are deterministic, so no model is left grading another model, and anything that fails is regenerated on a stronger model or withheld entirely rather than published.',
    status: 'completed',
    category: 'improvement',
  },
  {
    id: '7',
    title: 'Circulars Archive Search',
    description: 'Search and browse the GCN Circulars archive by date range, instrument, alert type and event, with the extracted measurements shown alongside the original text.',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '8',
    title: 'Interactive Celestial Sphere',
    description: 'A 3D sky map of every detected event by position, messenger and significance — rotate to explore, click through to the full event record.',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '9',
    title: 'Automated Research Writing',
    description: 'A daily pipeline that reads new preprints in high-energy and gravitational-wave astrophysics and publishes accessible summaries, alongside narrative articles written for the most active events from their own alert and Circular history.',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '10',
    title: 'Machine-Readable Event Pages',
    description: 'Every event and article page is served as fully rendered HTML with structured scientific metadata, so search engines and AI retrieval tools read the science itself rather than an empty application shell — including a machine-readable index of the platform for automated agents.',
    status: 'completed',
    category: 'infrastructure',
  },
  {
    id: '11',
    title: 'Mobile-Ready Interface',
    description: 'Event listings, event records and navigation reflow for small screens, so the platform is usable from a phone at a telescope.',
    status: 'completed',
    category: 'improvement',
  },

  // ── In Progress ───────────────────────────────────────────────────────────
  {
    id: '12',
    title: 'Serving Every Page From the Unified Record',
    description: 'Moving event listings and event pages onto the unified records rather than matching event names at query time — faster, and no longer dependent on string similarity. Both paths are run side by side and compared before anything changes for users.',
    status: 'in-progress',
    category: 'infrastructure',
  },
  {
    id: '13',
    title: 'Event Identity Resolution',
    description: 'The rule that decides what counts as a single event, rebuilt as an explicit, tested and versioned set of per-instrument rules. An unrecognised alert format becomes a visible low-confidence decision instead of a silent guess, and changing a rule becomes a tracked, reversible step rather than something that quietly splits live events in two.',
    status: 'in-progress',
    category: 'infrastructure',
  },
  {
    id: '14',
    title: 'Multi-Messenger Association',
    description: 'Connecting gravitational-wave, gamma-ray, neutrino, X-ray and optical detections of the same source: spatial and temporal filtering, a statistical false-alarm screen, then model-assisted verification of each surviving pair with a confidence score and a stated reason.',
    status: 'in-progress',
    category: 'feature',
  },
  {
    id: '15',
    title: 'Optical Counterpart Candidates',
    description: 'Searching the optical transient brokers inside each new event\'s localisation region and scoring candidates on separation, timing relative to the trigger, host-galaxy context and machine-learning classification. Vetted transient lookup is live; wider broker coverage is being completed.',
    status: 'in-progress',
    category: 'feature',
  },
  {
    id: '16',
    title: 'Ingestion Health at a Glance',
    description: 'One chart per instrument stream showing what actually arrived, so a stream going quiet is visible immediately instead of weeks later. Every stream is shown including the empty ones, and an expected-cadence baseline is being added so genuinely quiet skies read differently from an outage.',
    status: 'in-progress',
    category: 'infrastructure',
  },
  {
    id: '17',
    title: 'Pipeline Monitoring & Alerting',
    description: 'Making silent failures loud: every rejected generation recorded with its reason, ingestion and service errors surfaced in a daily digest, and leading indicators tracked — rejection rates, model fallback rates, gaps in each instrument stream, and records going stale. Alerts are deliberately limited to failures that would otherwise go unnoticed.',
    status: 'in-progress',
    category: 'infrastructure',
  },
  {
    id: '18',
    title: 'Broader X-ray Coverage',
    description: 'Closing the largest remaining gaps in wavelength coverage: MAXI X-ray transients, and Swift\'s primary gamma-ray positions and arcsecond X-ray afterglow positions.',
    status: 'in-progress',
    category: 'infrastructure',
  },

  // ── Planned ───────────────────────────────────────────────────────────────
  // The record layer first: reconciliation, provenance, citability, retrieval.
  {
    id: '19',
    title: 'Detecting Where the Record Disagrees',
    description: 'The Circular record contradicts itself — different teams report different redshifts, positions and classifications for the same event. Starithm finds those disagreements, shows them on the event record instead of silently choosing one, and proposes a resolution that weighs the reporting instruments and explains its reasoning.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '20',
    title: 'Versioned Records & Citable DOIs',
    description: 'An event record keeps changing for weeks after the trigger, so a paper citing a live page cites something that no longer exists. Every parameter change is kept as an immutable revision, and significant changes — a finalised redshift, a host galaxy identification — mint a persistent DOI with a ready-to-use citation. Cite the record as it stood on a given date.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '21',
    title: 'Measurements That Keep Their Context',
    description: 'A number means little without what qualifies it: an exposure time summed across filters is not the same as one per filter, a magnitude without its band and epoch is unusable, and a position without its reference frame and uncertainty is not a position. Every extracted value will carry its units, scope, qualifiers and the sentence it came from.',
    status: 'planned',
    category: 'improvement',
  },
  {
    id: '22',
    title: 'Measured Extraction Accuracy',
    description: 'Confidence recorded for each extracted value and shown in the interface, with publication withheld below a threshold. A fixed evaluation set — including past failures kept as regression cases — measures every change to extraction against human-checked references, so accuracy is a number rather than an impression.',
    status: 'planned',
    category: 'improvement',
  },
  {
    id: '23',
    title: 'Search That Understands the Record',
    description: 'Find an event by any name it is called anywhere in the Circular record — GRB 260714B, EP240414a, IceCube-260712A — or by describing what you are looking for. Names are indexed as they appear in the text, and relevance ranking replaces exact-string matching.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '24',
    title: 'Researcher API & Data Export',
    description: 'Programmatic access to the same complete record the site shows — one event, or a query by time window, sky region, messenger and classification — returning alerts, Circulars, extracted measurements, associations and provenance. Documented, authenticated and rate-limited, with a per-event download for anyone who just wants the file.',
    status: 'planned',
    category: 'infrastructure',
  },
  {
    id: '25',
    title: 'Published Science on Every Event',
    description: 'Each event record links the refereed literature that came out of it, alongside the Circulars themselves — so the page stays useful years after the alert, and the path from detection to published result is visible in one place.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '26',
    title: 'Our Own Science Figures',
    description: 'Publication-quality figures generated from public mission data rather than linked from elsewhere: localisation credible regions, instrument-frame geometry, all-sky context with the Earth limb and detector fields of view, and multi-detector light curves — produced as the underlying data becomes available in the hours after a trigger. Fermi GBM first, then other missions.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '27',
    title: 'How the Localisation Converged',
    description: 'A single event arrives as a dozen or more successive alerts, its error region tightening from tens of degrees to under two as ground processing refines it. Because Starithm keeps every intermediate alert rather than only the latest position, that convergence can be shown as it actually happened — not just where it ended up.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '28',
    title: 'An Open Benchmark for Circular Extraction',
    description: 'Several groups now extract structured data from GCN Circulars with language models, and there is no shared benchmark to compare them against. Starithm\'s extraction measured openly against a labelled reference corpus of Circulars and Telegrams, per entity type — with the aim of an evaluation set the whole field can use, built with the other groups working on this problem.',
    status: 'planned',
    category: 'improvement',
  },
  {
    id: '29',
    title: 'Optical Afterglow Light Curves',
    description: 'Photometry reported across an event\'s many Circulars assembled into a single light curve — every point and band, colour-corrected to a common filter, plotted with a decay fit and archival context. Because the photometry is already linked to one event, assembling it is a query rather than a reconstruction, and the same approach extends to X-ray flux decay, gravitational-wave distance refinement and dispersion-measure updates.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '30',
    title: 'Classifying Afterglow Behaviour',
    description: 'Circulars describe how an afterglow is behaving in prose, where it cannot be queried. Once photometry is assembled across epochs, the trend — fading, plateau, rebrightening — becomes a structured property of the event, with the evidence behind it.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '31',
    title: 'Statistical Association & Publishing Back',
    description: 'Association scoring upgraded from geometric overlap to a proper statistical measure combining angular separation and arrival-time delay, including inter-detector triangulation for supernova neutrinos. Confirmed associations are published back to the community\'s alert network, so Starithm contributes to the ecosystem rather than only drawing from it.',
    status: 'planned',
    category: 'infrastructure',
  },
  {
    id: '32',
    title: 'Catalogue Cross-Reference',
    description: 'What is already known at this position, recorded as the event arrives: catalogued gamma-ray sources that flag a crowded field or a known variable emitter, and blazar candidates inside neutrino error regions. Cheap context that changes how a new detection should be read.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '33',
    title: 'Observability & Airmass',
    description: 'Observability windows and airmass curves for a given observatory from any event\'s position, accounting for twilight and airmass limits. For poorly localised gravitational-wave triggers, ranked tiled pointings derived from the probability map.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '34',
    title: 'Accounts, Preferences & Followed Events',
    description: 'Set preferences by event type, instrument and significance and have the dashboard open filtered to them. Follow an event to hear when new alerts, Circulars or counterpart candidates land on it.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '35',
    title: 'Contributed Observations & Discussion',
    description: 'Post an observation or a note directly onto an event record, attributed and threaded — so a follow-up that never becomes a Circular still has somewhere to live.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '36',
    title: 'Joint Multi-Messenger Inference',
    description: 'Joint Bayesian inference over gravitational-wave posteriors and kilonova light curves for confirmed multi-messenger events — the constraints these events exist to produce. The highest science value on this list, and correspondingly the furthest out.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '37',
    title: 'Target-of-Opportunity Requests',
    description: 'Transient parameters mapped onto the standard observation-request formats used by major facilities, distinguishing urgent from routine, with an approval step before anything is dispatched. Gated on observatory partnerships rather than on software.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '38',
    title: 'Amateur Observer Portal',
    description: 'For transients bright enough for amateur equipment, targeted notifications to registered stations under clear skies, difference images for verification, and uploaded photometry grouped onto the event timeline.',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '39',
    title: 'Installable App & Push Notifications',
    description: 'An installable mobile app with push notifications for followed events, once the subscription model underneath it is in place.',
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
              <HeaderSubtitle>What's live, what's being built, and where Starithm is going</HeaderSubtitle>
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
