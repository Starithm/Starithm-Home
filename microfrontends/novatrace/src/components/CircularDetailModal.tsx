import { useState, useMemo } from 'react';
import {
  eventTimeline, primaryInstrument, gcnNumber, circularType, circularSubject, SHOW_PLOTS_DEFAULT,
} from '@novatrace/lib/circularArchive';
import {
  Overlay, Dialog, TitleBar, TitleLeft, GcnLabel, MetaLine, TitleButtons, IconButton,
  Body, Main, Rail, Subject, SummaryBlock, SummaryHeader, EyebrowLabel, SummaryConfidence,
  SummaryBody, ToggleWrap, ToggleButton, KvRow, KvKey, KvValue, RawPre, PlotPlaceholder,
  LinksSection, LinkAnchor, TimelineList, TimelineRow, TimelineTime, TimelineDot,
  TimelineGcn, TimelineInstrument, TimelineTop, TimelineSubject,
  PreservedSection, PreservedBody, ImageGrid, Thumb,
  TableWrap, MiniTable,
} from '../styled_components/CircularDetailModal.styled';

/**
 * Circular detail popup.
 *
 * Follows design_handoff_gcn_archive §2 for the main column, side rail and title bar.
 * Departs from it in one deliberate way: the handoff drops Participants, parsed Tables,
 * Images and FITS — all of which exist today in AlertDetails and are backed by data the
 * extraction pipeline already pays to produce. They are preserved here as collapsed
 * <details> blocks below Links, so nothing is lost while the mock's low visual footprint
 * is kept for the default view.
 */

const IMG_RE = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;
const FITS_RE = /\.(fit|fits)(\?.*)?$/i;

/** MASTER-Net reports run to ~190 rows; render a readable slice, not the whole log. */
const TABLE_ROW_CAP = 50;

function fmtTime(a: any): string {
  const d = new Date(a?.date ?? a?.createdAt ?? 0);
  return Number.isFinite(d.getTime()) ? d.toISOString().slice(11, 16) : '--:--';
}

function fmtDateTime(a: any): string {
  const d = new Date(a?.date ?? a?.createdAt ?? 0);
  if (!Number.isFinite(d.getTime())) return '';
  return d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

/**
 * Normalise `misc_tables` into { headers, rows }.
 *
 * It is ONE table, not a list of tables, and arrives in two shapes (measured across 200
 * circulars): 39 as a list of row ARRAYS with the header row first, 5 as a list of row
 * OBJECTS. Treating the outer list as a list of tables produced "Tables (189)" and, because
 * Object.keys() on a header *string* yields character indices, a column per letter.
 */
function normaliseTable(mt: any): { headers: string[]; rows: string[][] } | null {
  if (!Array.isArray(mt) || mt.length === 0) return null;

  if (Array.isArray(mt[0])) {
    const [head, ...body] = mt as any[][];
    return {
      headers: head.map((h: any) => String(h ?? '')),
      rows: body.map(r => (Array.isArray(r) ? r.map((c: any) => String(c ?? '')) : [String(r ?? '')])),
    };
  }

  if (typeof mt[0] === 'object' && mt[0] !== null) {
    const headers = Object.keys(mt[0]);
    return {
      headers,
      rows: (mt as any[]).map(r => headers.map(h => String(r?.[h] ?? ''))),
    };
  }

  // Fallback: a flat list of strings — render as a single unnamed column.
  return { headers: [''], rows: (mt as any[]).map(v => [String(v ?? '')]) };
}

/** Measurement rows: fixed header fields first, then the circular's own parsed fields. */
function measurementRows(a: any): [string, string][] {
  const rows: [string, string][] = [
    ['Event', a?.event ?? '—'],
    ['Type', circularType(a) || '—'],
    ['Instrument', primaryInstrument(a)],
    ['From', a?.data?.basic_data?.author?.name ?? a?.data?.authors?.authors?.[0] ?? '—'],
    ['Broker', a?.broker ?? '—'],
  ];
  const m = a?.data?.measurements ?? {};
  for (const [k, v] of Object.entries(m)) {
    if (v == null || v === '' || k === 'other_measurements' || k === 'tables' || k === 'misc_tables') continue;
    if (typeof v === 'object') continue;
    rows.push([k.replace(/_/g, ' '), String(v)]);
  }
  const om = m?.other_measurements ?? {};
  for (const [k, v] of Object.entries(om)) {
    if (v == null || v === '' || typeof v === 'object') continue;
    rows.push([k.replace(/_/g, ' '), String(v)]);
  }
  return rows;
}

interface Props {
  alert: any;
  allAlerts: any[];
  onClose: () => void;
  onSelect: (gcn: number | null) => void;
  /** Prev/next within the current page (handoff: clamped, no wrap). */
  onStep: (dir: -1 | 1) => void;
  canPrev: boolean;
  canNext: boolean;
  view: 'parsed' | 'raw';
  onViewChange: (v: 'parsed' | 'raw') => void;
  showPlots?: boolean;
}

export function CircularDetailModal({
  alert, allAlerts, onClose, onSelect, onStep, canPrev, canNext,
  view, onViewChange, showPlots = SHOW_PLOTS_DEFAULT,
}: Props) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const timeline = useMemo(() => eventTimeline(allAlerts, alert), [allAlerts, alert]);
  const rows = useMemo(() => measurementRows(alert), [alert]);

  const urls: string[] = alert?.data?.urls ?? [];
  const images = urls.filter(u => IMG_RE.test(u));
  const fits = urls.filter(u => FITS_RE.test(u));
  const links = urls.filter(u => !IMG_RE.test(u) && !FITS_RE.test(u));

  const authors = alert?.data?.authors ?? {};
  const telescopes = alert?.data?.telescopes ?? {};
  const table = useMemo(
    () => normaliseTable(alert?.data?.measurements?.misc_tables ?? alert?.data?.measurements?.tables),
    [alert],
  );
  const raw: string = alert?.data?.raw ?? '';

  const hasParticipants =
    (authors?.authors?.length ?? 0) > 0 || (authors?.institutions?.length ?? 0) > 0 ||
    (telescopes?.telescopes?.length ?? 0) > 0 || (telescopes?.observatories?.length ?? 0) > 0;

  const confidence = alert?.confidenceLevel;
  const meta = [alert?.event, primaryInstrument(alert), fmtDateTime(alert), alert?.broker]
    .filter(Boolean).join(' · ');

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <TitleBar>
          <TitleLeft>
            <GcnLabel>{alert?.alertKey ?? '—'}</GcnLabel>
            <MetaLine title={meta}>{meta}</MetaLine>
          </TitleLeft>
          <TitleButtons>
            <IconButton $disabled={!canPrev} onClick={() => canPrev && onStep(-1)} aria-label="Previous">↑</IconButton>
            <IconButton $disabled={!canNext} onClick={() => canNext && onStep(1)} aria-label="Next">↓</IconButton>
            <IconButton onClick={onClose} aria-label="Close">✕</IconButton>
          </TitleButtons>
        </TitleBar>

        <Body>
          <Main>
            <Subject>{circularSubject(alert)}</Subject>

            {alert?.summary && (
              <SummaryBlock>
                <SummaryHeader>
                  <EyebrowLabel>Summary</EyebrowLabel>
                  {typeof confidence === 'number' && (
                    <SummaryConfidence>confidence {Math.round(confidence * 100)}%</SummaryConfidence>
                  )}
                </SummaryHeader>
                <SummaryBody>{alert.summary}</SummaryBody>
              </SummaryBlock>
            )}

            <ToggleWrap>
              <ToggleButton $active={view === 'parsed'} onClick={() => onViewChange('parsed')}>
                Measurements
              </ToggleButton>
              <ToggleButton $active={view === 'raw'} onClick={() => onViewChange('raw')}>
                Raw text
              </ToggleButton>
            </ToggleWrap>

            {view === 'parsed' ? (
              <div>
                {rows.map(([k, v], i) => (
                  <KvRow key={`${k}-${i}`}>
                    <KvKey>{k}</KvKey>
                    <KvValue>{v}</KvValue>
                  </KvRow>
                ))}
              </div>
            ) : (
              <RawPre>{raw || 'No raw text stored for this circular.'}</RawPre>
            )}

            {showPlots && (
              <PlotPlaceholder>light curve / skymap — not yet generated</PlotPlaceholder>
            )}

            {links.length > 0 && (
              <LinksSection>
                {links.map((u, i) => (
                  <LinkAnchor key={i} href={u} target="_blank" rel="noreferrer noopener">{u}</LinkAnchor>
                ))}
              </LinksSection>
            )}

            {/* ── Preserved from AlertDetails; collapsed by default ── */}
            {hasParticipants && (
              <PreservedSection>
                <summary>Participants</summary>
                <PreservedBody>
                  {(['authors', 'institutions'] as const).map(k =>
                    authors?.[k]?.length ? (
                      <KvRow key={k}>
                        <KvKey>{k === 'authors' ? 'Authors' : 'Institutions'}</KvKey>
                        <KvValue>{authors[k].join(', ')}</KvValue>
                      </KvRow>
                    ) : null,
                  )}
                  {(['telescopes', 'observatories'] as const).map(k =>
                    telescopes?.[k]?.length ? (
                      <KvRow key={k}>
                        <KvKey>{k === 'telescopes' ? 'Telescopes' : 'Observatories'}</KvKey>
                        <KvValue>{telescopes[k].join(', ')}</KvValue>
                      </KvRow>
                    ) : null,
                  )}
                </PreservedBody>
              </PreservedSection>
            )}

            {table && table.rows.length > 0 && (
              <PreservedSection>
                <summary>Table ({table.rows.length} rows)</summary>
                <PreservedBody>
                  <TableWrap>
                    <MiniTable>
                      <thead>
                        <tr>{table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {table.rows.slice(0, TABLE_ROW_CAP).map((r, ri) => (
                          <tr key={ri}>{r.map((c, ci) => <td key={ci}>{c}</td>)}</tr>
                        ))}
                      </tbody>
                    </MiniTable>
                  </TableWrap>
                  {table.rows.length > TABLE_ROW_CAP && (
                    <EyebrowLabel>
                      showing first {TABLE_ROW_CAP} of {table.rows.length} rows — full table in Raw text
                    </EyebrowLabel>
                  )}
                </PreservedBody>
              </PreservedSection>
            )}

            {images.length > 0 && (
              <PreservedSection>
                <summary>Images ({images.length})</summary>
                <PreservedBody>
                  <ImageGrid>
                    {images.map((u, i) => (
                      <Thumb key={i} src={u} alt={`Figure ${i + 1}`} onClick={() => setZoomImage(u)} />
                    ))}
                  </ImageGrid>
                </PreservedBody>
              </PreservedSection>
            )}

            {fits.length > 0 && (
              <PreservedSection>
                <summary>FITS files ({fits.length})</summary>
                <PreservedBody>
                  {/* The legacy dashboard opens these in an embedded JS9 viewer. That viewer
                      loads a global JS9 instance on page mount; wiring it into this modal is
                      a separate change, so for now each file is a direct link. */}
                  {fits.map((u, i) => (
                    <LinkAnchor key={i} href={u} target="_blank" rel="noreferrer noopener">{u}</LinkAnchor>
                  ))}
                </PreservedBody>
              </PreservedSection>
            )}
          </Main>

          <Rail>
            <div>
              <EyebrowLabel>Alert Timeline</EyebrowLabel>
              <TimelineList style={{ marginTop: 10 }}>
                {timeline.map(c => {
                  const g = gcnNumber(c);
                  const active = g === gcnNumber(alert);
                  return (
                    <TimelineRow
                      key={c.alertKey ?? g}
                      $active={active}
                      onClick={() => onSelect(g)}
                      title={circularSubject(c)}
                    >
                      <TimelineTop>
                        <TimelineTime>{fmtTime(c)}</TimelineTime>
                        <TimelineDot $active={active} />
                        <TimelineGcn $active={active}>{c.alertKey ?? `GCN ${g}`}</TimelineGcn>
                        <TimelineInstrument>{primaryInstrument(c)}</TimelineInstrument>
                      </TimelineTop>
                      <TimelineSubject>{circularSubject(c)}</TimelineSubject>
                    </TimelineRow>
                  );
                })}
              </TimelineList>
            </div>
          </Rail>
        </Body>

        {zoomImage && (
          <Overlay onClick={() => setZoomImage(null)} style={{ zIndex: 60 }}>
            <img src={zoomImage} alt="" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 6 }} />
          </Overlay>
        )}
      </Dialog>
    </Overlay>
  );
}
