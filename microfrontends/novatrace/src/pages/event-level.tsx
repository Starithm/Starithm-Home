import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { Event } from '../types/Event';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Badge } from '@shared/components/ui/badge';
import { Calendar as CalendarComponent } from '@shared/components/ui/calendar';


import { 
  Calendar, 
  MapPin, 
  Telescope, 
  Star,
  Activity, 
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw
} from 'lucide-react';
import { API_ENDPOINTS } from '../lib/config';
import { ErrorComponent, Navigation as NavComponent, CelestialSphere } from '@shared/components';
import { getTimeAgo } from '../utils/duration';
import { EventDetailsPanel } from '../components/EventDetailsPanel';

interface EventFilters {
  search: string;
  sourceName: string;
  alertKind: string;
  phase: string;
}

interface DateRange {
  start: string;
  end: string;
}

export default function EventLevel() {
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    sourceName: '',
    alertKind: '',
    phase: ''
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>([]);
  // Helper function to format date in UTC
  const formatDateToUTCString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const [dateRange, setDateRange] = useState<DateRange>({
    start: formatDateToUTCString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    end: formatDateToUTCString(new Date())
  });
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);


  // State for search trigger
  const [searchTrigger, setSearchTrigger] = useState(1); // Start with 1 to trigger initial load

  // Fetch events with all filter parameters
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events', filters, dateRange, selectedSources, selectedAlertTypes, searchTrigger],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.events, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: dateRange.start,
          to: dateRange.end,
          canonicalId: filters.search,
          sourceName: selectedSources.length > 0 ? selectedSources : undefined,
          alertKind: selectedAlertTypes.length > 0 ? selectedAlertTypes : undefined,
          limit: 100,
          offset: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.events || [];
    },
    enabled: searchTrigger > 0, // Only run when search is triggered
  });

  // Use events directly since filtering is done by the API
  const filteredEvents = events;

  // Auto-select first event on initial load
  useEffect(() => {
    if (filteredEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(filteredEvents[0]);
    }
  }, [filteredEvents, selectedEvent]);

  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setDateRange({ start, end });
  };

  const handleClearFilters = () => {
    setSelectedSources([]);
    setSelectedAlertTypes([]);
    setFilters({
      search: '',
      sourceName: '',
      alertKind: '',
      phase: ''
    });
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleEventChange = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleClosePanel = () => {
    setSelectedEvent(null);
  };

  const getEventIcon = (alertKind: string) => {
    switch (alertKind?.toLowerCase()) {
      case 'grb':
      case 'gamma-ray burst':
        return <Star className="h-4 w-4" />;
      case 'gw':
      case 'gravitational wave':
        return <Telescope className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase?.toLowerCase()) {
      case 'initial':
        return 'bg-blue-500';
      case 'update':
        return 'bg-yellow-500';
      case 'final':
        return 'bg-green-500';
      case 'retraction':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
      default:
        return 'outline';
    }
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

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ErrorComponent
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const navigateToAlertLevel = () => {
    window.parent.postMessage({ type: 'navigate', path: '/' }, '*');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 text-foreground select-none">
      

      {/* Header */}
      <div className="bg-card/80 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #770ff5 0%, #A239CA 100%)',
                  boxShadow: '0 8px 32px rgba(119, 15, 245, 0.3)'
                }}
              >
                <span className="text-white font-bold text-lg">NT</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">NovaTrace</h1>
                {/* <p className="text-sm text-muted-foreground">Interactive Celestial Observatory</p> */}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-foreground font-medium">{filteredEvents.length} Events</div>
                <div className="text-xs text-muted-foreground">
                  {dateRange.start} to {dateRange.end}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: 'linear-gradient(45deg, #FFB400, #FF9F43)',
                    boxShadow: '0 0 8px rgba(255, 180, 0, 0.6)'
                  }}
                ></div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="px-6 py-2">
          {/* <NavComponent
            items={[
                          { href: "/novatrace", label: "Alert Level Dashboard", icon: <Activity className="h-4 w-4"  />, variant: "ghost" },
            // { href: "/novatrace/events", label: "Event Level Dashboard", icon: <Calendar className="h-4 w-4" /> },
            // { href: "/novatrace/status", label: "System Status", icon: <BarChart3 className="h-4 w-4" /> },
            ]}
          /> */}
          <Button 
            variant="outline" 
            size="lg"
            hasIcon={true}
            onClick={navigateToAlertLevel}
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Alert Level Dashboard</span>
          </Button>
        </div>
        
        {/* Timeline Picker */}
        <div className="px-8 py-3" style={{ zIndex: 999999 }}>
          <div className="flex items-center gap-6 w-full">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Timeline</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarComponent
                  selected={dateRange.start ? new Date(dateRange.start) : undefined}
                  onSelect={(date) => {
                    console.log("selected start date", date);
                    if (date) {
                      handleDateRangeChange(formatDateToUTCString(date), dateRange.end);
                    }
                  }}
                  label="Start Date"
                  initialFocus={false}
                />
              <span className="text-muted-foreground">to</span>
              <CalendarComponent
                  selected={dateRange.end ? new Date(dateRange.end) : undefined}
                  onSelect={(date) => {
                    console.log("selected end date in eventlevel", date);
                    if (date) {
                      handleDateRangeChange(dateRange.start, formatDateToUTCString(date));
                    }
                  }}
                  label="End Date"
                  initialFocus={false}
                />
            </div>
                          <Input
                placeholder="Search by name or id"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-48"
              />
              <Button 
                variant="default" 
                size="lg" 
                onClick={() => setSearchTrigger(prev => prev + 1)}
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <RotateCcw className="h-6 w-6" />
              </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-[calc(100vh-120px)]">
        {/* Interactive Celestial Sphere - Full Width */}
        {/** Show a "Drag the globe to navigate" message on the top right corner  */}
        {/* <div className="absolute top-4 right-4 text-xs text-muted-foreground/60">
          <span>Drag the globe to navigate</span>
        </div> */}
        <div className="h-full p-6">
          <CelestialSphere
            events={filteredEvents}
            onEventClick={handleEventClick}
            selectedEvent={selectedEvent}
            className="w-full h-full"
          />
        </div>

        {/* Floating Event Panel */}
        {selectedEvent && (
          <div className="absolute top-6 left-6 z-50">
            <div 
              className="w-96 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Header */}
              <div className="pt-2 ml-2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="lg"
                    disabled={filteredEvents.indexOf(selectedEvent) === 0}
                    onClick={() => {
                      const currentIndex = filteredEvents.indexOf(selectedEvent);
                      if (currentIndex > 0) {
                        handleEventChange(filteredEvents[currentIndex - 1]);
                      }
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {filteredEvents.indexOf(selectedEvent) + 1} of {filteredEvents.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="lg"
                    disabled={filteredEvents.indexOf(selectedEvent) === filteredEvents.length - 1}
                    onClick={() => {
                      const currentIndex = filteredEvents.indexOf(selectedEvent);
                      if (currentIndex < filteredEvents.length - 1) {
                        handleEventChange(filteredEvents[currentIndex + 1]);
                      }
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #770ff5 0%, #A239CA 100%)'
                      }}
                    >
                      {getEventIcon(selectedEvent.alertKind)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {selectedEvent.canonicalId || selectedEvent.id}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedEvent.sourceName} • {selectedEvent.alertKind}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Event Type Badge */}
                <div className="flex items-center gap-2">
                  <Badge variant={'default'}>
                    {selectedEvent.alertKind}
                  </Badge>
                  {
                    selectedEvent.phase && (
                      <Badge 
                        variant="outline" 
                        className={`${getPhaseColor(selectedEvent.phase)} text-white`}
                      >
                        {selectedEvent.phase}
                      </Badge>
                    )
                  }
                  
                  
                </div>

                {/* Timing */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Timing</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">T0:</span>
                      <span>{new Date(selectedEvent.t0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Ago:</span>
                      <span>{getTimeAgo(new Date(selectedEvent.t0))}</span>
                    </div>
                  </div>
                </div>

                {/* Position */}
                {selectedEvent.raDeg && selectedEvent.decDeg && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Position</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RA:</span>
                        <span className="font-mono">{formatCoordinate(selectedEvent.raDeg, 'ra')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dec:</span>
                        <span className="font-mono">{formatCoordinate(selectedEvent.decDeg, 'dec')}</span>
                      </div>
                      {/* {selectedEvent.posErrorDeg && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Error:</span>
                          <span className="font-mono">{selectedEvent.posErrorDeg.toFixed(2)}°</span>
                        </div>
                      )} */}
                    </div>
                  </div>
                )}

                

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setShowEventDetailsModal(true)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Status Bar */}
      <div className="bg-card/60 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Coordinate System: J2000.0 Equatorial</span>
            <span>•</span>
            <span>Observer: Geocentric</span>
            {/* <span>•</span> */}
            {/* <span>Last Update: {new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' })} UTC</span> */}
            {selectedEvent && (
              <>
                <span>•</span>
                <span className="text-primary-foreground">Selected: {selectedEvent.canonicalId || selectedEvent.id}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>Connected: Swift, Fermi, LIGO, IceCube</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Panel */}
      <EventDetailsPanel 
        eventId={selectedEvent?.canonicalId || selectedEvent?.id || ''} 
        isOpen={showEventDetailsModal} 
        onClose={() => setShowEventDetailsModal(false)} 
      />
    </div>
  );
}
