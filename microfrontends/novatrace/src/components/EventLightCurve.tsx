import { useMemo, useRef, useState } from 'react';
import { SectionHead, SectionNote, Card, UrlLink, Disclaimer, LcScroll, LcWrap, LcChart, LcTip, LcLegend } from '../styled_pages/EventRecord.styled';
import { eventObservations, fmtSinceTrigger, isEventLight, type ObservationRow } from '../utils/observations';
import { RecordSection, SectionToggle } from './RecordSection';

/* The burst's X-ray light curve: UKSSDC's Swift-XRT 0.3-10 keV flux against time since the BAT
 * trigger (NovaTrace scripts/main/enrich/swift-xrt-curves.ts, event_light_curves), log-log, with
 * the soft X-ray fluxes the event's circulars quote drawn over it. Either alone is enough: since
 * Swift ended (2026-10-20) a new burst has no UKSSDC curve, and its circulars (EP-FXT, SVOM-MXT, …)
 * are the only X-ray light curve there is. No X-ray data at all, no section.
 *
 * Colour is the instrument, fixed across events: Swift-XRT (the curve and XRT values in circulars),
 * Einstein Probe (FXT or WXT; the 2024-26 bursts), XMM-Newton (the deep follow-up of the Swift
 * era); anything else (Chandra, Suzaku, SVOM-MXT, …) is "Other", uncoloured, named on hover. Only three hues stay apart in every pair,
 * colour-blind included (validated on the page ground and white), so a fourth instrument is not a
 * new colour. Shape is where the point comes from: UKSSDC circles, filled in Windowed Timing mode
 * and hollow in Photon Counting; circular values diamonds; upper limits open down-triangles (as in
 * Observations). UKSSDC asks for its papers and acknowledgement wherever the data are shown; they
 * are the section's footnote. */

export interface LightCurve {
  source: string; sourceId: string; quantity: string; unit: string | null; band: string | null;
  t0: string | null; url: string | null; fetchedAt: string;
  series: { mode: string; limit: boolean; points: number[][] }[];
}

interface CircularLike { alertKey: string; date: string; data?: { observations?: { rows?: ObservationRow[] } } }

type Group = 'xrt' | 'ep' | 'xmm' | 'other';
interface Pt {
  t: number; tLo: number; tHi: number; v: number; vLo: number; vHi: number; limit: boolean;
  group: Group; mode: string; from: 'ukssdc' | 'gcn'; alertKey?: string; label?: string;
}

const GROUPS: { id: Group; label: string }[] = [
  { id: 'xrt', label: 'Swift-XRT' }, { id: 'ep', label: 'Einstein Probe' }, { id: 'xmm', label: 'XMM-Newton' }, { id: 'other', label: 'Other' },
];
/** Circulars spell instruments many ways ("EP-FXT", "Einstein Probe (EP) / Follow-up X-ray Telescope (FXT)"). */
function groupOf(o: ObservationRow): Group {
  const s = `${o.telescope ?? ''} ${o.instrument ?? ''}`;
  if (/\bXRT\b/i.test(s) && !/\bMXT\b/i.test(s)) return 'xrt';
  if (/\bEP\b|einstein probe|\bFXT\b|\bWXT\b/i.test(s)) return 'ep';
  if (/\bXMM\b|\bEPIC\b/i.test(s)) return 'xmm';
  return 'other';
}

const W = 860, H = 320, L = 64, R = 12, T = 10, B = 34;
const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const pow10 = (e: number) => `10${String(e).replace(/./g, c => SUP[c] ?? c)}`;
const sci = (v: number) => { const e = Math.floor(Math.log10(v)); return `${(v / 10 ** e).toFixed(2)}×${pow10(e)}`; };
const TIME_TICKS: [number, string][] = [[1, '1 s'], [10, '10 s'], [60, '1 min'], [600, '10 min'], [3600, '1 h'], [36000, '10 h'], [86400, '1 d'], [864000, '10 d'], [8640000, '100 d']];
const MODE_LABEL: Record<string, string> = { WTSLEW: 'Windowed Timing (settling)', WT: 'Windowed Timing', PC: 'Photon Counting' };
const gcnNo = (k: string) => k.replace(/^GCN-/, '');

/** UKSSDC points, and circular soft X-ray fluxes (normalised to erg/cm²/s, with a time since trigger). */
function points(curve: LightCurve | null, circulars: CircularLike[]): Pt[] {
  const out: Pt[] = [];
  for (const s of curve?.series ?? []) {
    for (const [t, tp, tn, v, vp, vn] of s.points) {
      if (!(t > 0 && v > 0)) continue;
      out.push({ t, tLo: t + tn, tHi: t + tp, v, vLo: s.limit ? v : v + vn, vHi: s.limit ? v : v + vp, limit: s.limit, group: 'xrt', mode: s.mode, from: 'ukssdc' });
    }
  }
  for (const o of eventObservations(circulars)) {
    const n = o.norm;
    if (!isEventLight(o) || o.regime !== 'xray' || n?.dim !== 'energy_flux' || !(n.value && n.value > 0) || !(o.time_since_trigger_s && o.time_since_trigger_s > 0)) continue;
    // Soft X-rays only, comparable with XRT's 0.3-10 keV ("20 keV - 10 MeV" is a prompt flux).
    if (n.e_hi_kev == null || n.e_hi_kev > 20) continue;
    const limit = o.kind === 'upper_limit';
    const em = (n as { error_minus?: number | null }).error_minus, ep = (n as { error_plus?: number | null }).error_plus;
    out.push({
      t: o.time_since_trigger_s, tLo: o.time_since_trigger_s, tHi: o.time_since_trigger_s, v: n.value,
      vLo: limit || em == null ? n.value : n.value - Math.abs(em), vHi: limit || ep == null ? n.value : n.value + Math.abs(ep),
      limit, group: groupOf(o), mode: '', from: 'gcn', alertKey: o.alertKey,
      label: [o.telescope, o.instrument].filter(Boolean).join(' ') || undefined,
    });
  }
  return out;
}

const DIAMOND = (cx: number, cy: number, r: number) => `M${cx},${cy - r} L${cx + r},${cy} L${cx},${cy + r} L${cx - r},${cy} Z`;
const TRIANGLE = (cx: number, cy: number) => `M${cx - 4},${cy - 4} L${cx + 4},${cy - 4} L${cx},${cy + 3} Z`;

export function EventLightCurve({ curves, circulars, onOpenCircular }: {
  curves?: LightCurve[]; circulars: CircularLike[]; onOpenCircular: (alertKey: string) => void;
}) {
  const curve = curves?.find(c => c.source === 'swift_xrt') ?? null;
  const pts = useMemo(() => points(curve, circulars), [curve, circulars]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  if (!pts.length) return null;

  const xs = pts.flatMap(p => [p.tLo, p.tHi]).filter(t => t > 0);
  const ys = pts.flatMap(p => [p.vLo, p.vHi]).filter(v => v > 0);
  const x0 = Math.floor(Math.log10(Math.min(...xs))), x1 = Math.ceil(Math.log10(Math.max(...xs)));
  const y0 = Math.floor(Math.log10(Math.min(...ys))), y1 = Math.ceil(Math.log10(Math.max(...ys)));
  const x = (t: number) => L + ((Math.log10(Math.max(t, 10 ** x0)) - x0) / (x1 - x0 || 1)) * (W - L - R);
  const y = (v: number) => T + (1 - (Math.log10(Math.max(v, 10 ** y0)) - y0) / (y1 - y0 || 1)) * (H - T - B);
  const xTicks = TIME_TICKS.filter(([t]) => Math.log10(t) >= x0 && Math.log10(t) <= x1);
  const yTicks = Array.from({ length: y1 - y0 + 1 }, (_, i) => y0 + i);

  const ukssdc = pts.filter(p => p.from === 'ukssdc'), gcn = pts.filter(p => p.from === 'gcn');
  const groups = GROUPS.filter(g => pts.some(p => p.group === g.id));
  const modes = new Set(ukssdc.filter(p => !p.limit).map(p => p.mode));
  const hasLimits = pts.some(p => p.limit);

  // Nearest point to the pointer, in chart units, within ~16 px.
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const k = W / r.width, mx = (e.clientX - r.left) * k, my = (e.clientY - r.top) * (H / r.height);
    let best = -1, bd = (16 * k) ** 2;
    pts.forEach((p, i) => { const d = (x(p.t) - mx) ** 2 + (y(p.v) - my) ** 2; if (d < bd) { bd = d; best = i; } });
    setHover(best >= 0 ? best : null);
  };
  const hp = hover != null ? pts[hover] : null;

  const mark = (p: Pt, i: number) => {
    const cx = x(p.t), cy = y(p.v), g = `g-${p.group}`;
    if (p.limit) return <path key={i} className={`${g} lim`} d={TRIANGLE(cx, cy)} />;
    if (p.from === 'gcn') return <path key={i} className={`${g} ${p.group === 'other' ? 'open' : 'filled'} gcn`} d={DIAMOND(cx, cy, 6.5)} />;
    return <circle key={i} className={`${g} ${p.mode === 'PC' ? 'open' : 'filled'}`} cx={cx} cy={cy} r={p.mode === 'WTSLEW' ? 2 : 2.6} />;
  };

  return (
    <RecordSection id="lightcurve">
      <SectionHead>
        <SectionToggle>X-ray light curve</SectionToggle>
        <SectionNote>
          {[
            ukssdc.length ? `Swift-XRT ${curve?.band ?? '0.3–10 keV'} · ${ukssdc.length} points` : 'Soft X-ray flux',
            gcn.length ? `${gcn.length} from circulars` : null,
          ].filter(Boolean).join(' · ')}
        </SectionNote>
      </SectionHead>
      <Card>
        <LcLegend>
          <div>
            {groups.map(g => (
              <span key={g.id}><svg width="12" height="12" aria-hidden="true">
                <rect className={`g-${g.id} ${g.id === 'other' ? 'open' : 'filled'}`} x="1.5" y="1.5" width="9" height="9" rx="2" /></svg>{g.label}</span>
            ))}
          </div>
          <div className="shapes">
            {modes.has('WT') || modes.has('WTSLEW') ? <span><svg width="12" height="12" aria-hidden="true"><circle className="filled" cx="6" cy="6" r="3.5" /></svg>UKSSDC, Windowed Timing</span> : null}
            {modes.has('PC') && <span><svg width="12" height="12" aria-hidden="true"><circle className="open" cx="6" cy="6" r="3.5" /></svg>UKSSDC, Photon Counting</span>}
            {gcn.length > 0 && <span><svg width="12" height="12" aria-hidden="true"><path className="filled" d={DIAMOND(6, 6, 5)} /></svg>Reported in a circular</span>}
            {hasLimits && <span><svg width="12" height="12" aria-hidden="true"><path className="lim" d="M2,3 L10,3 L6,10 Z" /></svg>Upper limit</span>}
          </div>
        </LcLegend>
        <LcScroll><LcWrap>
          <LcChart ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" onMouseMove={onMove} onMouseLeave={() => setHover(null)}
            aria-label={`X-ray flux against time since trigger, log-log; ${ukssdc.length} Swift-XRT points from UKSSDC, ${gcn.length} values from circulars`}>
            {yTicks.map(e => (
              <g key={`y${e}`}>
                <line className="grid" x1={L} x2={W - R} y1={y(10 ** e)} y2={y(10 ** e)} />
                <text className="axis" x={L - 6} y={y(10 ** e) + 3} textAnchor="end">{pow10(e)}</text>
              </g>
            ))}
            {xTicks.map(([t, label]) => (
              <g key={`x${t}`}>
                <line className="grid" x1={x(t)} x2={x(t)} y1={T} y2={H - B} />
                <text className="axis" x={x(t)} y={H - B + 14} textAnchor="middle">{label}</text>
              </g>
            ))}
            <text className="axis-title" x={(L + W - R) / 2} y={H - 4} textAnchor="middle">Time since trigger</text>
            <text className="axis-title" transform={`translate(12 ${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle">Flux (erg cm⁻² s⁻¹)</text>
            {pts.filter(p => !p.limit).map((p, i) => (
              <g key={`e${i}`} className={`g-${p.group} err${p.from === 'gcn' ? ' err--gcn' : ''}`}>
                {p.tHi > p.tLo && <line x1={x(p.tLo)} x2={x(p.tHi)} y1={y(p.v)} y2={y(p.v)} />}
                {p.vHi > p.vLo && <line x1={x(p.t)} x2={x(p.t)} y1={y(Math.max(p.vLo, 10 ** y0))} y2={y(p.vHi)} />}
              </g>
            ))}
            {ukssdc.map(mark)}
            {gcn.map((p, i) => mark(p, i + ukssdc.length))}
            {hp && <circle className="hover-ring" cx={x(hp.t)} cy={y(hp.v)} r={7} />}
          </LcChart>
          {hp && (
            <LcTip style={{ left: `${(x(hp.t) / W) * 100}%`, top: `${(y(hp.v) / H) * 100}%` }}>
              <strong>{hp.limit ? '< ' : ''}{sci(hp.v)}</strong> erg cm⁻² s⁻¹
              {!hp.limit && hp.vHi > hp.vLo && (
                Math.abs((hp.vHi - hp.v) - (hp.v - hp.vLo)) <= 0.01 * (hp.vHi - hp.v)
                  ? <span> ± {sci(hp.vHi - hp.v)}</span>
                  : <span> (+{sci(hp.vHi - hp.v)} / −{sci(hp.v - hp.vLo)})</span>
              )}
              <br />{fmtSinceTrigger(hp.t)} · {hp.from === 'ukssdc'
                ? `Swift-XRT ${MODE_LABEL[hp.mode] ?? hp.mode} (UKSSDC)`
                : `${hp.label ?? 'Circular'}, GCN ${gcnNo(hp.alertKey!)}`}
            </LcTip>
          )}
        </LcWrap></LcScroll>
        {gcn.length > 0 && (
          <Disclaimer>
            Circular values: {[...new Set(gcn.map(p => p.alertKey!))].map((k, i) => (
              <span key={k}>{i ? ', ' : ''}<UrlLink href={`#circ-${k}`} onClick={e => { e.preventDefault(); onOpenCircular(k); }}>GCN {gcnNo(k)}</UrlLink></span>
            ))}. Times are since the trigger each circular names{ukssdc.length ? ', usually the same BAT trigger as the curve' : ''}; a
            circular may quote an absorbed or unabsorbed flux, or a different band{ukssdc.length ? ', so its values can sit off the curve' : ', so values from different circulars may not line up'}.
          </Disclaimer>
        )}
        {curve && ukssdc.length > 0 && <Disclaimer>
          Swift-XRT light curve from the <UrlLink href={curve.url ?? 'https://www.swift.ac.uk/xrt_curves/'} target="_blank" rel="noopener noreferrer">UK Swift Science Data Centre</UrlLink> (data
          and full curve there; Evans et al. <UrlLink href="https://ui.adsabs.harvard.edu/abs/2007A%26A...469..379E" target="_blank" rel="noopener noreferrer">2007</UrlLink>,{' '}
          <UrlLink href="https://ui.adsabs.harvard.edu/abs/2009MNRAS.397.1177E" target="_blank" rel="noopener noreferrer">2009</UrlLink>). This work made use of data
          supplied by the UK Swift Science Data Centre at the University of Leicester.
        </Disclaimer>}
      </Card>
    </RecordSection>
  );
}
