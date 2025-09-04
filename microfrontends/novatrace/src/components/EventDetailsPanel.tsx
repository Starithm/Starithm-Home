import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
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
  Database,
  Image as ImageIcon
} from 'lucide-react';
import { API_ENDPOINTS } from '../../../../shared/lib/config';
import { AlertDetails } from './AlertDetails';
import { Alert } from '@shared/types';
import {
  SidePanel,
  PanelContainer,
  PanelHeader,
  HeaderLeft,
  ContentScroll,
  ContentInner,
  StatsGrid,
  StatBox,
  StatNumber,
  StatLabel,
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
} from '../styled_components/EventDetailsPanel.styled';


// Constants for table keys to display
const STREAM_ALERT_TABLE_KEYS = [
  'canonicalId',
  'alertKind', 
  'sourceName',
  'raDeg',
  'decDeg',
  'posErrorDeg',
  'phase',
  't0',
  'receivedAt',
  'instrument',
  
  'hasSkymap',
  'messenger',
  'rate_snr',
  'far',
  'alert_tense',
  'classification',
  'data_archive_page',
  'rate_energy_range'
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
  posErrorDeg: {
    type: string;
    radius: number;
  };
  hasSkymap: boolean;
  links: Record<string, any>;
  classification: Record<string, any>;
  metadata: Record<string, any>;
  payload: Record<string, any>;
  payloadSha256: string;
  createdAt: string;
  updatedAt: string;
}

interface EventDetailsResponse {
  stream: StreamAlert[];
  textual: Alert[];
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

export function EventDetailsPanel({ eventId, isOpen, onClose }: EventDetailsPanelProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCircular, setSelectedCircular] = useState<Alert | null>(null);

  const { data: eventDetails, isLoading, error } = useQuery({
    queryKey: ['eventDetails', eventId],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.eventDetails(eventId));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data as EventDetailsResponse;
    },
    enabled: !!eventId && isOpen,
  });

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
      })
    };
  };

  const formatCoordinate = (value: number, type: 'ra' | 'dec') => {
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
  };

  const getEventTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'grb':
      case 'gamma-ray burst':
        return 'destructive';
      case 'gw':
      case 'gravitational wave':
        return 'default';
      case 'neutrino':
        return 'secondary';
      case 'supernova':
        return 'outline';
      case 'flare':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Get the latest stream alert
  const latestStreamAlert = eventDetails?.stream?.[0];

  // Get PNG links from the latest stream alert
  const getSkymapLinks = (links: Record<string, any>) => {
    return links?.skymap ? 
      Object.entries(links.skymap)
        .filter(([key, value]) => 
          typeof value === 'string' && 
          (value.toLowerCase().includes('.png') || key.toLowerCase().includes('png'))
        )
        .map(([key, value]) => ({ key, url: value as string })) : [];
  };
  const skymapLinks = getSkymapLinks(latestStreamAlert?.links || {});

  // Combine stream alerts and textual circulars chronologically
  const timelineItems: TimelineItem[] = React.useMemo(() => {
    if (!eventDetails) return [];
    console.log("eventDetails",eventDetails);

    const items: TimelineItem[] = [
      // Add stream alerts
      ...eventDetails.stream.map(alert => ({
        id: `stream-${alert.id}`,
        type: 'stream_alert' as const,
        timestamp: alert.t0,
        data: {...alert, ...alert.metadata}
      })),
      // Add textual circulars
      ...eventDetails.textual.map(circular => ({
        id: `textual-${circular.id}`,
        type: 'textual_circular' as const,
        timestamp: circular.date,
        data: circular
      }))
    ];

    // Sort chronologically
    return items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [eventDetails]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <SidePanel>
        <PanelContainer>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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

  return (
    <SidePanel>
      <PanelContainer>
        {/* Header */}
        <PanelHeader>
          <HeaderLeft>
            <Database className="h-5 w-5" />
            <span>Event Details - {eventId}</span>
          </HeaderLeft>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </PanelHeader>

        {/* Content */}
        <ContentScroll>
          <ContentInner>
            {/* Summary Stats */}
            <StatsGrid>
              <StatBox>
                <StatNumber>{eventDetails.stream.length}</StatNumber>
                <StatLabel>Alerts</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>{eventDetails.textual.length}</StatNumber>
                <StatLabel>Circulars</StatLabel>
              </StatBox>
            </StatsGrid>

            {/* Latest Stream Alert Table */}
            {latestStreamAlert && (
              <Card className='m-4 border-none'>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Latest Info
                  </CardTitle>
                </CardHeader>
                <CardContent className='m-4'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Key</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {STREAM_ALERT_TABLE_KEYS.map(key => {
                        const value = latestStreamAlert[key as keyof StreamAlert];
                        if (value === null || value === undefined) return null;
                        
                        let displayValue = value;
                        if (key === 't0' || key === 'receivedAt') {
                          displayValue = new Date(value as string).toLocaleString();
                        } else if (key === 'raDeg' || key === 'decDeg') {
                          displayValue = formatCoordinate(value as number, key === 'raDeg' ? 'ra' : 'dec');
                        } else if (key === 'hasSkymap') {
                          displayValue = value ? 'Yes' : 'No';
                        } else if (typeof value === 'object') {
                            displayValue = '';
                            console.log("object",value);
                            if (Array.isArray(value)) {
                              displayValue = value.map(v => v.toString()).join(', ');
                            } else {    
                            Object.keys(value as Record<string, any>).forEach(k => {
                                displayValue += `${k}: ${(value as Record<string, any>)[k]?.toString() || 'null'}, `;
                              });
                              displayValue = displayValue.slice(0, -2); // Remove trailing comma and space
                            }
                          }
                          if (displayValue === '') {
                            return null;
                          }
                        console.log(key, displayValue, typeof value);
                        
                                                 return (
                           <TableRow key={key}>
                             <TableCell className="font-medium">{key}</TableCell>
                             <TableCell className="max-w-xs break-words">
                               {typeof displayValue === 'string' ? displayValue : String(displayValue)}
                             </TableCell>
                           </TableRow>
                         );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* PNG Links */}
            {skymapLinks.length > 0 && (
              <Card className="border-none mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Skymaps ({skymapLinks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card className="border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline ({timelineItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineList>
                  {timelineItems.map((item, index) => {
                    const { date, time } = formatTimestamp(item.timestamp);
                    const isExpanded = expandedItems.has(item.id);
                    const isStreamAlert = item.type === 'stream_alert';
                    const isTextualCircular = item.type === 'textual_circular';

                    return (
                      <TimelineItemCard key={item.id}>
                        <TimelineItemContent>
                          <ItemRow>
                            {/* Timeline indicator */}
                            <IndicatorCol>
                              <IndicatorDot />
                              {index < timelineItems.length - 1 && (<IndicatorConnector />)}
                            </IndicatorCol>

                            {/* Content */}
                            <ItemContent>
                              <ItemHeader>
                                <ItemHeaderLeft>
                                  {isStreamAlert ? (
                                    <Activity className="h-4 w-4 text-primary" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-secondary" />
                                  )}
                                  <span>{isStreamAlert ? 'Alert' : 'Circular'}</span>
                                  {isStreamAlert && (
                                    <Badge variant='default'>
                                      {(item.data as StreamAlert).alertKind}
                                    </Badge>
                                  )}
                                  {isTextualCircular && (
                                    <Badge variant="outline">
                                      {(item.data as Alert).alertKey}
                                    </Badge>
                                  )}
                                </ItemHeaderLeft>
                                <ItemTimestamp>
                                  {date} {time}
                                </ItemTimestamp>
                              </ItemHeader>

                              {/* Stream Alert Content - Tabular Format */}
                              {isStreamAlert && (
                                <StreamContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Key</TableHead>
                                        <TableHead>Value</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {STREAM_ALERT_TABLE_KEYS.map(key => {
                                        const value = (item.data as StreamAlert)[key as keyof StreamAlert];
                                        if (value === null || value === undefined) return null;
                                        
                                        let displayValue = value;
                                        if (key === 't0' || key === 'receivedAt') {
                                          displayValue = new Date(value as string).toLocaleString();
                                        } else if (key === 'raDeg' || key === 'decDeg') {
                                          displayValue = formatCoordinate(value as number, key === 'raDeg' ? 'ra' : 'dec');
                                                                                 } else if (key === 'hasSkymap') {
                                           displayValue = value ? 'Yes' : 'No';
                                         } else if (typeof value === 'object') {
                                           displayValue = '';
                                           Object.keys(value as Record<string, any>).forEach(k => {
                                             displayValue += `${k}: ${(value as Record<string, any>)[k]?.toString() || 'null'}, `;
                                           });
                                           displayValue = displayValue.slice(0, -2); // Remove trailing comma and space
                                         }
                                         
                                         return (
                                           <TableRow key={key}>
                                             <TableCell className="font-medium">{key}</TableCell>
                                             <TableCell className="max-w-xs break-words">
                                               {typeof displayValue === 'string' ? displayValue : String(displayValue)}
                                             </TableCell>
                                           </TableRow>
                                         );
                                      })}
                                    </TableBody>
                                  </Table>
                                  <ImageGrid>
                                  {getSkymapLinks((item.data as StreamAlert)?.links || {}).map((link, index) => (
                                    <ImageItem key={index}>
                                      <SkymapImage
                                        src={link.url}
                                        alt={link.key}
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                      />
                                    </ImageItem>
                                  ))}
                                </ImageGrid>

                                  {/* Metadata
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleExpanded(item.id)}
                                    className="h-auto p-0 text-left"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4 mr-1" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 mr-1" />
                                    )}
                                    Show Metadata
                                  </Button>

                                  {isExpanded && (
                                    <div className="mt-2 p-3 bg-muted/50 rounded-lg text-xs">
                                      <pre className="whitespace-pre-wrap overflow-x-auto">
                                        {JSON.stringify((item.data as StreamAlert).metadata, null, 2)}
                                      </pre>
                                    </div>
                                  )} */}
                                </StreamContent>
                              )}

                              {/* Textual Circular Content - Use EventDetails component */}
                              {isTextualCircular && (
                                <TextualContainer>
                                  <TextualMetaRow>
                                    <TextualMetaItem>
                                      <Users className="h-3 w-3" />
                                      <span>{(item.data as Alert).data.authors.authors?.join(', ').slice(0, 100)+'...'}</span>
                                    </TextualMetaItem>
                                    <TextualMetaItem>
                                      <MessageSquare className="h-3 w-3" />
                                      <span>{(item.data as Alert).data.authors.affiliations?.join(', ').slice(0, 100)+'...'}</span>
                                    </TextualMetaItem>
                                  </TextualMetaRow>

                                  <TextualSummary>
                                    {(item.data as Alert).summary}
                                  </TextualSummary>

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
              </CardContent>
            </Card>
          </ContentInner>
        </ContentScroll>
      </PanelContainer>

      {/* Circular Details Modal */}
      {selectedCircular && (
        <ModalOverlay>
          <ModalBackdrop onClick={() => setSelectedCircular(null)} />
          <ModalContainer>
            <ModalHeader>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCircular(null)} className="flex items-center gap-2">
                <X className="h-4 w-4" />
              </Button>
            </ModalHeader>
            <ModalContent>
              <AlertDetails selectedAlert={selectedCircular as Alert} showTimeline={false} onOpenAlertModal={() => {}} js9Loaded={false} />
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </SidePanel>
  );
}
