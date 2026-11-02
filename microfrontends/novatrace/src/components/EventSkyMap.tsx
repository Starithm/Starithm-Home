import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

/* Sky map of an event's error region with a list beside it: hover a row or a marker to highlight
 * both, click either for a details card at the source. Drawn live from the event API's coordinates
 * (catalog sources, optical candidates, Fink region sources); nothing is pre-rendered.
 * Gnomonic projection about the event position, north up, east left, as on the sky.
 * The region is a HEALPix credible region when the lookup searched one (GBM maps), drawn from its
 * pixel corners with its 50% core shaded darker, otherwise the error circle. With a region the list
 * runs most probable first and folds away the `minor` points (unassociated 4FGL sources). */

export type PointKind = '4FGL' | 'TeVCat' | 'XMM' | '2SXPS' | '2RXS' | 'optical' | 'region';

/** A HEALPix credible region and its core: per pixel, its four [ra, dec] corners. */
export interface SkyRegion {
  level: number | null; areaDeg2: number | null; outline: [number, number][][];
  coreLevel?: number | null; coreAreaDeg2?: number | null; coreOutline?: [number, number][][];
}

export interface SkyPoint {
  key: string; kind: PointKind; name: string; ra: number; dec: number; sepDeg: number | null;
  /** Details card rows, label → value; a missing value is left out. */
  details: [string, React.ReactNode][];
  url?: string | null;
  /** Smallest credible region of the map holding the point (0.2 = the 20% region). */
  level?: number | null;
  /** Listed under a fold rather than in the main list. */
  minor?: boolean;
}

const KINDS: Record<PointKind, { label: string; color: string; shape: 'diamond' | 'star' | 'circle' | 'square' | 'triangle' | 'ring' | 'cross' }> = {
  optical: { label: 'Optical candidate', color: 'var(--accent-text)', shape: 'ring' },
  region: { label: 'Rubin source (Fink)', color: 'var(--text-muted)', shape: 'cross' },
  '4FGL': { label: 'Fermi-LAT 4FGL', color: 'var(--starithm-selective-yellow)', shape: 'diamond' },
  TeVCat: { label: 'TeVCat', color: 'var(--starithm-electric-violet)', shape: 'star' },
  XMM: { label: 'XMM 5XMM', color: 'var(--starithm-nebula-teal)', shape: 'circle' },
  '2SXPS': { label: 'Swift-XRT 2SXPS', color: 'var(--starithm-link)', shape: 'square' },
  '2RXS': { label: 'ROSAT 2RXS', color: 'var(--starithm-veronica-dark)', shape: 'triangle' },
};
const KIND_ORDER = Object.keys(KINDS) as PointKind[];
const SIZE = 460;
const PAD = 18;

function project(ra: number, dec: number, ra0: number, dec0: number): [number, number] {
  const r = Math.PI / 180;
  const d = dec * r, d0 = dec0 * r, da = (ra - ra0) * r;
  const cosc = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(da);
  const x = (Math.cos(d) * Math.sin(da)) / cosc / r;
  const y = (Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(da)) / cosc / r;
  return [-x, y];
}

export const sepText = (d: number | null) => (d == null ? '—' : d < 0.1 ? `${(d * 3600).toFixed(0)}″` : `${d.toFixed(2)}°`);

function Marker({ kind, x, y, active }: { kind: PointKind; x: number; y: number; active: boolean }) {
  const { color, shape } = KINDS[kind];
  const z = active ? 7.5 : 4;
  const fill = { fill: color, fillOpacity: active ? 1 : 0.8, stroke: active ? 'var(--foreground)' : 'none', strokeWidth: 1.5 };
  const line = { fill: 'none', stroke: color, strokeWidth: active ? 2.5 : 1.6 };
  switch (shape) {
    case 'circle': return <circle cx={x} cy={y} r={z} {...fill} />;
    case 'square': return <rect x={x - z} y={y - z} width={2 * z} height={2 * z} {...fill} />;
    case 'diamond': return <polygon points={`${x},${y - z * 1.3} ${x + z * 1.3},${y} ${x},${y + z * 1.3} ${x - z * 1.3},${y}`} {...fill} />;
    case 'star': {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = (Math.PI / 5) * i - Math.PI / 2, r = i % 2 ? z * 0.65 : z * 1.6;
        return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
      });
      return <polygon points={pts.join(' ')} {...fill} />;
    }
    case 'triangle': return <polygon points={`${x},${y - z * 1.3} ${x + z * 1.2},${y + z} ${x - z * 1.2},${y + z}`} {...fill} />;
    case 'ring': return <circle cx={x} cy={y} r={z * 1.4} {...line} />;
    default: return <path d={`M${x - z} ${y - z}L${x + z} ${y + z}M${x + z} ${y - z}L${x - z} ${y + z}`} {...line} />;
  }
}

const Glyph = ({ kind }: { kind: PointKind }) => (
  <svg width="14" height="14" aria-hidden style={{ flex: 'none' }}><Marker kind={kind} x={7} y={7} active={false} /></svg>
);

export function EventSkyMap({ points, raDeg, decDeg, errorDeg, region, note }: {
  points: SkyPoint[]; raDeg: number; decDeg: number; errorDeg: number | null; region?: SkyRegion | null; note?: React.ReactNode;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [filter, setFilter] = useState<PointKind | 'all'>('all');
  const [showMinor, setShowMinor] = useState(false);

  const corners = useMemo(() => (region?.outline ?? []).map(px => px.map(([ra, dec]) => project(ra, dec, raDeg, decDeg))), [region, raDeg, decDeg]);
  const coreCorners = useMemo(() => (region?.coreOutline ?? []).map(px => px.map(([ra, dec]) => project(ra, dec, raDeg, decDeg))), [region, raDeg, decDeg]);
  // Extent: the region (or error circle) or the farthest source, whichever is larger.
  const extent = Math.max(corners.length ? 0 : errorDeg ?? 0, ...corners.flat().map(([x, y]) => Math.max(Math.abs(x), Math.abs(y))),
    ...points.map(p => p.sepDeg ?? 0), 1 / 3600) * 1.1;
  const scale = (SIZE / 2 - PAD) / extent;
  // One path for every pixel, so the shared edges don't show as seams.
  const toPath = (px: [number, number][][]) => px.map(c => `M${c.map(([x, y]) => `${(SIZE / 2 + x * scale).toFixed(1)},${(SIZE / 2 - y * scale).toFixed(1)}`).join('L')}Z`).join('');
  const regionPath = toPath(corners);
  const corePath = toPath(coreCorners);
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  const regionLabel = region ? `${pct(region.level ?? 0.9)} region` : null;
  const core = region?.coreLevel ?? 0.5;
  const coreLabel = corePath ? `${pct(core)} region` : null;
  const xy = useMemo(() => new Map(points.map(p => {
    const [x, y] = project(p.ra, p.dec, raDeg, decDeg);
    return [p.key, [SIZE / 2 + x * scale, SIZE / 2 - y * scale] as [number, number]];
  })), [points, raDeg, decDeg, scale]);

  const kinds = KIND_ORDER.filter(k => points.some(p => p.kind === k));
  const shown = points.filter(p => filter === 'all' || p.kind === filter);
  const byMap = shown.some(p => p.level != null);
  const sorted = [...shown].sort((a, b) => byMap ? (a.level ?? 2) - (b.level ?? 2) : (a.sepDeg ?? 1e9) - (b.sepDeg ?? 1e9));
  const list = byMap ? sorted.filter(p => !p.minor) : sorted;
  const minor = byMap ? sorted.filter(p => p.minor) : [];
  const active = hover ?? picked;
  // Draw the highlighted marker last so it sits on top.
  const drawn = [...shown].sort((a, b) => Number(a.key === active) - Number(b.key === active));
  const pick = picked ? points.find(p => p.key === picked) : null;
  // A filter that hides the open card's source closes it.
  const choose = (k: PointKind | 'all') => { setFilter(k); if (pick && k !== 'all' && pick.kind !== k) setPicked(null); };
  const pickXY = pick ? xy.get(pick.key)! : null;

  return (
    <Wrap>
      <MapCol>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" role="img"
          aria-label={`Sky map of the error region with ${points.length} sources`} onClick={() => setPicked(null)}>
          {regionPath && <path d={regionPath} fill="var(--accent-text)" fillOpacity={0.12} />}
          {corePath && <path d={corePath} fill="var(--accent-text)" fillOpacity={0.16} />}
          {!regionPath && errorDeg != null && errorDeg > 0 && (
            <circle cx={SIZE / 2} cy={SIZE / 2} r={errorDeg * scale} fill="none" stroke="var(--accent-text)" strokeDasharray="4 4" strokeOpacity={0.7} />
          )}
          <path d={`M${SIZE / 2 - 8} ${SIZE / 2}h16M${SIZE / 2} ${SIZE / 2 - 8}v16`} stroke="var(--foreground)" />
          <text x={SIZE - PAD} y={PAD} textAnchor="end" fontSize="10" fill="var(--text-muted)">N ↑  E ←</text>
          <text x={PAD} y={SIZE - 6} fontSize="10" fill="var(--text-muted)">
            {regionPath && regionLabel ? `${regionLabel}${region?.areaDeg2 != null ? ` · ${Math.round(region.areaDeg2).toLocaleString()} deg²` : ''}${coreLabel && region?.coreAreaDeg2 != null ? ` · ${coreLabel} ${Math.round(region.coreAreaDeg2).toLocaleString()} deg²` : ''}`
              : errorDeg != null ? `error radius ${sepText(errorDeg)}` : `map radius ${sepText(extent)}`}
          </text>
          {drawn.map(p => {
            const [x, y] = xy.get(p.key)!;
            return (
              <g key={p.key} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHover(p.key)} onMouseLeave={() => setHover(null)}
                onClick={(e) => { e.stopPropagation(); setPicked(p.key); }}>
                <title>{p.name}</title>
                <Marker kind={p.kind} x={x} y={y} active={p.key === active} />
              </g>
            );
          })}
        </svg>
        {pick && pickXY && (
          <Card role="dialog" aria-label={pick.name}
            style={{ left: `min(${(pickXY[0] / SIZE) * 100}% + 10px, 100% - 280px)`, top: `calc(${(pickXY[1] / SIZE) * 100}% + 10px)` }}>
            <CardHead>
              <strong>{pick.url ? <a href={pick.url} target="_blank" rel="noopener noreferrer">{pick.name}</a> : pick.name}</strong>
              <Close onClick={() => setPicked(null)} aria-label="Close">×</Close>
            </CardHead>
            <Faint>{KINDS[pick.kind].label} · {sepText(pick.sepDeg)} from the event position</Faint>
            {pick.level != null && <Faint>{pick.level <= core ? `Inside the ${pct(core)} region` : `At the ${pct(pick.level)} level of the map`}</Faint>}
            <CardGrid>
              {pick.details.filter(([, v]) => v != null && v !== '').map(([k, v]) => (
                <React.Fragment key={k}><Faint>{k}</Faint><span>{v}</span></React.Fragment>
              ))}
            </CardGrid>
          </Card>
        )}
        <Legend>
          {kinds.map(k => <span key={k}><Glyph kind={k} />{KINDS[k].label}</span>)}
          {corePath && <span><Swatch $core /> {coreLabel}</span>}
          {regionPath ? <span><Swatch /> {regionLabel} (localisation map)</span>
            : errorDeg != null && <span><Dash>- - -</Dash> error region</span>}
        </Legend>
        {note && <Note>{note}</Note>}
      </MapCol>

      <ListCol>
        <Chips>
          <Chip $on={filter === 'all'} onClick={() => choose('all')}>All {points.length}</Chip>
          {kinds.map(k => (
            <Chip key={k} $on={filter === k} onClick={() => choose(k)}>
              {k === 'optical' ? 'Optical' : k === 'region' ? 'Rubin' : k} {points.filter(p => p.kind === k).length}
            </Chip>
          ))}
        </Chips>
        {byMap && <Faint as="div" style={{ fontSize: 11, marginBottom: 6 }}>Most probable first</Faint>}
        <List>
          {[...list, ...(showMinor ? minor : [])].map((p, i) => (
            <React.Fragment key={p.key}>
              {showMinor && i === list.length && <Fold onClick={() => setShowMinor(false)}>Hide {minor.length} unassociated</Fold>}
              <Item $on={p.key === active}
                onMouseEnter={() => setHover(p.key)} onMouseLeave={() => setHover(null)} onClick={() => setPicked(p.key)}>
                <Glyph kind={p.kind} />
                <Name>{p.name}</Name>
                {p.level != null && p.level <= core && <Tag>{pct(core)}</Tag>}
                <Faint>{sepText(p.sepDeg)}</Faint>
              </Item>
            </React.Fragment>
          ))}
          {minor.length > 0 && !showMinor && (
            <Fold onClick={() => setShowMinor(true)}>Show {minor.length} unassociated 4FGL source{minor.length === 1 ? '' : 's'}</Fold>
          )}
        </List>
      </ListCol>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: minmax(0, ${SIZE}px) minmax(220px, 1fr);
  gap: 16px;
  align-items: start;
  margin-bottom: 12px;
  @media (max-width: 760px) { grid-template-columns: minmax(0, 1fr); }
`;
const MapCol = styled.div`
  position: relative;
  svg[role='img'] { display: block; background: var(--surface-sunken); border: 1px solid var(--line-hairline); }
`;
const ListCol = styled.div`min-width: 0;`;
const Card = styled.div`
  position: absolute;
  z-index: 5;
  width: 270px;
  padding: 10px 12px;
  background: var(--surface-raised);
  border: 1px solid var(--line-control);
  font-size: 12px;
  line-height: 1.55;
  color: var(--text-body);
  a { color: inherit; }
`;
const CardHead = styled.div`display: flex; justify-content: space-between; gap: 8px; word-break: break-word;`;
const Close = styled.button`background: none; border: 0; color: var(--text-muted); cursor: pointer; font-size: 15px; line-height: 1;`;
const CardGrid = styled.div`
  margin-top: 6px;
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: 10px;
  span { overflow-wrap: anywhere; }
`;
const Faint = styled.span`color: var(--text-muted);`;
const Note = styled.div`margin-top: 6px; font-size: 11px; line-height: 1.5; color: var(--text-muted);`;
const Legend = styled.div`
  display: flex; gap: 14px; flex-wrap: wrap; font-size: 11px; margin-top: 8px; color: var(--text-secondary);
  span { display: inline-flex; align-items: center; gap: 5px; }
`;
const Dash = styled.span`color: var(--accent-text);`;
const Swatch = styled.span<{ $core?: boolean }>`width: 12px; height: 10px; background: var(--accent-text); opacity: ${p => (p.$core ? 0.5 : 0.25)};`;
const Tag = styled.span`font-size: 10px; padding: 0 4px; color: var(--accent-text); border: 1px solid var(--accent-border);`;
const Fold = styled.button`
  display: block; width: 100%; text-align: left; padding: 6px; font-size: 11px; cursor: pointer;
  background: none; border: 0; border-bottom: 1px solid var(--line-subtle); color: var(--accent-text);
`;
const Chips = styled.div`display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;`;
const Chip = styled.button<{ $on: boolean }>`
  font-size: 11px;
  padding: 3px 8px;
  cursor: pointer;
  background: none;
  color: ${p => (p.$on ? 'var(--accent-text)' : 'var(--text-muted)')};
  border: 1px solid ${p => (p.$on ? 'var(--accent-text)' : 'var(--line-control)')};
`;
const List = styled.div`
  max-height: ${SIZE - 20}px;
  overflow-y: auto;
  border-top: 1px solid var(--line-subtle);
  scrollbar-width: thin;
  scrollbar-color: var(--line-control) transparent;
`;
const Item = styled.div<{ $on: boolean }>`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 5px 6px;
  cursor: pointer;
  font-size: 12px;
  border-bottom: 1px solid var(--line-subtle);
  background: ${p => (p.$on ? 'var(--surface-raised)' : 'transparent')};
`;
const Name = styled.span`flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`;
