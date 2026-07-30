/* Roadmap data — five platform layers, each item placed relative to the frontier.
 *
 *   held     shipped and running today
 *   crossing actively being built
 *   ahead    not started; ordered by what it depends on
 *
 * Layers are ordered bottom-up: nothing in a later layer works until the one
 * before it holds.
 */

export type RoadmapStatus = 'held' | 'crossing' | 'ahead';
export type RoadmapCategory = 'feature' | 'improvement' | 'infrastructure';

export interface RoadmapArea {
  key: string;
  name: string;
  depth: string;
  note: string;
}

export interface RoadmapItem {
  id: string;
  area: string;
  status: RoadmapStatus;
  category: RoadmapCategory;
  title: string;
  description: string;
}

export const AREAS: RoadmapArea[] = [
  { key: 'record', depth: 'LAYER 01', name: 'Ingestion & the Record',
    note: 'Alerts in, normalised, extracted and resolved to one record per event. Everything else depends on this being right.' },
  { key: 'assoc', depth: 'LAYER 02', name: 'Association & Counterparts',
    note: 'Deciding when two detections in different messengers are the same source — and saying how sure we are.' },
  { key: 'read', depth: 'LAYER 03', name: 'Reading the Science',
    note: 'Making the accumulated record legible: summaries, search, sky map, and pages machines can read.' },
  { key: 'analysis', depth: 'LAYER 04', name: 'Analysis & Figures',
    note: 'Science we can compute ourselves once the record holds — light curves, localisation history, our own figures.' },
  { key: 'access', depth: 'LAYER 05', name: 'Observing & Access',
    note: 'Getting the record out: API, observability planning, accounts, contributed observations, mobile.' },
];

const S: Record<string, RoadmapStatus> = { shipped: 'held', building: 'crossing', next: 'ahead' };

export const ROADMAP_ITEMS: RoadmapItem[] = [
  { id: '1', area: 'record', status: 'held', category: 'infrastructure',
    title: 'Real-Time Multi-Instrument Ingestion',
    description: 'Live ingestion from GCN across gamma-ray, X-ray, gravitational-wave, neutrino and fast-radio-burst instruments — Fermi GBM and LAT, Swift, Einstein Probe, SVOM, LIGO-Virgo-KAGRA, IceCube, Super-Kamiokande, CHIME and DSA-110 — with each mission\'s own alert format normalised into one common event model.' },
  { id: '2', area: 'record', status: 'held', category: 'infrastructure',
    title: 'Measurement Extraction from GCN Circulars',
    description: 'Structured measurements pulled automatically from the free text of GCN Circulars: positions, fluence, peak flux, spectral parameters, T90, energy range and redshift, together with the telescopes, observers and institutions reporting them, and a short abstract of each Circular. Extraction is automated end to end — nothing is hand-curated.' },
  { id: '3', area: 'record', status: 'held', category: 'infrastructure',
    title: 'Circulars Linked to Their Event',
    description: 'Every Circular is resolved to the event it reports on, so a burst\'s twenty follow-up Circulars arrive on one record instead of as twenty unconnected texts. Each link records how the match was made and how confident it is, rather than being guessed at read time.' },
  { id: '4', area: 'record', status: 'held', category: 'infrastructure',
    title: 'One Unified Record Per Event',
    description: 'A single record per event, assembled as alerts arrive: every notice, every linked Circular, the best available position, and each name the event is known by. Built as the data lands rather than reassembled on every page view.' },
  { id: '5', area: 'read', status: 'held', category: 'feature',
    title: 'AI Event Summaries',
    description: 'A headline, significance rating and narrative summary for every event, written from the full set of notices and Circulars it has accumulated and refreshed as the record grows. Each summary records exactly which sources it was generated from.' },
  { id: '6', area: 'read', status: 'held', category: 'improvement',
    title: 'AI Output Quality Guards',
    description: 'Every generated summary is checked before it can reach a page — field validity, length, and the failure mode where a language model collapses into repetition. The checks are deterministic, so no model is left grading another model, and anything that fails is regenerated on a stronger model or withheld entirely rather than published.' },
  { id: '7', area: 'read', status: 'held', category: 'feature',
    title: 'Circulars Archive Search',
    description: 'Search and browse the GCN Circulars archive by date range, instrument, alert type and event, with the extracted measurements shown alongside the original text.' },
  { id: '8', area: 'read', status: 'held', category: 'feature',
    title: 'Interactive Celestial Sphere',
    description: 'A 3D sky map of every detected event by position, messenger and significance — rotate to explore, click through to the full event record.' },
  { id: '9', area: 'read', status: 'held', category: 'feature',
    title: 'Automated Research Writing',
    description: 'A daily pipeline that reads new preprints in high-energy and gravitational-wave astrophysics and publishes accessible summaries, alongside narrative articles written for the most active events from their own alert and Circular history.' },
  { id: '10', area: 'read', status: 'held', category: 'infrastructure',
    title: 'Machine-Readable Event Pages',
    description: 'Every event and article page is served as fully rendered HTML with structured scientific metadata, so search engines and AI retrieval tools read the science itself rather than an empty application shell — including a machine-readable index of the platform for automated agents.' },
  { id: '11', area: 'read', status: 'held', category: 'improvement',
    title: 'Mobile-Ready Interface',
    description: 'Event listings, event records and navigation reflow for small screens, so the platform is usable from a phone at a telescope.' },
  { id: '12', area: 'record', status: 'crossing', category: 'infrastructure',
    title: 'Serving Every Page From the Unified Record',
    description: 'Moving event listings and event pages onto the unified records rather than matching event names at query time — faster, and no longer dependent on string similarity. Both paths are run side by side and compared before anything changes for users.' },
  { id: '13', area: 'record', status: 'crossing', category: 'infrastructure',
    title: 'Event Identity Resolution',
    description: 'The rule that decides what counts as a single event, rebuilt as an explicit, tested and versioned set of per-instrument rules. An unrecognised alert format becomes a visible low-confidence decision instead of a silent guess, and changing a rule becomes a tracked, reversible step rather than something that quietly splits live events in two.' },
  { id: '14', area: 'assoc', status: 'crossing', category: 'feature',
    title: 'Multi-Messenger Association',
    description: 'Connecting gravitational-wave, gamma-ray, neutrino, X-ray and optical detections of the same source: spatial and temporal filtering, a statistical false-alarm screen, then model-assisted verification of each surviving pair with a confidence score and a stated reason.' },
  { id: '15', area: 'assoc', status: 'crossing', category: 'feature',
    title: 'Optical Counterpart Candidates',
    description: 'Searching the optical transient brokers inside each new event\'s localisation region and scoring candidates on separation, timing relative to the trigger, host-galaxy context and machine-learning classification. Vetted transient lookup is live; wider broker coverage is being completed.' },
  { id: '16', area: 'record', status: 'crossing', category: 'infrastructure',
    title: 'Ingestion Health at a Glance',
    description: 'One chart per instrument stream showing what actually arrived, so a stream going quiet is visible immediately instead of weeks later. Every stream is shown including the empty ones, and an expected-cadence baseline is being added so genuinely quiet skies read differently from an outage.' },
  { id: '17', area: 'record', status: 'crossing', category: 'infrastructure',
    title: 'Pipeline Monitoring & Alerting',
    description: 'Making silent failures loud: every rejected generation recorded with its reason, ingestion and service errors surfaced in a daily digest, and leading indicators tracked — rejection rates, model fallback rates, gaps in each instrument stream, and records going stale. Alerts are deliberately limited to failures that would otherwise go unnoticed.' },
  { id: '18', area: 'record', status: 'crossing', category: 'infrastructure',
    title: 'Broader X-ray Coverage',
    description: 'Closing the largest remaining gaps in wavelength coverage: MAXI X-ray transients, and Swift\'s primary gamma-ray positions and arcsecond X-ray afterglow positions.' },
  { id: '19', area: 'record', status: 'ahead', category: 'feature',
    title: 'Detecting Where the Record Disagrees',
    description: 'The Circular record contradicts itself — different teams report different redshifts, positions and classifications for the same event. Starithm finds those disagreements, shows them on the event record instead of silently choosing one, and proposes a resolution that weighs the reporting instruments and explains its reasoning.' },
  { id: '20', area: 'record', status: 'ahead', category: 'feature',
    title: 'Versioned Records & Citable DOIs',
    description: 'An event record keeps changing for weeks after the trigger, so a paper citing a live page cites something that no longer exists. Every parameter change is kept as an immutable revision, and significant changes — a finalised redshift, a host galaxy identification — mint a persistent DOI with a ready-to-use citation. Cite the record as it stood on a given date.' },
  { id: '21', area: 'record', status: 'ahead', category: 'improvement',
    title: 'Measurements That Keep Their Context',
    description: 'A number means little without what qualifies it: an exposure time summed across filters is not the same as one per filter, a magnitude without its band and epoch is unusable, and a position without its reference frame and uncertainty is not a position. Every extracted value will carry its units, scope, qualifiers and the sentence it came from.' },
  { id: '22', area: 'record', status: 'ahead', category: 'improvement',
    title: 'Measured Extraction Accuracy',
    description: 'Confidence recorded for each extracted value and shown in the interface, with publication withheld below a threshold. A fixed evaluation set — including past failures kept as regression cases — measures every change to extraction against human-checked references, so accuracy is a number rather than an impression.' },
  { id: '23', area: 'read', status: 'ahead', category: 'feature',
    title: 'Search That Understands the Record',
    description: 'Find an event by any name it is called anywhere in the Circular record — GRB 260714B, EP240414a, IceCube-260712A — or by describing what you are looking for. Names are indexed as they appear in the text, and relevance ranking replaces exact-string matching.' },
  { id: '24', area: 'access', status: 'ahead', category: 'infrastructure',
    title: 'Researcher API & Data Export',
    description: 'Programmatic access to the same complete record the site shows — one event, or a query by time window, sky region, messenger and classification — returning alerts, Circulars, extracted measurements, associations and provenance. Documented, authenticated and rate-limited, with a per-event download for anyone who just wants the file.' },
  { id: '25', area: 'read', status: 'ahead', category: 'feature',
    title: 'Published Science on Every Event',
    description: 'Each event record links the refereed literature that came out of it, alongside the Circulars themselves — so the page stays useful years after the alert, and the path from detection to published result is visible in one place.' },
  { id: '26', area: 'analysis', status: 'ahead', category: 'feature',
    title: 'Our Own Science Figures',
    description: 'Publication-quality figures generated from public mission data rather than linked from elsewhere: localisation credible regions, instrument-frame geometry, all-sky context with the Earth limb and detector fields of view, and multi-detector light curves — produced as the underlying data becomes available in the hours after a trigger. Fermi GBM first, then other missions.' },
  { id: '27', area: 'analysis', status: 'ahead', category: 'feature',
    title: 'How the Localisation Converged',
    description: 'A single event arrives as a dozen or more successive alerts, its error region tightening from tens of degrees to under two as ground processing refines it. Because Starithm keeps every intermediate alert rather than only the latest position, that convergence can be shown as it actually happened — not just where it ended up.' },
  { id: '28', area: 'record', status: 'ahead', category: 'improvement',
    title: 'An Open Benchmark for Circular Extraction',
    description: 'Several groups now extract structured data from GCN Circulars with language models, and there is no shared benchmark to compare them against. Starithm\'s extraction measured openly against a labelled reference corpus of Circulars and Telegrams, per entity type — with the aim of an evaluation set the whole field can use, built with the other groups working on this problem.' },
  { id: '29', area: 'analysis', status: 'ahead', category: 'feature',
    title: 'Optical Afterglow Light Curves',
    description: 'Photometry reported across an event\'s many Circulars assembled into a single light curve — every point and band, colour-corrected to a common filter, plotted with a decay fit and archival context. Because the photometry is already linked to one event, assembling it is a query rather than a reconstruction, and the same approach extends to X-ray flux decay, gravitational-wave distance refinement and dispersion-measure updates.' },
  { id: '30', area: 'analysis', status: 'ahead', category: 'feature',
    title: 'Classifying Afterglow Behaviour',
    description: 'Circulars describe how an afterglow is behaving in prose, where it cannot be queried. Once photometry is assembled across epochs, the trend — fading, plateau, rebrightening — becomes a structured property of the event, with the evidence behind it.' },
  { id: '31', area: 'assoc', status: 'ahead', category: 'infrastructure',
    title: 'Statistical Association & Publishing Back',
    description: 'Association scoring upgraded from geometric overlap to a proper statistical measure combining angular separation and arrival-time delay, including inter-detector triangulation for supernova neutrinos. Confirmed associations are published back to the community\'s alert network, so Starithm contributes to the ecosystem rather than only drawing from it.' },
  { id: '32', area: 'assoc', status: 'ahead', category: 'feature',
    title: 'Catalogue Cross-Reference',
    description: 'What is already known at this position, recorded as the event arrives: catalogued gamma-ray sources that flag a crowded field or a known variable emitter, and blazar candidates inside neutrino error regions. Cheap context that changes how a new detection should be read.' },
  { id: '33', area: 'access', status: 'ahead', category: 'feature',
    title: 'Observability & Airmass',
    description: 'Observability windows and airmass curves for a given observatory from any event\'s position, accounting for twilight and airmass limits. For poorly localised gravitational-wave triggers, ranked tiled pointings derived from the probability map.' },
  { id: '34', area: 'access', status: 'ahead', category: 'feature',
    title: 'Accounts, Preferences & Followed Events',
    description: 'Set preferences by event type, instrument and significance and have the dashboard open filtered to them. Follow an event to hear when new alerts, Circulars or counterpart candidates land on it.' },
  { id: '35', area: 'access', status: 'ahead', category: 'feature',
    title: 'Contributed Observations & Discussion',
    description: 'Post an observation or a note directly onto an event record, attributed and threaded — so a follow-up that never becomes a Circular still has somewhere to live.' },
  { id: '36', area: 'assoc', status: 'ahead', category: 'feature',
    title: 'Joint Multi-Messenger Inference',
    description: 'Joint Bayesian inference over gravitational-wave posteriors and kilonova light curves for confirmed multi-messenger events — the constraints these events exist to produce. The highest science value on this list, and correspondingly the furthest out.' },
  { id: '37', area: 'access', status: 'ahead', category: 'feature',
    title: 'Target-of-Opportunity Requests',
    description: 'Transient parameters mapped onto the standard observation-request formats used by major facilities, distinguishing urgent from routine, with an approval step before anything is dispatched. Gated on observatory partnerships rather than on software.' },
  { id: '38', area: 'access', status: 'ahead', category: 'feature',
    title: 'Amateur Observer Portal',
    description: 'For transients bright enough for amateur equipment, targeted notifications to registered stations under clear skies, difference images for verification, and uploaded photometry grouped onto the event timeline.' },
  { id: '39', area: 'access', status: 'ahead', category: 'feature',
    title: 'Installable App & Push Notifications',
    description: 'An installable mobile app with push notifications for followed events, once the subscription model underneath it is in place.' },
];

export const STATUS_LABEL: Record<RoadmapStatus, string> = {
  held: 'Held',
  crossing: 'Crossing',
  ahead: 'Ahead',
};

export const STATUS_LEGEND: Array<{ status: RoadmapStatus; text: string }> = [
  { status: 'held', text: 'Held — running today' },
  { status: 'crossing', text: 'Being crossed now' },
  { status: 'ahead', text: 'Ahead, unwalked' },
];
