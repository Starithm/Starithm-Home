import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@shared/types';
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
import { API_ENDPOINTS } from '@shared/lib/config';
import { ErrorComponent, Navigation as NavComponent, CelestialSphere } from '@shared/components';
import { getTimeAgo } from '../utils/duration';
import { EventDetailsPanel } from '../components/EventDetailsPanel';
import {
  EventLevelContainer,
  Header,
  HeaderContent,
  HeaderTop,
  HeaderLeft,
  LogoContainer,
  LogoText,
  HeaderTitle,
  HeaderRight,
  EventCount,
  EventCountNumber,
  EventCountDate,
  LiveIndicator,
  LiveDot,
  LiveText,
  Navigation,
  TimelinePicker,
  TimelineContent,
  TimelineLabel,
  TimelineIcon,
  TimelineText,
  DateRangeContainer,
  DateRangeSeparator,
  CelestialSphereContainer,
  FloatingEventPanel,
  EventPanel,
  EventPanelHeader,
  EventPanelContent,
  EventPanelTop,
  EventPanelLeft,
  EventIconContainer,
  EventTitle,
  EventSubtitle,
  EventPanelBody,
  BadgeContainer,
  SectionContainer,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  SectionContent,
  SectionRow,
  SectionLabel,
  SectionValue,
  ActionsContainer,
  StatusBar,
  StatusContent,
  StatusLeft,
  StatusItem,
  StatusSeparator,
  StatusSelected,
  StatusRight,
  ConnectionStatus,
  StatusDots,
  StatusDot,
} from '../styled_pages';
import { ErrorContainer, MainContent } from '../styled_components';

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
  const filteredEvents: Event[] = events;

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
        return <Star size={16} />;
      case 'gw':
      case 'gravitational wave':
        return <Telescope size={16} />;
      default:
        return <MapPin size={16} />;
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
      <ErrorContainer>
        <ErrorComponent
          onRetry={() => window.location.reload()}
        />
      </ErrorContainer>
    );
  }

  const navigateToAlertLevel = () => {
    const target = '/novatrace/alerts';
    // If embedded in a host, ask parent to navigate
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', path: target }, '*');
    } else {
      // Fallback: navigate within microfrontend (works in standalone dev)
      window.location.href = `${target}`;
    }
  };

  return (
    <EventLevelContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderTop>
            <HeaderLeft>
              <LogoContainer>
                <LogoText>NT</LogoText>
              </LogoContainer>
              <HeaderTitle>NovaTrace</HeaderTitle>
            </HeaderLeft>
            <HeaderRight>
              <EventCount>
                <EventCountNumber>{filteredEvents.length} Events</EventCountNumber>
                <EventCountDate>
                  {dateRange.start} to {dateRange.end}
                </EventCountDate>
              </EventCount>
              <LiveIndicator>
                <LiveDot />
                <LiveText>Live</LiveText>
              </LiveIndicator>
            </HeaderRight>
          </HeaderTop>
        </HeaderContent>
        
        {/* Navigation */}
        <Navigation>
          <Button 
            variant="outline" 
            size="lg"
            hasIcon={true}
            onClick={navigateToAlertLevel}
            className="flex items-center space-x-2"
          >
            <Activity size={16} />
            <span>Alert Level Dashboard</span>
          </Button>
        </Navigation>
        
        {/* Timeline Picker */}
        <TimelinePicker>
          <TimelineContent>
            <TimelineLabel>
              <TimelineIcon>
                <Calendar size={16} />
              </TimelineIcon>
              <TimelineText>Timeline</TimelineText>
            </TimelineLabel>
            <DateRangeContainer>
              <CalendarComponent
                mode="single"
                selected={dateRange.start ? new Date(dateRange.start) : undefined}
                onSelect={(date) => {
                  // console.log("selected start date", date);
                  if (date) {
                    handleDateRangeChange(formatDateToUTCString(date), dateRange.end);
                  }
                }}
                initialFocus={false}
              />
              <DateRangeSeparator>to</DateRangeSeparator>
              <CalendarComponent
                mode="single"
                selected={dateRange.end ? new Date(dateRange.end) : undefined}
                onSelect={(date) => {
                  // console.log("selected end date in eventlevel", date);
                  if (date) {
                    handleDateRangeChange(dateRange.start, formatDateToUTCString(date));
                  }
                }}
                initialFocus={false}
              />
            </DateRangeContainer>
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
              <RotateCcw size={24} />
            </Button>
          </TimelineContent>
        </TimelinePicker>
      </Header>

      {/* Main Content */}
      <MainContent>
        <CelestialSphereContainer>
          <CelestialSphere
            events={filteredEvents}
            onEventClick={handleEventClick}
            selectedEvent={selectedEvent}
            className="w-full h-full"
          />
        </CelestialSphereContainer>

        {/* Floating Event Panel */}
        {selectedEvent && (
          <FloatingEventPanel>
            <EventPanel>
              {/* Header */}
              <EventPanelHeader>
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
                  <ChevronLeft size={16} />
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
                  <ChevronRight size={16} />
                </Button>
              </EventPanelHeader>
              <EventPanelContent>
                <EventPanelTop>
                  <EventPanelLeft>
                    <EventIconContainer>
                      {getEventIcon(selectedEvent.alertKind)}
                    </EventIconContainer>
                    <div>
                      <EventTitle>
                        {selectedEvent.canonicalId || selectedEvent.id}
                      </EventTitle>
                      <EventSubtitle>
                        {selectedEvent.sourceName} • {selectedEvent.alertKind}
                      </EventSubtitle>
                    </div>
                  </EventPanelLeft>
                </EventPanelTop>
              </EventPanelContent>

              {/* Content */}
              <EventPanelBody>
                {/* Event Type Badge */}
                <BadgeContainer>
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
                </BadgeContainer>

                {/* Timing */}
                <SectionContainer>
                  <SectionHeader>
                    <SectionIcon>
                      <Clock size={16} />
                    </SectionIcon>
                    <SectionTitle>Timing</SectionTitle>
                  </SectionHeader>
                  <SectionContent>
                    <SectionRow>
                      <SectionLabel>T0:</SectionLabel>
                      <SectionValue>{new Date(selectedEvent.t0).toLocaleString()}</SectionValue>
                    </SectionRow>
                    <SectionRow>
                      <SectionLabel>Time Ago:</SectionLabel>
                      <SectionValue>{getTimeAgo(new Date(selectedEvent.t0))}</SectionValue>
                    </SectionRow>
                  </SectionContent>
                </SectionContainer>

                {/* Position */}
                {selectedEvent.raDeg && selectedEvent.decDeg && (
                  <SectionContainer>
                    <SectionHeader>
                      <SectionIcon>
                        <MapPin size={16} />
                      </SectionIcon>
                      <SectionTitle>Position</SectionTitle>
                    </SectionHeader>
                    <SectionContent>
                      <SectionRow>
                        <SectionLabel>RA:</SectionLabel>
                        <SectionValue>{formatCoordinate(selectedEvent.raDeg, 'ra')}</SectionValue>
                      </SectionRow>
                      <SectionRow>
                        <SectionLabel>Dec:</SectionLabel>
                        <SectionValue>{formatCoordinate(selectedEvent.decDeg, 'dec')}</SectionValue>
                      </SectionRow>
                    </SectionContent>
                  </SectionContainer>
                )}

                {/* Actions */}
                <ActionsContainer>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setShowEventDetailsModal(true)}
                  >
                    Details
                  </Button>
                </ActionsContainer>
              </EventPanelBody>
            </EventPanel>
          </FloatingEventPanel>
        )}
      </MainContent>

      {/* Enhanced Status Bar */}
      <StatusBar>
        <StatusContent>
          <StatusLeft>
            <StatusItem>Coordinate System: J2000.0 Equatorial</StatusItem>
            <StatusSeparator>•</StatusSeparator>
            <StatusItem>Observer: Geocentric</StatusItem>
            {selectedEvent && (
              <>
                <StatusSeparator>•</StatusSeparator>
                <StatusSelected>Selected: {selectedEvent.canonicalId || selectedEvent.id}</StatusSelected>
              </>
            )}
          </StatusLeft>
          <StatusRight>
            <ConnectionStatus>Connected: Swift, Fermi, LIGO, IceCube</ConnectionStatus>
            <StatusDots>
              <StatusDot />
              <StatusDot delay="0.3s" />
              <StatusDot delay="0.6s" />
            </StatusDots>
          </StatusRight>
        </StatusContent>
      </StatusBar>

      {/* Event Details Panel */}
      <EventDetailsPanel 
        eventId={selectedEvent?.canonicalId || selectedEvent?.id || ''} 
        isOpen={showEventDetailsModal} 
        onClose={() => setShowEventDetailsModal(false)} 
      />
    </EventLevelContainer>
  );
}
