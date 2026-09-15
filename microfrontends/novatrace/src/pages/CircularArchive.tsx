import { useState, useMemo, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Navbar } from '@novatrace/components/Navbar';
import { API_ENDPOINTS } from '@shared/lib/config';
import {
  applyFilters, groupByDate, circularType, primaryInstrument, gcnNumber,
  isFiltered, EMPTY_FILTERS, TYPE_TABS, DATE_RANGES, INSTRUMENTS, TYPE_COLORS, circularSubject,
  PER_PAGE_DEFAULT,
  type ArchiveFilters, type TypeTab, type DateRange,
} from '@novatrace/lib/circularArchive';
import {
  Page, Column, HeaderRow, PageTitle, ResultCount,
  FilterBlock, FilterRow, TextInput, Select, Spacer, ClearButton, TabRow, Tab,
  List, Group, GroupHeader, GroupDate, GroupRule, GroupCount,
  Row, RowTime, RowType, RowSubject, RowGcn, EmptyState, SkeletonRow,
  Pagination, PageInfo, PageButtons, PageButton,
} from '../styled_pages/CircularArchive.styled';
import { CircularDetailModal } from '@novatrace/components/CircularDetailModal';

/**
 * GCN Circulars Archive.
 *
 * Split filtering, by necessity:
 *   server-side  date window, GCN number, event/keyword  (API supports ILIKE on these)
 *   client-side  type, instrument                        (live inside the `data` JSON)
 *
 * Consequence worth knowing: a GCN number or event search reaches the whole 12,691-row
 * archive, but *browsing* by type or instrument only sees the most recent FETCH_LIMIT rows.
 * Making those archive-wide means teaching the API to filter on data.basic_data.eventType
 * and data.telescopes — raise FETCH_LIMIT only as a stopgap, it does not scale.
 */
const FETCH_LIMIT = 500;

/** Debounce the free-text queries so each keystroke doesn't re-hit the API. */
function useDebounced<V>(value: V, ms = 350): V {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function timeOf(a: any): string {
  const d = new Date(a?.date ?? a?.createdAt ?? 0);
  return Number.isFinite(d.getTime())
    ? d.toISOString().slice(11, 16)
    : '--:--';
}

export default function CircularArchive() {
  const [filters, setFilters] = useState<ArchiveFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [openId, setOpenId] = useState<number | null>(null);
  const [view, setView] = useState<'parsed' | 'raw'>('parsed');
  const perPage = PER_PAGE_DEFAULT;

  const set = <K extends keyof ArchiveFilters>(k: K, v: ArchiveFilters[K]) => {
    setFilters(f => ({ ...f, [k]: v }));
    setPage(0); // any filter change resets pagination (handoff §Interactions)
  };

  // Server-side: date window + the two free-text queries (the API supports ILIKE on
  // event/alertKey). Pushing these means a GCN number or event name is found anywhere in
  // the 12,691-row archive, not just inside FETCH_LIMIT. Type and instrument stay
  // client-side — they live inside the extracted `data` JSON, which the API cannot filter.
  const dGcn = useDebounced(filters.gcnQuery);
  const dEvent = useDebounced(filters.eventQuery);

  /**
   * Two pagination modes, because type/instrument cannot be filtered by the API.
   *
   *  jsonFilter INACTIVE — the common case. Fetch exactly one page (limit=perPage,
   *    offset=page*perPage) and trust the API's `total`. Pagination is then accurate
   *    across all 12,691 rows.
   *  jsonFilter ACTIVE — fetch a FETCH_LIMIT window and filter/paginate client-side.
   *    Counts are honest about being scoped to that window (see `scoped` below), rather
   *    than reporting the window size as if it were the archive.
   */
  const jsonFilter = filters.type !== 'All' || filters.instrument !== 'All';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['circular-archive', filters.range, filters.customFrom, filters.customTo,
               dGcn, dEvent, jsonFilter, jsonFilter ? 0 : page],
    queryFn: async () => {
      const params = new URLSearchParams(
        jsonFilter
          ? { limit: String(FETCH_LIMIT), offset: '0' }
          : { limit: String(perPage), offset: String(page * perPage) },
      );
      if (filters.range === 'custom') {
        if (filters.customFrom) params.append('startDate', filters.customFrom);
        if (filters.customTo) params.append('endDate', filters.customTo);
      }
      if (dGcn) params.append('alertKey', dGcn);
      if (dEvent) params.append('event', dEvent);
      const res = await fetch(`${API_ENDPOINTS.alerts}/search?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body: any = await res.json();
      const rows = Array.isArray(body) ? body : (body.alerts ?? body.data ?? []);
      return { rows, total: typeof body?.total === 'number' ? body.total : rows.length };
    },
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  const alerts: any[] = data?.rows ?? [];
  const serverTotal: number = data?.total ?? 0;
  // gcnQuery/eventQuery are already applied server-side; re-applying them here would
  // double-filter (and the client's GCN match is narrower than the server's ILIKE).
  const filtered = useMemo(
    () => applyFilters(alerts, { ...filters, gcnQuery: '', eventQuery: '' }),
    [alerts, filters],
  );

  // `scoped` = counts describe the fetched window, not the whole archive.
  const scoped = jsonFilter && serverTotal > FETCH_LIMIT;
  const resultCount = jsonFilter ? filtered.length : serverTotal;
  const totalPages = Math.max(1, Math.ceil(resultCount / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = jsonFilter
    ? filtered.slice(safePage * perPage, safePage * perPage + perPage)
    : filtered; // server already returned exactly this page
  const groups = useMemo(() => groupByDate(pageItems), [pageItems]);

  const pageWindow = useMemo(() => {
    const span = 2, out: number[] = [];
    const push = (n: number) => { if (!out.includes(n)) out.push(n); };
    push(0);
    if (safePage - span > 1) out.push(-1);
    for (let i = Math.max(1, safePage - span); i <= Math.min(totalPages - 2, safePage + span); i++) push(i);
    if (safePage + span < totalPages - 2) out.push(-2);
    if (totalPages > 1) push(totalPages - 1);
    return out;
  }, [safePage, totalPages]);

  // A timeline click can open a circular outside the current page, so resolve against the
  // full fetched set rather than pageItems.
  const openAlert = openId == null ? null : alerts.find(a => gcnNumber(a) === openId) ?? null;
  const openIndex = openId == null ? -1 : pageItems.findIndex(a => gcnNumber(a) === openId);

  /** Prev/next through the current page only, clamped (handoff §2 title bar). */
  const step = (dir: -1 | 1) => {
    if (openIndex === -1) return;
    const next = openIndex + dir;
    if (next < 0 || next >= pageItems.length) return;
    setOpenId(gcnNumber(pageItems[next]));
  };

  // Keyboard nav is only bound while the popup is open (handoff §Interactions).
  useEffect(() => {
    if (openId == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenId(null); return; }
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();
      step(e.key === 'ArrowUp' ? -1 : 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId, pageItems]);

  return (
    <Page>
      <Navbar />
      <Column>
        <HeaderRow>
          <PageTitle>GCN Circulars Archive</PageTitle>
          <ResultCount>
            {isLoading
              ? 'loading…'
              : scoped
                ? `${filtered.length} of ${FETCH_LIMIT} most recent`
                : `${resultCount.toLocaleString()} circular${resultCount === 1 ? '' : 's'}`}
          </ResultCount>
        </HeaderRow>

        <FilterBlock>
          <FilterRow>
            <TextInput
              value={filters.gcnQuery}
              onChange={e => set('gcnQuery', e.target.value.replace(/\D/g, ''))}
              placeholder="GCN number"
              inputMode="numeric"
            />
            {/* Not in the handoff — restored because "find a specific circular" is this
                page's stated purpose and event name is the most natural query for it. */}
            <TextInput
              $w={190}
              value={filters.eventQuery}
              onChange={e => set('eventQuery', e.target.value)}
              placeholder="Event or keyword"
            />
            <Select value={filters.range} onChange={e => set('range', e.target.value as DateRange)}>
              {DATE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </Select>
            {filters.range === 'custom' && (
              <>
                <TextInput $w={130} type="date" value={filters.customFrom}
                  onChange={e => set('customFrom', e.target.value)} />
                <TextInput $w={130} type="date" value={filters.customTo}
                  onChange={e => set('customTo', e.target.value)} />
              </>
            )}
            {/* Replaces the handoff's `broker` select: every circular has broker='gcn',
                so that control would always be a no-op. Instrument is the real axis. */}
            <Select value={filters.instrument} onChange={e => set('instrument', e.target.value)}>
              <option value="All">All instruments</option>
              {INSTRUMENTS.map(i => <option key={i.label} value={i.label}>{i.label}</option>)}
            </Select>
            <Spacer />
            {isFiltered(filters) && (
              <ClearButton onClick={() => { setFilters(EMPTY_FILTERS); setPage(0); }}>
                Clear filters
              </ClearButton>
            )}
          </FilterRow>

          <TabRow>
            {TYPE_TABS.map(t => (
              <Tab key={t.label} $active={filters.type === t.label}
                onClick={() => set('type', t.label as TypeTab)}>
                {t.label}
              </Tab>
            ))}
          </TabRow>
        </FilterBlock>

        {isLoading ? (
          <List>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
          </List>
        ) : isError ? (
          <EmptyState>Could not load circulars.</EmptyState>
        ) : resultCount === 0 ? (
          <EmptyState>No circulars match these filters.</EmptyState>
        ) : (
          <>
            <List>
              {groups.map(g => (
                <Group key={g.key}>
                  <GroupHeader>
                    <GroupDate>{g.label}</GroupDate>
                    <GroupRule />
                    <GroupCount>{g.items.length} circular{g.items.length === 1 ? '' : 's'}</GroupCount>
                  </GroupHeader>
                  {g.items.map(a => {
                    const type = circularType(a);
                    return (
                      <Row key={a.alertKey ?? a.id} onClick={() => setOpenId(gcnNumber(a))}
                        title={`${circularSubject(a)} · ${primaryInstrument(a)}`}>
                        <RowTime>{timeOf(a)}</RowTime>
                        <RowType $color={TYPE_COLORS[type] ?? 'var(--text-muted)'}>{type}</RowType>
                        <RowSubject>{circularSubject(a)}</RowSubject>
                        <RowGcn>{a.alertKey ?? ''}</RowGcn>
                      </Row>
                    );
                  })}
                </Group>
              ))}
            </List>

            <Pagination>
              <PageInfo>
                {safePage * perPage + 1}–{Math.min((safePage + 1) * perPage, resultCount)} of{' '}
                {resultCount.toLocaleString()}{scoped ? ' (recent window)' : ''}
              </PageInfo>
              <PageButtons>
                <PageButton $disabled={safePage === 0}
                  onClick={() => safePage > 0 && setPage(safePage - 1)}>Prev</PageButton>
                {/* Window of pages around the current one — 12,691 rows is ~1,600 pages,
                    so rendering them all (or only the first 12) is not usable. */}
                {pageWindow.map((i, idx) =>
                  i < 0 ? (
                    <PageInfo key={`gap-${idx}`}>…</PageInfo>
                  ) : (
                    <PageButton key={i} $active={i === safePage} onClick={() => setPage(i)}>
                      {i + 1}
                    </PageButton>
                  ),
                )}
                <PageButton $disabled={safePage >= totalPages - 1}
                  onClick={() => safePage < totalPages - 1 && setPage(safePage + 1)}>Next</PageButton>
              </PageButtons>
            </Pagination>
          </>
        )}
      </Column>

      {openAlert && (
        <CircularDetailModal
          alert={openAlert}
          allAlerts={alerts}
          onClose={() => setOpenId(null)}
          onSelect={setOpenId}
          onStep={step}
          canPrev={openIndex > 0}
          canNext={openIndex >= 0 && openIndex < pageItems.length - 1}
          view={view}
          onViewChange={setView}
        />
      )}
    </Page>
  );
}
