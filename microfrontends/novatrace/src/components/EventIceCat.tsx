import { useEffect, useMemo, useRef, useState } from 'react';
import { SectionHead, SectionNote, Card, UrlLink, Disclaimer, LcScroll, LcWrap, LcTip, IcChart, IcLegend } from '../styled_pages/EventRecord.styled';
import { RecordSection, SectionToggle } from './RecordSection';

/* An IceCube track alert against IceCat-1, IceCube's catalogue of the 348 Gold and Bronze alerts
 * of 2011-2023 (CC0, doi:10.7910/DVN/SCRUCD): signalness against most probable energy, the alert
 * drawn over the catalogue, with where it ranks. The values are the latest notice's `nu_energy`
 * and `p_astro`, the quantities IceCat-1 lists as ENERGY and SIGNAL (both assume an E^-2.19
 * astrophysical flux). Only gold_bronze_track_alerts notices carry them; no such notice, no section.
 *
 * Colour is the alert's tier (Gold / Bronze, the light curve's validated --chart-1/--chart-2
 * pair), shape the selection that found it (GFU circle, HESE square, EHE diamond); the alert is
 * the one star. The catalogue (13 kB) loads only on an IceCube page. */

const TOPIC = 'gcn.notices.icecube.gold_bronze_track_alerts';
const DOI = 'https://doi.org/10.7910/DVN/SCRUCD';

type Tier = 'gold' | 'bronze';
type Selection = 'gfu' | 'hese' | 'ehe';
interface Row { name: string; tier: Tier; selection: Selection; energy: number; signal: number }
interface NoticeLike { topic: string; producedAt: string | null; payload: Record<string, any> | null }

const SELECTIONS: { id: Selection; label: string }[] = [
  { id: 'gfu', label: 'GFU' }, { id: 'hese', label: 'HESE' }, { id: 'ehe', label: 'EHE' },
];

/** The latest notice's energy, signalness and tier; null when the event has no such notice. */
export function neutrinoAlert(notices: NoticeLike[]): { energy: number; signal: number; tier: Tier | null } | null {
  const n = notices
    .filter(x => x.topic === TOPIC && x.payload && Number(x.payload.nu_energy) > 0 && x.payload.p_astro != null)
    .sort((a, b) => (b.producedAt ?? '').localeCompare(a.producedAt ?? ''))[0];
  if (!n) return null;
  const p = String(n.payload!.pipeline ?? '');
  return {
    energy: Number(n.payload!.nu_energy), signal: Number(n.payload!.p_astro),
    tier: /gold/i.test(p) ? 'gold' : /bronze/i.test(p) ? 'bronze' : null,
  };
}

let catalogue: Promise<Row[]> | null = null;
const loadCatalogue = () => (catalogue ??= import('../lib/icecat1.json').then(m =>
  (m.default.rows as [string, string, number, number][]).map(([name, type, energy, signal]) => {
    const [selection, tier] = type.split('-') as [Selection, Tier];
    return { name, tier, selection, energy, signal };
  })));

const W = 860, H = 320, L = 52, R = 16, T = 12, B = 34;
const E_TICKS: [number, string][] = [[10, '10 TeV'], [100, '100 TeV'], [1000, '1 PeV'], [10000, '10 PeV'], [100000, '100 PeV']];
const fmtE = (tev: number) => (tev >= 1000 ? `${(tev / 1000).toPrecision(3)} PeV` : `${tev.toPrecision(3)} TeV`);
const SQUARE = (cx: number, cy: number, r: number) => `M${cx - r},${cy - r} h${2 * r} v${2 * r} h${-2 * r} Z`;
const DIAMOND = (cx: number, cy: number, r: number) => `M${cx},${cy - r} L${cx + r},${cy} L${cx},${cy + r} L${cx - r},${cy} Z`;
const STAR = (cx: number, cy: number, r: number) => Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5, k = i % 2 ? r * 0.45 : r;
  return `${i ? 'L' : 'M'}${(cx + k * Math.cos(a)).toFixed(1)},${(cy + k * Math.sin(a)).toFixed(1)}`;
}).join(' ') + ' Z';

export function EventIceCat({ name, notices }: { name: string; notices: NoticeLike[] }) {
  const alert = useMemo(() => neutrinoAlert(notices), [notices]);
  const [rows, setRows] = useState<Row[] | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => { if (alert) loadCatalogue().then(setRows).catch(() => setRows(null)); }, [alert]);
  if (!alert || !rows) return null;

  const x0 = Math.floor(Math.log10(Math.min(alert.energy, ...rows.map(r => r.energy))));
  const x1 = Math.ceil(Math.log10(Math.max(alert.energy, ...rows.map(r => r.energy))));
  const x = (e: number) => L + ((Math.log10(e) - x0) / (x1 - x0)) * (W - L - R);
  const y = (s: number) => T + (1 - s) * (H - T - B);

  // Where the alert ranks: energy among all 348 and its own tier, signalness within its tier.
  const tierRows = alert.tier ? rows.filter(r => r.tier === alert.tier) : [];
  const above = (rs: Row[], f: (r: Row) => number, v: number) => rs.filter(r => f(r) > v).length;
  const eAll = above(rows, r => r.energy, alert.energy), eTier = above(tierRows, r => r.energy, alert.energy);
  const tierName = alert.tier === 'gold' ? 'Gold' : 'Bronze';

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const k = W / r.width, mx = (e.clientX - r.left) * k, my = (e.clientY - r.top) * (H / r.height);
    let best = -1, bd = (14 * k) ** 2;
    rows.forEach((p, i) => { const d = (x(p.energy) - mx) ** 2 + (y(p.signal) - my) ** 2; if (d < bd) { bd = d; best = i; } });
    setHover(best >= 0 ? best : null);
  };
  const hp = hover != null ? rows[hover] : null;

  const mark = (p: Row, i: number) => {
    const cx = x(p.energy), cy = y(p.signal), cls = `${p.tier} filled`;
    if (p.selection === 'hese') return <path key={i} className={cls} d={SQUARE(cx, cy, 3)} />;
    if (p.selection === 'ehe') return <path key={i} className={cls} d={DIAMOND(cx, cy, 4)} />;
    return <circle key={i} className={cls} cx={cx} cy={cy} r={3} />;
  };
  const ax = x(alert.energy), ay = y(alert.signal);
  const labelLeft = ax > W - 200;

  return (
    <RecordSection id="icecat">
      <SectionHead>
        <SectionToggle>Among IceCube alerts</SectionToggle>
        <SectionNote>{fmtE(alert.energy)} · signalness {alert.signal.toFixed(2)} · against {rows.length} IceCat-1 alerts</SectionNote>
      </SectionHead>
      <Card>
        <p style={{ margin: '0 0 10px' }}>
          {eAll === 0 ? `Higher in energy than all ${rows.length} IceCat-1 alerts (2011–2023).`
            : `Higher in energy than ${rows.length - eAll} of the ${rows.length} IceCat-1 alerts (2011–2023)${alert.tier ? (eTier === 0
              ? `, and than every ${tierName} alert (${tierRows.length})` : `; ${eTier} of the ${tierRows.length} ${tierName} alerts were higher`) : ''}.`}
          {alert.tier && ` Signalness ${alert.signal.toFixed(2)}: ${above(tierRows, r => r.signal, alert.signal)} of the ${tierRows.length} ${tierName} alerts had a higher one.`}
        </p>
        <IcLegend>
          <div>
            <span><svg width="12" height="12" aria-hidden="true"><rect className="gold filled" x="1.5" y="1.5" width="9" height="9" rx="2" /></svg>Gold</span>
            <span><svg width="12" height="12" aria-hidden="true"><rect className="bronze filled" x="1.5" y="1.5" width="9" height="9" rx="2" /></svg>Bronze</span>
            <span><svg width="14" height="14" aria-hidden="true"><path className="this" d={STAR(7, 7, 6.5)} /></svg>{name}</span>
          </div>
          <div className="shapes">
            {SELECTIONS.map(s => (
              <span key={s.id}><svg width="12" height="12" aria-hidden="true">
                {s.id === 'gfu' ? <circle className="filled" cx="6" cy="6" r="3.5" /> : <path className="filled" d={s.id === 'hese' ? SQUARE(6, 6, 3.5) : DIAMOND(6, 6, 4.5)} />}
              </svg>{s.label}</span>
            ))}
          </div>
        </IcLegend>
        <LcScroll><LcWrap>
          <IcChart ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" onMouseMove={onMove} onMouseLeave={() => setHover(null)}
            aria-label={`Signalness against energy for ${rows.length} IceCat-1 alerts, with ${name} at ${fmtE(alert.energy)} and signalness ${alert.signal.toFixed(2)}`}>
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map(s => (
              <g key={`y${s}`}>
                <line className="grid" x1={L} x2={W - R} y1={y(s)} y2={y(s)} />
                <text className="axis" x={L - 6} y={y(s) + 3} textAnchor="end">{s.toFixed(1)}</text>
              </g>
            ))}
            {E_TICKS.filter(([e]) => Math.log10(e) >= x0 && Math.log10(e) <= x1).map(([e, label]) => (
              <g key={`x${e}`}>
                <line className="grid" x1={x(e)} x2={x(e)} y1={T} y2={H - B} />
                <text className="axis" x={x(e)} y={H - B + 14} textAnchor={x(e) > W - R - 30 ? 'end' : 'middle'}>{label}</text>
              </g>
            ))}
            <text className="axis-title" x={(L + W - R) / 2} y={H - 4} textAnchor="middle">Most probable neutrino energy</text>
            <text className="axis-title" transform={`translate(12 ${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle">Signalness</text>
            {/* The mark, so a screenshot carries where it came from; top right is empty (high energy, signalness near 1). */}
            <g className="brand" aria-hidden="true">
              <image href="/logo_without_name.png" x={W - R - 112} y={T + 6} width={16} height={16} />
              <text x={W - R - 92} y={T + 18}>starithm.ai</text>
            </g>
            {rows.map(mark)}
            {hp && <circle className="hover-ring" cx={x(hp.energy)} cy={y(hp.signal)} r={7} />}
            <path className="this" d={STAR(ax, ay, 9)} />
            <text className="this-label" x={labelLeft ? ax - 13 : ax + 13} y={ay + 4} textAnchor={labelLeft ? 'end' : 'start'}>{name}</text>
          </IcChart>
          {hp && (
            <LcTip style={{ left: `${(x(hp.energy) / W) * 100}%`, top: `${(y(hp.signal) / H) * 100}%` }}>
              <strong>{hp.name}</strong> · {hp.selection.toUpperCase()} {hp.tier === 'gold' ? 'Gold' : 'Bronze'}
              <br />{fmtE(hp.energy)} · signalness {hp.signal.toFixed(2)}
            </LcTip>
          )}
        </LcWrap></LcScroll>
        <Disclaimer>
          Catalogue: IceCat-1, the IceCube Event Catalog of Alert Tracks (IceCube Collaboration, v4, 2023;{' '}
          <UrlLink href={DOI} target="_blank" rel="noopener noreferrer">doi:10.7910/DVN/SCRUCD</UrlLink>), alerts sent in real time and
          archival events from 2011 that would have passed. {name}: the latest notice's energy and signalness. Both assume an E<sup>−2.19</sup> astrophysical
          spectrum; signalness is the probability the neutrino is astrophysical.
        </Disclaimer>
      </Card>
    </RecordSection>
  );
}
