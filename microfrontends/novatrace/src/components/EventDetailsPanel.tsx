import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@shared/components/ui/button';
import { Badge } from '@shared/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/ui/table';
import {
  X,
  AlertTriangle,
  Clock,
  Activity,
  FileText,
  Users,
  MessageSquare,
  Image as ImageIcon,
  MapPin,
  Link as LinkIcon,
  Zap,
} from 'lucide-react';
import { API_ENDPOINTS } from '../../../../shared/lib/config';
import { AlertDetails } from './AlertDetails';
import { Alert } from '@shared/types';
import {
  SidePanel,
  PanelContainer,
  PanelHeader,
  ContentScroll,
  ContentInner,
  ImageGrid,
  ImageItem,
  SkymapImage,
  ModalOverlay,
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalContent,
  TextualContainer,
  TextualMetaRow,
  TextualMetaItem,
  TextualSummary,
  TimelineList,
  TimelineItemCard,
  TimelineItemContent,
  ItemRow,
  IndicatorCol,
  IndicatorDot,
  IndicatorConnector,
  ItemContent,
  ItemHeader,
  ItemHeaderLeft,
  ItemTimestamp,
  StreamContent,
  OverviewSectionCard,
  OverviewSectionHeader,
  OverviewSectionTitle,
  OverviewSectionBody,
  FieldGrid,
  FieldItem,
  FieldLabel,
  FieldValue,
  TabBarContainer,
  TabButton,
  LinkButton,
  PanelHeaderText,
  PanelTitle,
  PanelSubtitle,
  EventIdentitySection,
  EventIdentityLeft,
  EventIdentityName,
  EventIdentityRight,
  EventIdentityTime,
  EventIdentityDate,
  BadgeRow,
} from '../styled_components/EventDetailsPanel.styled';

// Keys shown in timeline stream-alert cards
const STREAM_ALERT_TABLE_KEYS = [
  'canonicalId', 'alertKind', 'sourceName', 'raDeg', 'decDeg', 'posErrorDeg',
  'phase', 't0', 'receivedAt', 'instrument', 'hasSkymap', 'messenger',
  'rate_snr', 'far', 'alert_tense', 'classification', 'data_archive_page', 'rate_energy_range',
];

interface StreamAlert {
  id: string;
  canonicalId: string;
  alertKind: string;
  topic: string;
  sourceName: string;
  phase: string | null;
  t0: string;
  producedAt: string | null;
  receivedAt: string;
  raDeg: number;
  decDeg: number;
  posErrorDeg: { type: string; radius: number } | null;
  hasSkymap: boolean;
  links: Record<string, any>;
  classification: Record<string, any>;
  metadata: Record<string, any>;
  payload: Record<string, any>;
  payloadSha256: string;
  createdAt: string;
  updatedAt: string;
}

interface AISummary {
  headline: string;
  significance: string;
  details: string;
  generatedAt: string;
}

interface EventDetailsResponse {
  stream: StreamAlert[];
  textual: Alert[];
  aiSummary?: AISummary | null;
}

interface TimelineItem {
  id: string;
  type: 'stream_alert' | 'textual_circular';
  timestamp: string;
  data: StreamAlert | Alert;
}

interface EventDetailsPanelProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'timeline' | 'detailed';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' }),
  };
}

function formatCoordinate(value: number, type: 'ra' | 'dec') {
  if (type === 'ra') {
    const hours = Math.floor(value / 15);
    const minutes = Math.floor((value % 15) * 4);
    const seconds = ((value % 15) * 4 - minutes) * 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toFixed(1)}s`;
  } else {
    const degrees = Math.floor(Math.abs(value));
    const minutes = Math.floor((Math.abs(value) % 1) * 60);
    const seconds = ((Math.abs(value) % 1) * 60 - minutes) * 60;
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${degrees.toString().padStart(2, '0')}° ${minutes.toString().padStart(2, '0')}' ${seconds.toFixed(1)}"`;
  }
}

function renderTableValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (key === 't0' || key === 'receivedAt' || key === 'producedAt' || key === 'createdAt' || key === 'updatedAt') {
    return new Date(value as string).toLocaleString();
  }
  if (key === 'raDeg') return formatCoordinate(value as number, 'ra');
  if (key === 'decDeg') return formatCoordinate(value as number, 'dec');
  if (key === 'hasSkymap') return (value as boolean) ? 'Yes' : 'No';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') {
    if (Array.isArray(value)) return (value as unknown[]).map(v => String(v)).join(', ');
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${v ?? 'null'}`)
      .join(', ');
  }
  return String(value);
}

function renderDetailedValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

type Metric = { label: string; value: string };

function getMissionMetrics(alertKind: string, payload: Record<string, any>): Metric[] {
  const metrics: Metric[] = [];
  const p = payload || {};
  const add = (label: string, val: any, unit = '') => {
    if (val != null && val !== '') metrics.push({ label, value: `${val}${unit}` });
  };

  switch (alertKind?.toLowerCase()) {
    case 'grb':
      add('Duration', p.trig_dur, 's');
      add('Significance', p.trig_signif, 'σ');
      if (p.lo_chan_energy != null && p.hi_chan_energy != null) {
        add('Energy Range', `${p.lo_chan_energy}–${p.hi_chan_energy}`, ' keV');
      }
      add('Detectors', p.dets);
      add('Image SNR', p.image_snr);
      add('Rate SNR', p.rate_snr);
      add('Instrument', p.instrument);
      break;
    case 'xray':
      add('Instrument', p.instrument);
      add('Alert Type', p.alert_type);
      add('Net Count Rate', p.net_count_rate);
      add('Image SNR', p.image_snr);
      add('Trigger ID', p.wxt_trigger_id ?? p.fxt_trigger_id);
      break;
    case 'gw':
      if (p.far != null) add('FAR', typeof p.far === 'number' ? p.far.toExponential(2) : p.far, ' /yr');
      if (p.distance_mean_Mpc != null) {
        add('Distance', `${Number(p.distance_mean_Mpc).toFixed(0)} ± ${Number(p.distance_std_Mpc ?? 0).toFixed(0)}`, ' Mpc');
      }
      add('Group', p.group);
      add('Pipeline', p.pipeline);
      add('Search', p.search);
      break;
    case 'neutrino':
      add('Signalness', p.signalness);
      add('Energy', p.energy);
      add('Event Type', p.event_type);
      add('Direction Uncertainty', p.direction_uncertainty);
      break;
    case 'frb':
      add('DM', p.dm, ' pc/cm³');
      add('SNR', p.snr);
      add('Width', p.width, ' ms');
      add('Fluence', p.fluence);
      break;
    default:
      break;
  }
  return metrics;
}

function getExternalLinks(alert: StreamAlert): Array<{ label: string; url: string }> {
  const result: Array<{ label: string; url: string }> = [];
  const l = (alert.links as Record<string, any>) || {};
  const p = (alert.payload as Record<string, any>) || {};

  if (l.gracedb) result.push({ label: 'GraceDB', url: l.gracedb });
  if (l.data_archive_page) result.push({ label: 'Data Archive', url: l.data_archive_page });
  if (p.data_archive_page) result.push({ label: 'Data Archive', url: p.data_archive_page });
  if (p.lightcurve_url) result.push({ label: 'Lightcurve', url: p.lightcurve_url });
  if (l.circular) result.push({ label: 'Circular', url: l.circular });

  return result;
}

function getSkymapLinks(links: Record<string, any>): Array<{ key: string; url: string }> {
  return links?.skymap
    ? Object.entries(links.skymap)
        .filter(([key, value]) =>
          typeof value === 'string' &&
          (value.toLowerCase().includes('.png') || key.toLowerCase().includes('png'))
        )
        .map(([key, value]) => ({ key, url: value as string }))
    : [];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <OverviewSectionCard>
      <OverviewSectionHeader>
        {icon}
        <OverviewSectionTitle>{title}</OverviewSectionTitle>
      </OverviewSectionHeader>
      <OverviewSectionBody>{children}</OverviewSectionBody>
    </OverviewSectionCard>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <FieldItem>
      <FieldLabel>{label}</FieldLabel>
      <FieldValue>{value ?? '—'}</FieldValue>
    </FieldItem>
  );
}

function isImageUrl(url: string): boolean {
  const lower = url.toLowerCase().split('?')[0];
  return lower.endsWith('.png') || lower.endsWith('.gif') || lower.endsWith('.jpg') || lower.endsWith('.jpeg');
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function TabBar({ active, onChange, counts }: {
  active: TabType;
  onChange: (t: TabType) => void;
  counts: { timeline: number };
}) {
  const tabs: { key: TabType; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: `Timeline (${counts.timeline})` },
    { key: 'detailed', label: 'Detailed View' },
  ];
  return (
    <TabBarContainer>
      {tabs.map(tab => (
        <TabButton key={tab.key} $active={active === tab.key} onClick={() => onChange(tab.key)}>
          {tab.label}
        </TabButton>
      ))}
    </TabBarContainer>
  );
}

// ---------------------------------------------------------------------------
// Overview Tab
// ---------------------------------------------------------------------------

function OverviewTab({ alert, aiSummary }: { alert: StreamAlert; aiSummary?: AISummary | null }) {
  const payload = (alert.payload as Record<string, any>) || {};
  const metrics = getMissionMetrics(alert.alertKind, payload);
  const externalLinks = getExternalLinks(alert);
  const skymapLinks = getSkymapLinks(alert.links || {});
  const hasClassification = alert.classification && Object.keys(alert.classification).length > 0;

  const additionalInfo = payload.description || payload.additional_info;

  const significanceColors: Record<string, string> = {
    critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#6b7280',
  };

  return (
    <ContentInner>
      <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1B1818', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {aiSummary ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: significanceColors[aiSummary.significance] || '#6b7280' }}>
                {aiSummary.significance}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{aiSummary.headline}</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>{aiSummary.details}</p>
          </>
        ) : (
          <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', fontStyle: 'italic', textAlign: 'center' }}>
            Analyzing alerts and circulars — summary will appear shortly.
          </p>
        )}
      </div>
      {additionalInfo && (
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted-foreground)', padding: '0.5rem 1rem' }}>
          {String(additionalInfo)}
        </p>
      )}
      {/* Detection */}
      <SectionCard icon={<Clock className="h-3.5 w-3.5" />} title="Detection">
        <FieldGrid>
          <Field label="Trigger Time (T0)" value={(() => { const f = formatTimestamp(alert.t0); return f.date + ' ' + f.time + ' UTC'; })()} />
          <Field label="Received At" value={(() => { const r = formatTimestamp(alert.receivedAt); return r.date + ' ' + r.time + ' UTC'; })()} />
          {alert.producedAt && (
            <Field label="Produced At" value={(() => { const p = formatTimestamp(alert.producedAt!); return p.date + ' ' + p.time + ' UTC'; })()} />
          )}
        </FieldGrid>
      </SectionCard>

      {/* Position */}
      {alert.raDeg != null && alert.decDeg != null && (
        <SectionCard icon={<MapPin className="h-3.5 w-3.5" />} title="Position">
          <FieldGrid>
            <Field label="Right Ascension" value={formatCoordinate(alert.raDeg, 'ra')} />
            <Field label="Declination" value={formatCoordinate(alert.decDeg, 'dec')} />
            <Field label="RA (deg)" value={alert.raDeg.toFixed(5)} />
            <Field label="Dec (deg)" value={alert.decDeg.toFixed(5)} />
            {alert.posErrorDeg && (
              <Field
                label="Error Radius"
                value={`${(alert.posErrorDeg as any).radius}° (${(alert.posErrorDeg as any).type})`}
              />
            )}
          </FieldGrid>
        </SectionCard>
      )}

      {/* Classification */}
      {hasClassification && (
        <SectionCard icon={<Activity className="h-3.5 w-3.5" />} title="Classification">
          <div className="flex flex-col gap-2.5">
            {Object.entries(alert.classification).map(([key, val]) => {
              const prob = typeof val === 'object' && val !== null
                ? ((val as any).probability ?? null)
                : null;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-28 text-sm text-muted-foreground truncate">{key}</span>
                  {prob !== null ? (
                    <>
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${(Number(prob) * 100).toFixed(0)}%` }}
                        />
                      </div>
                      <span className="text-sm w-10 text-right font-mono">
                        {(Number(prob) * 100).toFixed(0)}%
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">{JSON.stringify(val)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* Mission-specific metrics */}
      {metrics.length > 0 && (
        <SectionCard icon={<Zap className="h-3.5 w-3.5" />} title="Key Measurements">
          <FieldGrid>
            {metrics.map(m => (
              <Field key={m.label} label={m.label} value={m.value} />
            ))}
          </FieldGrid>
        </SectionCard>
      )}

      {/* Skymaps */}
      {skymapLinks.length > 0 && (
        <SectionCard icon={<ImageIcon className="h-3.5 w-3.5" />} title={`Skymaps (${skymapLinks.length})`}>
          <ImageGrid>
            {skymapLinks.map((link, index) => (
              <ImageItem key={index}>
                <SkymapImage
                  src={link.url}
                  alt={link.key}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </ImageItem>
            ))}
          </ImageGrid>
        </SectionCard>
      )}

      {/* External links */}
      {externalLinks.length > 0 && (
        <SectionCard icon={<LinkIcon className="h-3.5 w-3.5" />} title="Links">
          <div className="flex flex-col gap-4">
            {/* Button links (non-image) */}
            {externalLinks.filter(l => !isImageUrl(l.url)).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {externalLinks.filter(l => !isImageUrl(l.url)).map(link => (
                  <LinkButton key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
                    <LinkIcon className="h-3 w-3" />
                    {link.label}
                  </LinkButton>
                ))}
              </div>
            )}
            {/* Image links — render inline */}
            {externalLinks.filter(l => isImageUrl(l.url)).map(link => (
              <div key={link.label} className="flex flex-col gap-1.5">
                <FieldLabel>{link.label}</FieldLabel>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <SkymapImage
                    src={link.url}
                    alt={link.label}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </a>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </ContentInner>
  );
}

// ---------------------------------------------------------------------------
// Detailed View Tab
// ---------------------------------------------------------------------------

function DetailedViewTab({ alert }: { alert: StreamAlert }) {
  const payload = (alert.payload as Record<string, any>) || {};

  return (
    <ContentInner>
      <OverviewSectionCard>
        <OverviewSectionHeader>
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <OverviewSectionTitle>Full Payload</OverviewSectionTitle>
        </OverviewSectionHeader>
        <Table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', backgroundColor: '#1B1818', borderRadius: '0.5rem' }}>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: '40%', padding: '0.75rem 1.25rem' }}>Field</TableHead>
              <TableHead style={{ padding: '0.75rem 1.25rem' }}>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(payload).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--muted-foreground)', verticalAlign: 'top', padding: '0.875rem 1.25rem', wordBreak: 'break-all' }}>{key}</TableCell>
                <TableCell style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '0.875rem 1.25rem', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{renderDetailedValue(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </OverviewSectionCard>
    </ContentInner>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function EventDetailsPanel({ eventId, isOpen, onClose }: EventDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedCircular, setSelectedCircular] = useState<Alert | null>(null);

  const { data: eventDetails, isLoading, error } = useQuery({
    queryKey: ['eventDetails', eventId],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.eventDetails(eventId));
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return (await response.json()) as EventDetailsResponse;
    },
    enabled: !!eventId && isOpen,
  });

  const latestStreamAlert = eventDetails?.stream?.[0];

  const timelineItems: TimelineItem[] = React.useMemo(() => {
    if (!eventDetails) return [];
    const items: TimelineItem[] = [
      ...eventDetails.stream.map(alert => ({
        id: `stream-${alert.id}`,
        type: 'stream_alert' as const,
        timestamp: alert.t0,
        data: { ...alert, ...alert.metadata },
      })),
      ...eventDetails.textual.map(circular => ({
        id: `textual-${circular.id}`,
        type: 'textual_circular' as const,
        timestamp: circular.date,
        data: circular,
      })),
    ];
    return items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [eventDetails]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <SidePanel>
        <PanelContainer>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="mt-4 text-muted-foreground">Loading event details...</p>
            </div>
          </div>
        </PanelContainer>
      </SidePanel>
    );
  }

  if (error || !eventDetails) {
    return (
      <SidePanel>
        <PanelContainer>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Error Loading Event Details</h3>
              <p className="text-muted-foreground mb-4">Unable to load event details. Please try again.</p>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </PanelContainer>
      </SidePanel>
    );
  }

  const t0 = latestStreamAlert ? formatTimestamp(latestStreamAlert.t0) : null;

  return (
    <SidePanel>
      <PanelContainer>
        {/* Header */}
        <PanelHeader>
          <PanelHeaderText>
            <PanelTitle>Event Details</PanelTitle>
            <PanelSubtitle>Complete analysis and timeline</PanelSubtitle>
          </PanelHeaderText>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </PanelHeader>

        {/* Event identity — fixed below header, above tabs */}
        {latestStreamAlert && (
          <EventIdentitySection>
            <EventIdentityLeft>
              <EventIdentityName>{latestStreamAlert.canonicalId}</EventIdentityName>
              <BadgeRow>
                <Badge variant="default">{latestStreamAlert.alertKind}</Badge>
                {latestStreamAlert.phase && <Badge variant="outline">{latestStreamAlert.phase}</Badge>}
                {(latestStreamAlert.sourceName || (latestStreamAlert.payload as Record<string, any>)?.instrument) && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--starithm-veronica)', fontWeight: 500 }}>
                    {latestStreamAlert.sourceName || (latestStreamAlert.payload as Record<string, any>)?.instrument}
                  </span>
                )}
              </BadgeRow>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                {eventDetails.stream.length} notice{eventDetails.stream.length !== 1 ? 's' : ''}
                {' · '}
                {eventDetails.textual.length} circular{eventDetails.textual.length !== 1 ? 's' : ''}
              </span>
            </EventIdentityLeft>
            {t0 && (
              <EventIdentityRight>
                <EventIdentityTime>{t0.time} UTC</EventIdentityTime>
                <EventIdentityDate>{t0.date}</EventIdentityDate>
              </EventIdentityRight>
            )}
          </EventIdentitySection>
        )}

        {/* Tabs */}
        <TabBar
          active={activeTab}
          onChange={setActiveTab}
          counts={{ timeline: timelineItems.length }}
        />

        {/* Tab content */}
        <ContentScroll>
          {/* Overview */}
          {activeTab === 'overview' && latestStreamAlert && (
            <OverviewTab alert={latestStreamAlert} aiSummary={eventDetails?.aiSummary} />
          )}

          {/* Timeline */}
          {activeTab === 'timeline' && (
            <ContentInner>
              <TimelineList>
                {timelineItems.map((item, index) => {
                  const { date, time } = formatTimestamp(item.timestamp);
                  const isStreamAlert = item.type === 'stream_alert';
                  const isTextualCircular = item.type === 'textual_circular';

                  return (
                    <TimelineItemCard key={item.id}>
                      <TimelineItemContent>
                        <ItemRow>
                          <IndicatorCol>
                            <IndicatorDot />
                            {index < timelineItems.length - 1 && <IndicatorConnector />}
                          </IndicatorCol>
                          <ItemContent>
                            <ItemHeader>
                              <ItemHeaderLeft>
                                {isStreamAlert
                                  ? <Activity className="h-4 w-4 text-primary" />
                                  : <FileText className="h-4 w-4 text-secondary" />}
                                <span>{isStreamAlert ? 'Alert' : 'Circular'}</span>
                                {isStreamAlert && (
                                  <Badge variant="default">{(item.data as StreamAlert).alertKind}</Badge>
                                )}
                                {isTextualCircular && (
                                  <Badge variant="outline">{(item.data as Alert).alertKey}</Badge>
                                )}
                              </ItemHeaderLeft>
                              <ItemTimestamp>{date} {time}</ItemTimestamp>
                            </ItemHeader>

                            {isStreamAlert && (() => {
                              const sa = item.data as StreamAlert;
                              const payload = (sa.payload as Record<string, any>) || {};
                              const source = sa.sourceName || payload.instrument;
                              const pos = sa.raDeg != null && sa.decDeg != null;
                              const t0Fmt = sa.t0 ? formatTimestamp(sa.t0) : null;
                              const skymaps = getSkymapLinks(sa.links || {});

                              return (
                                <StreamContent>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
                                    {source && <span style={{ fontSize: '0.75rem', color: 'var(--starithm-veronica)', fontWeight: 500 }}>{source}</span>}
                                    {sa.phase && <Badge variant="outline">{sa.phase}</Badge>}
                                    {sa.hasSkymap && <Badge variant="outline">Skymap</Badge>}
                                  </div>

                                  {t0Fmt && (
                                    <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                                      T0: {t0Fmt.date} {t0Fmt.time} UTC
                                    </span>
                                  )}

                                  {pos && (
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                                      <span>RA {formatCoordinate(sa.raDeg, 'ra')}</span>
                                      <span>Dec {formatCoordinate(sa.decDeg, 'dec')}</span>
                                      {sa.posErrorDeg != null && (
                                        <span>± {typeof sa.posErrorDeg === 'object' ? (sa.posErrorDeg as any).radius : sa.posErrorDeg}°</span>
                                      )}
                                    </div>
                                  )}

                                  {sa.classification && Object.keys(sa.classification).length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                      {Object.entries(sa.classification).map(([k, v]) => (
                                        <span key={k} style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>
                                          {k}: {typeof v === 'number' ? `${(v * 100).toFixed(1)}%` : String(v)}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {skymaps.length > 0 && (
                                    <ImageGrid>
                                      {skymaps.map((link, i) => (
                                        <ImageItem key={i}>
                                          <SkymapImage
                                            src={link.url}
                                            alt={link.key}
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                          />
                                        </ImageItem>
                                      ))}
                                    </ImageGrid>
                                  )}
                                </StreamContent>
                              );
                            })()}

                            {isTextualCircular && (
                              <TextualContainer>
                                <TextualMetaRow>
                                  <TextualMetaItem>
                                    <Users className="h-3 w-3" />
                                    <span>{(item.data as Alert).data.authors.authors?.join(', ').slice(0, 100) + '...'}</span>
                                  </TextualMetaItem>
                                  <TextualMetaItem>
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{(item.data as Alert).data.authors.affiliations?.join(', ').slice(0, 100) + '...'}</span>
                                  </TextualMetaItem>
                                </TextualMetaRow>
                                <TextualSummary>{(item.data as Alert).summary}</TextualSummary>
                                <Button
                                  variant="outline"
                                  size="lg"
                                  onClick={() => setSelectedCircular(item.data as Alert)}
                                >
                                  View Details
                                </Button>
                              </TextualContainer>
                            )}
                          </ItemContent>
                        </ItemRow>
                      </TimelineItemContent>
                    </TimelineItemCard>
                  );
                })}
              </TimelineList>
            </ContentInner>
          )}

          {/* Detailed View */}
          {activeTab === 'detailed' && latestStreamAlert && (
            <DetailedViewTab alert={latestStreamAlert} />
          )}
        </ContentScroll>
      </PanelContainer>

      {/* Circular Details Modal */}
      {selectedCircular && (
        <ModalOverlay>
          <ModalBackdrop onClick={() => setSelectedCircular(null)} />
          <ModalContainer>
            <ModalHeader>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCircular(null)}>
                <X className="h-4 w-4" />
              </Button>
            </ModalHeader>
            <ModalContent>
              <AlertDetails
                selectedAlert={selectedCircular as Alert}
                showTimeline={false}
                onOpenAlertModal={() => {}}
                js9Loaded={false}
              />
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </SidePanel>
  );
}
