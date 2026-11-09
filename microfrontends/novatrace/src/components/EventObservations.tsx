import { useMemo, useState } from 'react';
import {
  SectionHead, SectionNote, Card, Empty, FieldHint, Tabs, Tab,
  TableWrap, Table, UrlLink, ShowMore, Disclaimer, ObsChart, ObsRow, AssumptionNote,
} from '../styled_pages/EventRecord.styled';
import {
  shownObservations, observationsCoverage, fmtObservationValue, fmtSinceTrigger, fmtObservationUtc, fmtExposure,
  fmtNormalised, fmtNormalisedAt, normAssumptions,
  REGIMES, type Observation, type Regime, type ObservationRow,
} from '../utils/observations';
import { RecordSection, SectionToggle } from './RecordSection';

/* What the event's circulars measured, by band over time: a coverage strip (one lane per regime,
 * log time) above one table filtered by regime. Option B of the side-by-side comparison.
 * Values come from data.observations on each circular (ml/observations.py); only the burst's own
 * light is shown, not field stars, hosts or comparison stars. */

interface CircularLike { alertKey: string; date: string; data?: { observations?: { rows?: ObservationRow[] } } }

const PREVIEW = 12;
const isLimit = (o: Observation) => o.kind === 'upper_limit' || o.kind === 'depth';
const gcnNo = (k: string) => k.replace(/^GCN-/, '');

function Coverage({ obs, lanes, filter, onFilter }: {
  obs: Observation[]; lanes: typeof REGIMES; filter: Regime | 'all'; onFilter: (r: Regime | 'all') => void;
}) {
  const timed = obs.filter(o => o.time_since_trigger_s != null && o.time_since_trigger_s > 0);
  if (!timed.length) return null;
  const ts = timed.map(o => o.time_since_trigger_s!);
  const lo = Math.log10(Math.max(1, Math.min(...ts))), hi = Math.log10(Math.max(...ts, 10));
  const W = 860, L = 80, R = 10, LANE = 22, H = lanes.length * LANE + 26;
  const x = (s: number) => L + ((Math.log10(Math.max(s, 1)) - lo) / (hi - lo || 1)) * (W - L - R);
  const TICKS: [number, string][] = [[60, '1 min'], [3600, '1 h'], [86400, '1 d'], [864000, '10 d'], [8640000, '100 d']];
  const ticks = TICKS.filter(([t]) => Math.log10(t) >= lo && Math.log10(t) <= hi);
  return (
    <ObsChart viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Observations by band over time since trigger">
      {ticks.map(([t, label]) => (
        <g key={t}>
          <line className="grid" x1={x(t)} x2={x(t)} y1={4} y2={H - 18} />
          <text className="axis" x={x(t)} y={H - 5} textAnchor="middle">{label}</text>
        </g>
      ))}
      {lanes.map((r, i) => {
        const y = 12 + i * LANE;
        return (
          <g key={r.id} className={`lane${filter === 'all' || filter === r.id ? '' : ' lane--dim'}`}
            role="button" tabIndex={0} aria-pressed={filter === r.id}
            onClick={() => onFilter(filter === r.id ? 'all' : r.id)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFilter(filter === r.id ? 'all' : r.id); } }}>
            <text className="lbl" x={0} y={y + 3}>{r.label}</text>
            <line className="lane-rule" x1={L} x2={W - R} y1={y} y2={y} />
            {timed.filter(o => o.regime === r.id).map((o, j) => {
              const cx = x(o.time_since_trigger_s!);
              return isLimit(o)
                ? <path key={j} className="lim" d={`M${cx - 3},${y - 3} L${cx + 3},${y - 3} L${cx},${y + 3} Z`} />
                : <circle key={j} className="det" cx={cx} cy={y} r={3} />;
            })}
          </g>
        );
      })}
    </ObsChart>
  );
}

/** "As reported" beside "Normalised". Under the normalised value, in brackets, every assumption the
 *  conversion made; a row that cannot be converted (counts, colours, unknown band) repeats its value. */
function ValueCells({ o, normalised }: { o: Observation; normalised: boolean }) {
  const limit = isLimit(o) && <FieldHint>limit</FieldHint>;
  const norm = fmtNormalised(o);
  const at = fmtNormalisedAt(o);
  const assumed = normAssumptions(o);
  return (
    <>
      <td>{fmtObservationValue(o)}{limit}</td>
      {normalised && <td>
        {norm ? <>{norm}{at && <FieldHint>{at}</FieldHint>}</> : <>{fmtObservationValue(o)}{limit}</>}
        {norm && assumed.length > 0 && <AssumptionNote>({assumed.join('; ')})</AssumptionNote>}
      </td>}
    </>
  );
}

export function EventObservations({ circulars, t0, onOpenCircular }: {
  circulars: CircularLike[]; t0: string | null; onOpenCircular: (alertKey: string) => void;
}) {
  const [filter, setFilter] = useState<Regime | 'all'>('all');
  const [all, setAll] = useState(false);
  const { obs, hidden, cov } = useMemo(() => {
    return { ...shownObservations(circulars), cov: observationsCoverage(circulars) };
  }, [circulars]);

  const lanes = REGIMES.filter(r => obs.some(o => o.regime === r.id));
  const shown = obs.filter(o => filter === 'all' || o.regime === filter);
  const rows = all ? shown : shown.slice(0, PREVIEW);
  const notYet = cov.parsed < cov.total;
  // Rows stored before the normaliser ran have no norm; until some do, the column would only repeat.
  const normalised = obs.some(o => o.norm);
  // Columns researchers asked for to rebuild light curves (Pawan Tiwari, 2026-11-09); shown once
  // any row has them, so older events don't get empty columns.
  const exposure = obs.some(o => o.exposure_s != null);
  const instrument = obs.some(o => o.instrument);

  return (
    <RecordSection id="observations">
      <SectionHead>
        <SectionToggle>Observations</SectionToggle>
        <SectionNote>
          {obs.length} values · {cov.parsed} of {cov.total} circulars parsed
          {hidden > 0 && ` · ${hidden} field/host values hidden`}
        </SectionNote>
      </SectionHead>
      <Card>
        {obs.length === 0 ? (
          <Empty>
            {notYet
              ? `Not parsed yet: ${cov.total - cov.parsed} of this event's ${cov.total} circulars are still waiting for extraction.`
              : 'No measured values in this event’s circulars.'}
          </Empty>
        ) : (
          <>
            <Coverage obs={obs} lanes={lanes} filter={filter} onFilter={f => { setFilter(f); setAll(false); }} />
            <Tabs>
              <Tab $active={filter === 'all'} onClick={() => { setFilter('all'); setAll(false); }}>All {obs.length}</Tab>
              {lanes.map(r => (
                <Tab key={r.id} $active={filter === r.id} onClick={() => { setFilter(r.id); setAll(false); }}>
                  {r.label} {obs.filter(o => o.regime === r.id).length}
                </Tab>
              ))}
            </Tabs>
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <th>Time</th><th>UTC</th>{filter === 'all' && <th>Regime</th>}<th>Band</th><th>As reported</th>
                    {normalised && <th>Normalised</th>}{exposure && <th>Exposure</th>}<th>Telescope</th>{instrument && <th>Instrument</th>}<th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((o, i) => (
                    <ObsRow key={i} $limit={isLimit(o)} title={o.quote ?? undefined}>
                      <td>{fmtSinceTrigger(o.time_since_trigger_s)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{fmtObservationUtc(t0, o.time_since_trigger_s)}</td>
                      {filter === 'all' && <td>{REGIMES.find(r => r.id === o.regime)?.label}</td>}
                      <td>{o.band ?? '—'}</td>
                      <ValueCells o={o} normalised={normalised} />
                      {exposure && <td>{fmtExposure(o.exposure_s)}</td>}
                      <td style={{ whiteSpace: 'normal' }}>{o.telescope || (instrument ? '—' : o.instrument) || '—'}</td>
                      {/* Written out in full it can be a sentence ("optical three-color (g', Rc, and Ic) CCD
                          cameras"); one line, the rest on hover. */}
                      {instrument && <td title={o.instrument ?? undefined}
                        style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.instrument || '—'}</td>}
                      <td>
                        <UrlLink href={`#circ-${o.alertKey}`} onClick={e => { e.preventDefault(); onOpenCircular(o.alertKey); }}>
                          GCN {gcnNo(o.alertKey)}
                        </UrlLink>
                      </td>
                    </ObsRow>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
            {shown.length > PREVIEW && (
              <ShowMore onClick={() => setAll(a => !a)}>{all ? 'Show fewer' : `Show all ${shown.length}`}</ShowMore>
            )}
            <Disclaimer>
              Values are model-parsed from the circular text; hover a row for the sentence it came from.
              {normalised && ' Normalised: magnitudes and radio as flux density at the band\'s wavelength or frequency, X-ray as flux density at 1 keV. Galactic extinction is not corrected.'}
            </Disclaimer>
          </>
        )}
      </Card>
    </RecordSection>
  );
}
