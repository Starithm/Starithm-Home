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
import { Alert } from '@novatrace/types/Alert';


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
  const skymapLinks = latestStreamAlert?.links?.skymap ? 
    Object.entries(latestStreamAlert.links.skymap)
      .filter(([key, value]) => 
        typeof value === 'string' && 
        (value.toLowerCase().includes('.png') || key.toLowerCase().includes('png'))
      )
      .map(([key, value]) => ({ key, url: value as string })) : [];

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
      <div className="fixed inset-y-0 right-0 w-1/2 z-[9999] bg-background border-l border-border shadow-2xl">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !eventDetails) {
    return (
      <div className="fixed inset-y-0 right-0 w-1/2 z-[9999] bg-background border-l border-border shadow-2xl">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Error Loading Event Details</h3>
            <p className="text-muted-foreground mb-4">
              Unable to load event details. Please try again.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-8 right-0 w-1/2 z-[9999] bg-background border-l border-border shadow-2xl">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-t border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5" />
            <span className="font-semibold">Event Details - {eventId}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-foreground">{eventDetails.stream.length}</div>
                <div className="text-sm text-muted-foreground">Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{eventDetails.textual.length}</div>
                <div className="text-sm text-muted-foreground">Circulars</div>
              </div>
            </div>

            {/* Latest Stream Alert Table */}
            {latestStreamAlert && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Latest Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                  <div className="grid grid-cols-1 gap-4">
                    {skymapLinks.map((link, index) => (
                      <div key={index} className="space-y-4">
                        <img 
                          src={link.url} 
                          alt={link.key}
                          className="w-full max-w-md rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline ({timelineItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timelineItems.map((item, index) => {
                    const { date, time } = formatTimestamp(item.timestamp);
                    const isExpanded = expandedItems.has(item.id);
                    const isStreamAlert = item.type === 'stream_alert';
                    const isTextualCircular = item.type === 'textual_circular';

                    return (
                      <Card key={item.id} className="border-l-3 border-l-secondary-foreground">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Timeline indicator */}
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 bg-starithm-selective-yellow rounded-full"></div>
                              {index < timelineItems.length - 1 && (
                                <div className="w-0.5 h-8 bg-border mt-1"></div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {isStreamAlert ? (
                                    <Activity className="h-4 w-4 text-primary" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-secondary" />
                                  )}
                                  <span className="font-medium">
                                    {isStreamAlert ? 'Alert' : 'Circular'}
                                  </span>
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
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {date} {time}
                                </div>
                              </div>

                              {/* Stream Alert Content - Tabular Format */}
                              {isStreamAlert && (
                                <div className="space-y-2">
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
                                </div>
                              )}

                              {/* Textual Circular Content - Use EventDetails component */}
                              {isTextualCircular && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      <span>{(item.data as Alert).data.authors.authors?.join(', ').slice(0, 100)+'...'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3" />
                                      <span>{(item.data as Alert).data.authors.affiliations?.join(', ').slice(0, 100)+'...'}</span>
                                    </div>
                                  </div>

                                  <p className="text-sm text-muted-foreground">
                                    {(item.data as Alert).summary}
                                  </p>

                                  <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setSelectedCircular(item.data as Alert)}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Circular Details Modal */}
      {selectedCircular && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCircular(null)} />
          <div className="relative w-full max-w-7xl h-[90vh] bg-background border border-border shadow-2xl rounded-lg flex flex-col z-[10001]">
            {/* Modal Header with Close Button */}
            <div className="flex justify-end p-4 border-b border-border bg-background flex-shrink-0">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedCircular(null)}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* Modal Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <AlertDetails 
                selectedAlert={selectedCircular as Alert} 
                showTimeline={false} 
                onOpenAlertModal={() => {}} 
                js9Loaded={false} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
