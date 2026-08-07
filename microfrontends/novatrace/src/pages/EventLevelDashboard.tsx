import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@shared/types';
import { Button } from '@shared/components/ui/button';
import { Badge } from '@shared/components/ui/badge';
import { Calendar as CalendarComponent } from '@shared/components/ui/calendar';

import {
  MapPin,
  Telescope,
  Star,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  RotateCcw,
  ArrowRight,
  Calendar,
  Radio,
  Layers,
  Home as HomeIcon,
  Crosshair,
  Info,
} from 'lucide-react';
import { API_ENDPOINTS } from '@shared/lib/config';
import { ErrorComponent, Navigation as NavComponent, CelestialSphere } from '@shared/components';
import { SignInButton, UserButton, useAuth } from '@clerk/react';
import { saveReturnUrl } from '@shared/lib/auth';
import { getTimeAgo } from '../utils/duration';
import { EventsTable } from '../components/EventsTable';
import { NearbyPanel } from '../components/NearbyPanel';
import { ActivityRibbon } from '../components/ActivityRibbon';
import { posErrorRadius, hasPosition } from '../utils/sky';
import { kindColor, sigColor } from '@shared/utils/eventColors';
import {
  EventLevelContainer,
  Header,
  HeaderContent,
  HeaderTop,
  HeaderLeft,
  BrandLink,
  BrandMark,
  BrandWordmark,
  BrandDivider,
  HeaderTitle,
  HeaderRight,
  ViewToggle,
  ViewToggleOption,
  EventCount,
  EventCountNumber,
  EventCountDate,
  LiveIndicator,
  LiveDot,
  LiveText,
  Navigation,
  SearchSection,
  SearchBarWrapper,
  SearchBarInput,
  SearchBarSendButton,
  SearchErrorText,
  FilterPillsRow,
  FilterPillWrapper,
  FilterPill,
  PillDropdownItem,
  DateRangeContainer,
  DateRangeSeparator,
  CardMetaLine,
  CardGrid,
  CardField,
  CardFieldLabel,
  CardFieldValue,
  AiBlock,
  AiLabel,
  AiText,
  CardActions,
  PrimaryAction,
  Pager,
  RecordHint,
  SignInPrompt,
  SignInAction,
  KindChip,
  SigTag,
  CelestialSphereContainer,
  FloatingEventPanel,
  SheetHandle,
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

type ViewMode = 'globe' | 'list';

/* Matches the 640px breakpoint the panel's CSS uses. use-mobile.tsx exists but is
   pinned to 768px, and the sheet has to agree with its own stylesheet. */
function useIsSheetWidth() {
  const [isSheet, setIsSheet] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const onChange = () => setIsSheet(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return isSheet;
}

/* The record page is the canonical destination for a single event — the old
   in-page modal duplicated it badly. It opens in a new tab so the dashboard keeps
   its filters, scroll position and selection; comparing several events against
   one filtered window is the normal way this page gets used. */
const recordHref = (canonicalId: string) => `/novatrace/events/${canonicalId}`;

function openRecord(canonicalId: string) {
  window.open(recordHref(canonicalId), '_blank', 'noopener,noreferrer');
}

export default function EventLevel() {
  const { isSignedIn } = useAuth();
  const getDeepLinkId = () => new URLSearchParams(window.location.search).get('id') || null;

  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    sourceName: '',
    alertKind: '',
    phase: ''
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>([]);
  const [nlQuery, setNlQuery] = useState('');
  const [nlLoading, setNlLoading] = useState(false);
  const [nlError, setNlError] = useState<string | null>(null);
  const [semanticQuery, setSemanticQuery] = useState<string | null>(null);
  const [openPill, setOpenPill] = useState<'date' | 'types' | 'instruments' | 'sky' | null>(null);
  const [coneSearch, setConeSearch] = useState<{ raDeg: number; decDeg: number; radiusDeg: number } | null>(null);
  const [coneRa, setConeRa] = useState('');
  const [coneDec, setConeDec] = useState('');
  const [coneRadius, setConeRadius] = useState('');
  const pillsRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);
  const instrumentsRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const portalDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  // Helper function to format date in UTC
  const formatDateToUTCString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const [dateRange, setDateRange] = useState<DateRange>({
    start: formatDateToUTCString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    end: formatDateToUTCString(new Date())
  });
  const [view, setView] = useState<ViewMode>('globe');
  const isSheetWidth = useIsSheetWidth();


  // State for search trigger
  const [searchTrigger, setSearchTrigger] = useState(1); // Start with 1 to trigger initial load
  const [filtersModified, setFiltersModified] = useState(false); // Track if filters have been modified

  // Reset filtersModified flag on initial load
  useEffect(() => {
    if (searchTrigger === 1) {
      setFiltersModified(false);
    }
  }, [searchTrigger]);

  // Fetch events with all filter parameters
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events', searchTrigger], // Only depend on searchTrigger
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.events, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromDate: dateRange.start,
          toDate: dateRange.end,
          canonicalId: filters.search || undefined,
          sourceName: selectedSources.length > 0 ? selectedSources : undefined,
          alertKind: selectedAlertTypes.length > 0 ? selectedAlertTypes : undefined,
          ...(coneSearch ? { raDeg: coneSearch.raDeg, decDeg: coneSearch.decDeg, radiusDeg: coneSearch.radiusDeg } : {}),
          ...(semanticQuery ? { semanticQuery } : {}),
          limit: 200,
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

  // Fetch available filter options (source names + alert kinds)
  const { data: filterOptions } = useQuery({
    queryKey: ['eventFilters'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.eventFilters);
      if (!response.ok) return { sourceNames: [], alertKinds: [] };
      return response.json() as Promise<{ sourceNames: string[]; alertKinds: string[] }>;
    },
    staleTime: 5 * 60 * 1000, // re-fetch at most every 5 min
  });

  // Fetch AI summary for selected event
  const { data: selectedEventDetail } = useQuery({
    queryKey: ['eventDetail', selectedEvent?.canonicalId],
    queryFn: async () => {
      if (!selectedEvent?.canonicalId) return null;
      const response = await fetch(API_ENDPOINTS.eventDetails(selectedEvent.canonicalId));
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!selectedEvent?.canonicalId,
    refetchInterval: (query) => query.state.data?.aiSummary ? false : 10000,
  });

  // Use events directly since filtering is done by the API
  const filteredEvents: Event[] = events;

  // Auto-select first event when data changes; honour deep-link ?id= param
  useEffect(() => {
    if (filteredEvents.length === 0) {
      setSelectedEvent(null);
      return;
    }

    const deepLinkId = getDeepLinkId();

    if (deepLinkId && deepLinkId !== selectedEvent?.canonicalId && deepLinkId !== selectedEvent?.id) {
      const match = filteredEvents.find(e => e.canonicalId === deepLinkId || e.id === deepLinkId);
      if (match) {
        // A deep link selects the event; it no longer force-opens a modal on top
        // of the page — the full record has its own URL.
        setSelectedEvent(match);
        return;
      }
    }

    const currentEventExists = selectedEvent && filteredEvents.some(
      e => e.id === selectedEvent.id || e.canonicalId === selectedEvent.canonicalId
    );
    if (!selectedEvent || !currentEventExists) {
      const first = filteredEvents[0];
      setSelectedEvent(first);
      const url = new URL(window.location.href);
      url.searchParams.set('id', first.canonicalId || first.id);
      window.history.replaceState(null, '', url.toString());
    }
  }, [filteredEvents]);

  // Close pill dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inPills = pillsRef.current?.contains(target);
      const inPortal = portalDropdownRef.current?.contains(target);
      // The date picker opens its day grid in its own portal (document.body),
      // so a day click isn't inside portalDropdownRef — don't treat it as an
      // outside click, otherwise the dropdown closes before selection lands.
      const inCalendarPopup = target instanceof Element && !!target.closest('[data-calendar-popup]');
      if (!inPills && !inPortal && !inCalendarPopup) {
        setOpenPill(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setFiltersModified(true);
    console.log("filters", filters);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setDateRange({ start, end });
    setFiltersModified(true);
    console.log("dateRange", dateRange);
  };

  const toggleSource = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
    setSearchTrigger(prev => prev + 1);
  };

  const toggleAlertType = (kind: string) => {
    setSelectedAlertTypes(prev =>
      prev.includes(kind) ? prev.filter(k => k !== kind) : [...prev, kind]
    );
    setSearchTrigger(prev => prev + 1);
  };

  const handleSearch = () => {
    setSearchTrigger(prev => prev + 1);
    setFiltersModified(false);
  };

  const handleNLSearch = async () => {
    if (!nlQuery.trim()) return;
    setNlLoading(true);
    setNlError(null);
    try {
      const res = await fetch(API_ENDPOINTS.nlSearch, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: nlQuery }),
      });
      const data = await res.json();
      if (data.error) {
        setNlError(data.error);
        return;
      }
      const f = data.filters;
      if (f.sourceName) setSelectedSources(f.sourceName);
      if (f.alertKind) setSelectedAlertTypes(f.alertKind);
      if (f.fromDate || f.toDate) {
        setDateRange({
          start: f.fromDate ?? dateRange.start,
          end: f.toDate ?? dateRange.end,
        });
      }
      if (f.canonicalId) handleFilterChange('search', f.canonicalId);
      if (f.raDeg != null && f.decDeg != null && f.radiusDeg != null) {
        setConeSearch({ raDeg: f.raDeg, decDeg: f.decDeg, radiusDeg: f.radiusDeg });
        setConeRa(String(f.raDeg));
        setConeDec(String(f.decDeg));
        setConeRadius(String(f.radiusDeg));
      }
      setSemanticQuery(f.semanticQuery ?? null);
      setFiltersModified(false);
      setSearchTrigger(prev => prev + 1);
    } catch {
      setNlError('Search service unavailable');
    } finally {
      setNlLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedSources([]);
    setSelectedAlertTypes([]);
    setFilters({ search: '', sourceName: '', alertKind: '', phase: '' });
    setNlQuery('');
    setNlError(null);
    setSemanticQuery(null);
    setConeSearch(null);
    setConeRa('');
    setConeDec('');
    setConeRadius('');
    setFiltersModified(false);
    setSearchTrigger(prev => prev + 1);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    const url = new URL(window.location.href);
    url.searchParams.set('id', event.canonicalId || event.id);
    window.history.replaceState(null, '', url.toString());
  };

  const handleEventChange = (event: Event) => {
    setSelectedEvent(event);
    const url = new URL(window.location.href);
    url.searchParams.set('id', event.canonicalId || event.id);
    window.history.replaceState(null, '', url.toString());
  };

  const handleClosePanel = () => {
    setSelectedEvent(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.replaceState(null, '', url.toString());
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

  const formatDatePillLabel = () => {
    const fmt = (d: string) => {
      const [, m, day] = d.split('-');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${months[parseInt(m)-1]} ${parseInt(day)}`;
    };
    return `${fmt(dateRange.start)} – ${fmt(dateRange.end)}`;
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
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', path: target }, '*');
    } else {
      window.location.href = `${target}`;
    }
  };

  const navigateHome = () => {
    const target = '/';
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', path: target }, '*');
    } else {
      window.location.href = target;
    }
  };

  const displayAlertKinds = filterOptions?.alertKinds?.length ? filterOptions.alertKinds : ['grb', 'gw', 'neutrino', 'frb', 'xray'];
  const displaySourceNames = filterOptions?.sourceNames?.length ? filterOptions.sourceNames : ['Fermi GBM', 'Swift BAT', 'IceCube', 'LVK', 'SVOM', 'Einstein Probe WXT', 'CHIME', 'DSA-110'];

  /* One filter bar, two homes: overlaid on the sphere in globe view, in normal
     flow above the table in list view. MainContent is a centred flex row for
     the globe, so a static child there would sit beside the table. */
  const filterBar = (
          <SearchSection ref={pillsRef} $overlay={view === 'globe' && !isSheetWidth}>
            {/* NL search bar */}

            {/* Filter pills */}
            <FilterPillsRow>
              {/* Date range pill */}
              <FilterPillWrapper ref={dateRef}>
                <FilterPill $active onClick={() => { const r = dateRef.current?.getBoundingClientRect(); if (r) setDropdownPos({ top: r.bottom + 6, left: r.left }); setOpenPill(p => p === 'date' ? null : 'date'); }}>
                  <Calendar size={13} />
                  {formatDatePillLabel()}
                  <ChevronDown size={11} />
                </FilterPill>
              </FilterPillWrapper>

              {/* Types pill */}
              <FilterPillWrapper ref={typesRef}>
                <FilterPill
                  $active={selectedAlertTypes.length > 0}
                  onClick={() => { const r = typesRef.current?.getBoundingClientRect(); if (r) setDropdownPos({ top: r.bottom + 6, left: r.left }); setOpenPill(p => p === 'types' ? null : 'types'); }}
                >
                  <Layers size={13} />
                  {selectedAlertTypes.length > 0 ? selectedAlertTypes.join(', ') : 'All types'}
                  <ChevronDown size={11} />
                </FilterPill>
              </FilterPillWrapper>

              {/* Instruments pill */}
              <FilterPillWrapper ref={instrumentsRef}>
                <FilterPill
                  $active={selectedSources.length > 0}
                  onClick={() => { const r = instrumentsRef.current?.getBoundingClientRect(); if (r) setDropdownPos({ top: r.bottom + 6, left: r.left }); setOpenPill(p => p === 'instruments' ? null : 'instruments'); }}
                >
                  <Radio size={13} />
                  {selectedSources.length > 0 ? selectedSources.join(', ') : 'All instruments'}
                  <ChevronDown size={11} />
                </FilterPill>
              </FilterPillWrapper>

              {/* Sky region (cone search) pill */}
              <FilterPillWrapper ref={skyRef}>
                <FilterPill
                  $active={coneSearch !== null}
                  onClick={() => { const r = skyRef.current?.getBoundingClientRect(); if (r) setDropdownPos({ top: r.bottom + 6, left: r.left }); setOpenPill(p => p === 'sky' ? null : 'sky'); }}
                >
                  <Crosshair size={13} />
                  {coneSearch
                    ? `RA ${coneSearch.raDeg}° Dec ${coneSearch.decDeg > 0 ? '+' : ''}${coneSearch.decDeg}° r=${coneSearch.radiusDeg}°`
                    : 'Sky region'}
                  <ChevronDown size={11} />
                </FilterPill>
              </FilterPillWrapper>

              <ActivityRibbon
                events={filteredEvents}
                start={dateRange.start}
                end={dateRange.end}
                onNarrow={(st, en) => { handleDateRangeChange(st, en); setSearchTrigger(pv => pv + 1); }}
              />

              {/* Info — GCN circulars search coming soon */}
              <div
                style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                onMouseEnter={e => { const t = e.currentTarget.lastElementChild as HTMLElement; if (t) t.style.display = 'block'; }}
                onMouseLeave={e => { const t = e.currentTarget.lastElementChild as HTMLElement; if (t) t.style.display = 'none'; }}
              >
                <button style={{ background: 'none', border: 'none', cursor: 'default', color: 'var(--muted-foreground)', padding: '0.2rem 0.15rem', display: 'flex', alignItems: 'center', opacity: 0.45 }}>
                  <Info size={13} />
                </button>
                <div style={{
                  display: 'none',
                  position: 'absolute',
                  bottom: 'calc(100% + 6px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  padding: '0.35rem 0.7rem',
                  fontSize: '0.7rem',
                  color: 'var(--muted-foreground)',
                  whiteSpace: 'nowrap',
                  zIndex: 999999,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                  pointerEvents: 'none',
                }}>
                  Searching across GCN circulars is coming soon
                </div>
              </div>

              {/* Clear button — only when filters active */}
              {(selectedSources.length > 0 || selectedAlertTypes.length > 0 || nlQuery || coneSearch) && (
                <FilterPill onClick={handleClearFilters} style={{ opacity: 0.6 }}>
                  <RotateCcw size={11} />
                  Clear
                </FilterPill>
              )}
            </FilterPillsRow>
          </SearchSection>
  );

  return (
    <EventLevelContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderTop>
            <HeaderLeft>
              <BrandLink href="/" title="Starithm">
                <BrandMark src="/logo_without_name.png" alt="Starithm" width={36} height={36} />
                <BrandWordmark>STARITHM</BrandWordmark>
              </BrandLink>
              <BrandDivider>/</BrandDivider>
              <HeaderTitle>NovaTrace</HeaderTitle>
            </HeaderLeft>
          <SearchBarWrapper>
            <SearchBarInput
              placeholder="Search in natural language — e.g. Fermi GRBs last week with position"
              value={nlQuery}
              onChange={e => { setNlQuery(e.target.value); setNlError(null); }}
              onKeyDown={e => e.key === 'Enter' && handleNLSearch()}
            />
            <SearchBarSendButton
              onClick={handleNLSearch}
              disabled={nlLoading || !nlQuery.trim()}
              title="Search"
            >
              {nlLoading
                ? <RotateCcw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                : <ArrowRight size={14} />
              }
            </SearchBarSendButton>
          </SearchBarWrapper>
          {nlError && <SearchErrorText>{nlError}</SearchErrorText>}
            <HeaderRight>
              <ViewToggle>
                {(['globe', 'list'] as const).map(v => (
                  <ViewToggleOption key={v} $active={view === v} onClick={() => setView(v)}>
                    {v === 'globe' ? 'Globe' : 'List'}
                  </ViewToggleOption>
                ))}
              </ViewToggle>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateHome}
                title="Starithm Home"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <HomeIcon size={18} />
              </Button>
              {!isSignedIn ? (
                <SignInButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : '/'}>
                  <button title="Sign in" onClick={saveReturnUrl} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </button>
                </SignInButton>
              ) : (
                <UserButton afterSignOutUrl="/" />
              )}
            </HeaderRight>
          </HeaderTop>
        </HeaderContent>
        

        {/* Search + filter pills */}
        {(view === 'list' || isSheetWidth) && filterBar}
      </Header>

      {/* Main Content */}
      <MainContent>
        {view === 'list' ? (
          <EventsTable
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onSelect={handleEventClick}
            onOpen={e => openRecord(e.canonicalId || e.id)}
          />
        ) : (
          <>
            <CelestialSphereContainer>
              <CelestialSphere
                events={filteredEvents}
                onEventClick={handleEventClick}
                selectedEvent={selectedEvent}
                coneSearch={coneSearch}
                className="w-full h-full"
              />
            </CelestialSphereContainer>
            <NearbyPanel
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onSelect={handleEventClick}
            />
          </>
        )}

        {/* After the sphere in DOM order: later siblings paint on top, so the bar
            sits above the canvas without depending on z-index. */}
        {view === 'globe' && !isSheetWidth && filterBar}

        {/* Floating Event Panel */}
        {view === 'globe' && selectedEvent && (
          <FloatingEventPanel

          >
            {/* Visual grip only — the expand/collapse behaviour is deferred, so it
                is not a button that does nothing. */}
            <SheetHandle as="div" aria-hidden="true" />
            <EventPanel>
              {/* Header */}
              <EventPanelContent>
                <EventPanelTop>
                  <EventPanelLeft>
                    <EventTitle>{selectedEvent.canonicalId || selectedEvent.id}</EventTitle>
                    <KindChip $color={kindColor(selectedEvent.alertKind)}>
                      {selectedEvent.alertKind}
                    </KindChip>
                  </EventPanelLeft>
                  {selectedEventDetail?.aiSummary?.significance && (
                    <SigTag $color={sigColor(selectedEventDetail.aiSummary.significance)}>
                      {selectedEventDetail.aiSummary.significance}
                    </SigTag>
                  )}
                </EventPanelTop>
              </EventPanelContent>

              {/* Content */}
              <EventPanelBody>
                {(selectedEventDetail?.cross_match?.candidates?.some((c: any) => c.verified)
                  || (selectedEventDetail?.optical_counterparts?.length ?? 0) > 0) && (
                  <BadgeContainer>
                    {selectedEventDetail?.cross_match?.candidates?.some((c: any) => c.verified) && (
                      <Badge variant="outline" style={{ color: '#a855f7', borderColor: '#a855f7' }}>
                        Multi-Messenger
                      </Badge>
                    )}
                    {(selectedEventDetail?.optical_counterparts?.length ?? 0) > 0 && (
                      <Badge variant="outline" style={{ color: '#38bdf8', borderColor: '#38bdf8' }}>
                        {selectedEventDetail.optical_counterparts.length} Optical
                      </Badge>
                    )}
                  </BadgeContainer>
                )}

                <CardMetaLine>
                  {[
                    selectedEvent.sourceName,
                    selectedEventDetail && `${selectedEventDetail.stream?.length ?? 0} notice${(selectedEventDetail.stream?.length ?? 0) === 1 ? '' : 's'}`,
                    selectedEventDetail && `${selectedEventDetail.textual?.length ?? 0} circular${(selectedEventDetail.textual?.length ?? 0) === 1 ? '' : 's'}`,
                    selectedEvent.t0 && getTimeAgo(new Date(selectedEvent.t0)),
                  ].filter(Boolean).join(' · ')}
                </CardMetaLine>

                <CardGrid>
                  <CardField>
                    <CardFieldLabel>T0 (UTC)</CardFieldLabel>
                    <CardFieldValue>
                      {selectedEvent.t0 ? new Date(selectedEvent.t0).toLocaleString('en-US', { timeZone: 'UTC' }) : '—'}
                    </CardFieldValue>
                  </CardField>
                  {/* "drawn" — this number is the circle rendered on the sphere. */}
                  <CardField>
                    <CardFieldLabel>Error{posErrorRadius(selectedEvent.posErrorDeg) != null ? ' (drawn)' : ''}</CardFieldLabel>
                    <CardFieldValue>
                      {posErrorRadius(selectedEvent.posErrorDeg) != null
                        ? `± ${posErrorRadius(selectedEvent.posErrorDeg)!.toFixed(3)}°`
                        : 'not reported'}
                    </CardFieldValue>
                  </CardField>
                  <CardField>
                    <CardFieldLabel>RA</CardFieldLabel>
                    <CardFieldValue>{hasPosition(selectedEvent) ? formatCoordinate(selectedEvent.raDeg!, 'ra') : '—'}</CardFieldValue>
                  </CardField>
                  <CardField>
                    <CardFieldLabel>Dec</CardFieldLabel>
                    <CardFieldValue>{hasPosition(selectedEvent) ? formatCoordinate(selectedEvent.decDeg!, 'dec') : '—'}</CardFieldValue>
                  </CardField>
                </CardGrid>

                {!hasPosition(selectedEvent) && (
                  <CardMetaLine>No position reported — this event is absent from the sphere.</CardMetaLine>
                )}

                {(selectedEventDetail?.aiSummary || selectedEvent.additionalInfo) && (
                  <AiBlock>
                    <AiLabel>{selectedEventDetail?.aiSummary ? 'AI summary · model-generated' : 'From the notice'}</AiLabel>
                    <AiText>
                      {selectedEventDetail?.aiSummary ? selectedEventDetail.aiSummary.headline : selectedEvent.additionalInfo}
                    </AiText>
                  </AiBlock>
                )}

                <CardActions>
                  <PrimaryAction
                    as="a"
                    href={recordHref(selectedEvent.canonicalId || selectedEvent.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open full record ↗
                  </PrimaryAction>
                  <Pager>
                    <button
                      disabled={filteredEvents.indexOf(selectedEvent) === 0}
                      onClick={() => { const i = filteredEvents.indexOf(selectedEvent); if (i > 0) handleEventChange(filteredEvents[i - 1]); }}
                      aria-label="Previous event"
                    >‹</button>
                    {filteredEvents.indexOf(selectedEvent) + 1} of {filteredEvents.length}
                    <button
                      disabled={filteredEvents.indexOf(selectedEvent) === filteredEvents.length - 1}
                      onClick={() => { const i = filteredEvents.indexOf(selectedEvent); if (i < filteredEvents.length - 1) handleEventChange(filteredEvents[i + 1]); }}
                      aria-label="Next event"
                    >›</button>
                  </Pager>
                </CardActions>

                <RecordHint>→ /novatrace/events/{selectedEvent.canonicalId || selectedEvent.id}</RecordHint>

                {!isSignedIn && (
                  <SignInPrompt>
                    <p>Observed this? Sign in to leave a comment or share photometry data.</p>
                    <SignInButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : '/'}>
                      <SignInAction onClick={saveReturnUrl}>Sign in</SignInAction>
                    </SignInButton>
                  </SignInPrompt>
                )}
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
            <span
              onClick={navigateToAlertLevel}
              style={{ cursor: 'pointer', color: 'var(--starithm-electric-violet, #8D0FF5)', fontSize: '0.75rem', marginLeft: '0.75rem' }}
            >
              Search GCN Circulars →
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', marginLeft: '1rem', opacity: 0.6 }}>
              Powered by Starithm Tech
            </span>
          </StatusRight>
        </StatusContent>
      </StatusBar>

      {/* Pill dropdowns rendered via portal to escape backdrop-filter / WebGL compositing */}
      {openPill && createPortal(
        <div
          ref={portalDropdownRef}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '0.875rem',
            padding: '0.4rem',
            zIndex: 999999,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            minWidth: openPill === 'date' ? 280 : openPill === 'sky' ? 220 : 200,
          }}
        >
          {openPill === 'date' && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.25rem 0.25rem 0' }}>
              <CalendarComponent
                mode="single"
                selected={dateRange.start ? new Date(dateRange.start) : undefined}
                onSelect={date => { if (date) { handleDateRangeChange(formatDateToUTCString(date), dateRange.end); setSearchTrigger(p => p + 1); } }}
                initialFocus={false}
              />
              <DateRangeSeparator>to</DateRangeSeparator>
              <CalendarComponent
                mode="single"
                selected={dateRange.end ? new Date(dateRange.end) : undefined}
                onSelect={date => { if (date) { handleDateRangeChange(dateRange.start, formatDateToUTCString(date)); setSearchTrigger(p => p + 1); } }}
                initialFocus={false}
              />
            </div>
          )}
          {openPill === 'types' && displayAlertKinds.map(kind => (
            <PillDropdownItem
              key={kind}
              $selected={selectedAlertTypes.includes(kind)}
              onClick={() => toggleAlertType(kind)}
            >
              {selectedAlertTypes.includes(kind) ? '✓ ' : '  '}{kind.toUpperCase()}
            </PillDropdownItem>
          ))}
          {openPill === 'instruments' && displaySourceNames.map(src => (
            <PillDropdownItem
              key={src}
              $selected={selectedSources.includes(src)}
              onClick={() => toggleSource(src)}
            >
              {selectedSources.includes(src) ? '✓ ' : '  '}{src}
            </PillDropdownItem>
          ))}
          {openPill === 'sky' && (
            <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {(['RA (deg, 0–360)', 'Dec (deg, −90 to +90)', 'Radius (deg)'] as const).map((label, i) => {
                const [val, setter] = [
                  [coneRa, setConeRa],
                  [coneDec, setConeDec],
                  [coneRadius, setConeRadius],
                ][i] as [string, React.Dispatch<React.SetStateAction<string>>];
                return (
                  <React.Fragment key={label}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>{label}</span>
                    <input
                      type="number"
                      value={val}
                      onChange={e => setter(e.target.value)}
                      placeholder={i === 0 ? '150' : i === 1 ? '-30' : '5'}
                      style={{
                        width: '100%',
                        background: 'var(--muted)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.375rem',
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--foreground)',
                        outline: 'none',
                      }}
                    />
                  </React.Fragment>
                );
              })}
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                <button
                  onClick={() => {
                    const ra = parseFloat(coneRa);
                    const dec = parseFloat(coneDec);
                    const radius = parseFloat(coneRadius);
                    if (!isNaN(ra) && !isNaN(dec) && !isNaN(radius) && radius > 0) {
                      setConeSearch({ raDeg: ra, decDeg: dec, radiusDeg: radius });
                      setOpenPill(null);
                      setSearchTrigger(prev => prev + 1);
                    }
                  }}
                  style={{
                    flex: 1,
                    background: '#8D0FF5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Apply
                </button>
                {coneSearch && (
                  <button
                    onClick={() => {
                      setConeSearch(null);
                      setConeRa('');
                      setConeDec('');
                      setConeRadius('');
                      setOpenPill(null);
                      setSearchTrigger(prev => prev + 1);
                    }}
                    style={{
                      background: 'transparent',
                      color: 'var(--muted-foreground)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </EventLevelContainer>
  );
}
