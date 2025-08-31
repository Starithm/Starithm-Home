import { useState } from 'react';
import { AstronomicalEvent, TimelineItem, StreamAlert, Circular } from '../types/event';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  X, 
  ChevronDown, 
  ChevronRight,
  AlertTriangle,
  Telescope,
  Clock,
  MapPin,
  Activity,
  FileText,
  ExternalLink,
  Users,
  Calendar
} from 'lucide-react';

interface EventDetailsPanelProps {
  event: AstronomicalEvent;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsPanel({ event, isOpen, onClose }: EventDetailsPanelProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

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
    switch (type) {
      case 'GRB': return 'destructive';
      case 'Neutrino': return 'secondary';
      case 'Gravitational Wave': return 'default';
      case 'Supernova': return 'outline';
      case 'Flare': return 'secondary';
      default: return 'outline';
    }
  };

  const { date, time } = formatTimestamp(event.timestamp);

  // Mock timeline data - in real app this would come from the event object
  const mockTimeline: TimelineItem[] = [
    {
      id: '1',
      type: 'stream_alert',
      timestamp: event.timestamp,
      source: event.source,
      data: {
        instrument: 'Swift BAT',
        triggerTime: event.timestamp,
        ra: event.ra,
        dec: event.dec,
        errorRadius: 3.2,
        imageSNR: 12.4,
        energyRange: '15-350 keV',
        netCountRate: 0.85,
        additionalInfo: 'Initial detection trigger'
      } as StreamAlert
    },
    {
      id: '2',
      type: 'circular',
      timestamp: new Date(new Date(event.timestamp).getTime() + 30 * 60000).toISOString(),
      source: 'GCN',
      data: {
        gcnNumber: '35847',
        date: new Date(new Date(event.timestamp).getTime() + 30 * 60000).toISOString(),
        authors: ['J. Swift', 'M. Observer', 'A. Astronomer'],
        summary: 'Swift BAT trigger confirms GRB detection with X-ray afterglow localization',
        telescopes: ['Swift', 'XRT', 'UVOT'],
        rawText: `Swift BAT triggered on GRB ${event.title} at ${time} UT on ${date}. The BAT light curve shows a multi-peaked structure with T90 ~ 45 s. Swift slewed immediately to the BAT position. The XRT began observing the field 68 s after the BAT trigger...`,
        links: ['https://gcn.gsfc.nasa.gov/gcn3/35847.gcn3']
      } as Circular
    },
    {
      id: '3',
      type: 'stream_alert',
      timestamp: new Date(new Date(event.timestamp).getTime() + 45 * 60000).toISOString(),
      source: 'Swift',
      data: {
        instrument: 'Swift XRT',
        triggerTime: new Date(new Date(event.timestamp).getTime() + 45 * 60000).toISOString(),
        ra: event.ra + 0.001,
        dec: event.dec - 0.0005,
        errorRadius: 2.1,
        imageSNR: 8.9,
        energyRange: '0.3-10 keV',
        additionalInfo: 'X-ray afterglow detected'
      } as StreamAlert
    },
    {
      id: '4',
      type: 'circular',
      timestamp: new Date(new Date(event.timestamp).getTime() + 120 * 60000).toISOString(),
      source: 'GCN',
      data: {
        gcnNumber: '35848',
        date: new Date(new Date(event.timestamp).getTime() + 120 * 60000).toISOString(),
        authors: ['K. Optical', 'T. Ground', 'R. Telescope'],
        summary: 'Ground-based optical follow-up observations confirm fading counterpart',
        telescopes: ['Keck', 'Gemini', 'VLT'],
        rawText: `We report ground-based optical observations of ${event.title} using the Keck Observatory. We detect a fading optical counterpart at coordinates RA=${formatCoordinate(event.ra, 'ra')}, Dec=${formatCoordinate(event.dec, 'dec')} with magnitude R=18.2±0.1...`,
        links: ['https://gcn.gsfc.nasa.gov/gcn3/35848.gcn3', 'https://example.com/data']
      } as Circular
    }
  ];

  const sortedTimeline = [...mockTimeline].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const renderStreamAlert = (alert: StreamAlert, itemId: string, timestamp: string) => {
    const isExpanded = expandedItems.has(itemId);
    const { date: alertDate, time: alertTime } = formatTimestamp(timestamp);
    
    return (
      <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(itemId)}>
        <Card className="border-l-4 border-l-primary bg-card/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <div>
                    <CardTitle className="text-base font-medium">Stream Alert</CardTitle>
                    <p className="text-sm text-muted-foreground">{alert.instrument}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-mono">{alertTime} UTC</div>
                    <div className="text-xs text-muted-foreground">{alertDate}</div>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block">RA</span>
                  <span className="font-mono text-xs">{formatCoordinate(alert.ra, 'ra')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Dec</span>
                  <span className="font-mono text-xs">{formatCoordinate(alert.dec, 'dec')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Error Radius</span>
                  <span className="text-foreground">{alert.errorRadius}"</span>
                </div>
                {alert.imageSNR && (
                  <div>
                    <span className="text-muted-foreground block">SNR</span>
                    <span className="text-foreground">{alert.imageSNR}</span>
                  </div>
                )}
                {alert.energyRange && (
                  <div>
                    <span className="text-muted-foreground block">Energy Range</span>
                    <span className="text-foreground">{alert.energyRange}</span>
                  </div>
                )}
                {alert.netCountRate && (
                  <div>
                    <span className="text-muted-foreground block">Count Rate</span>
                    <span className="text-foreground">{alert.netCountRate} cts/s</span>
                  </div>
                )}
              </div>
              {alert.additionalInfo && (
                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">{alert.additionalInfo}</p>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  const renderCircular = (circular: Circular, itemId: string, timestamp: string) => {
    const isExpanded = expandedItems.has(itemId);
    const { date: circularDate, time: circularTime } = formatTimestamp(timestamp);
    
    return (
      <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(itemId)}>
        <Card className="border-l-4 border-l-accent bg-card/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <div>
                    <CardTitle className="text-base font-medium">GCN Circular #{circular.gcnNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">{circular.summary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-mono">{circularTime} UTC</div>
                    <div className="text-xs text-muted-foreground">{circularDate}</div>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{circular.authors.join(', ')}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {circular.telescopes.map((telescope, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {telescope}
                  </Badge>
                ))}
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Full Text
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
                  {circular.rawText}
                </p>
              </div>
              
              {circular.links && circular.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {circular.links.map((link, index) => (
                    <Button key={index} variant="outline" size="sm" className="h-8">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Link {index + 1}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-[600px] bg-background border-l border-border/50 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-card/50">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Event Details</h1>
            <p className="text-sm text-muted-foreground">Complete timeline and analysis</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Event Summary */}
        <div className="p-6 border-b border-border/50 bg-card/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">{event.title}</h2>
              <div className="flex items-center gap-2">
                <Badge variant={getEventTypeColor(event.type)}>{event.type}</Badge>
                <Badge variant="outline">{event.source}</Badge>
                <span className="text-sm text-muted-foreground">#{event.id}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono">{time} UTC</div>
              <div className="text-xs text-muted-foreground">{date}</div>
            </div>
          </div>

          {/* Latest Alert Summary */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Latest Alert Summary
            </h3>
            {event.latestAlert ? (
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instrument:</span>
                  <span className="text-foreground">{event.latestAlert.instrument}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trigger Time:</span>
                  <span className="text-foreground font-mono text-xs">{formatTimestamp(event.latestAlert.triggerTime).time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RA/Dec:</span>
                  <span className="text-foreground font-mono text-xs">
                    {formatCoordinate(event.latestAlert.ra, 'ra')}, {formatCoordinate(event.latestAlert.dec, 'dec')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Error Radius:</span>
                  <span className="text-foreground">{event.latestAlert.errorRadius}"</span>
                </div>
                {event.latestAlert.imageSNR && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Image SNR:</span>
                    <span className="text-foreground">{event.latestAlert.imageSNR}</span>
                  </div>
                )}
                {event.latestAlert.energyRange && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Energy Range:</span>
                    <span className="text-foreground">{event.latestAlert.energyRange}</span>
                  </div>
                )}
                {event.latestAlert.netCountRate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Count Rate:</span>
                    <span className="text-foreground">{event.latestAlert.netCountRate} cts/s</span>
                  </div>
                )}
                {event.latestAlert.additionalInfo && (
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted-foreground">Additional Info:</span>
                    <span className="text-foreground">{event.latestAlert.additionalInfo}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No recent alert data available for this event.
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Combined Timeline
          </h3>
          
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-4 relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border/50" />
              
              {sortedTimeline.map((item, index) => (
                <div key={item.id} className="relative pl-12">
                  {/* Timeline marker */}
                  <div className="absolute left-4 top-6 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center">
                    {item.type === 'stream_alert' ? (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    )}
                  </div>
                  
                  {/* Timeline content */}
                  {item.type === 'stream_alert' 
                    ? renderStreamAlert(item.data as StreamAlert, item.id, item.timestamp)
                    : renderCircular(item.data as Circular, item.id, item.timestamp)
                  }
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}