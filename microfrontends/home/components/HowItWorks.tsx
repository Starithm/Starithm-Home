import { useEffect, useRef, useState } from 'react';
import {
  BAND, Card, Chip, Cloud, Curve, Loop, Merge, Node, Oval, Quote, SkyRow, Spine, Stored,
} from '../styled_components/HowItWorks.styled';

/* "From alert to event page": a spine of stages. Collect is ringed by its sources; Read, One event,
   Counterparts and Catalogues each reach out to a small card of real data from one event, GRB 260924A
   (canonical 811905208), as stored on 2026-11-13; Publish is the event page itself, so it has no card.
   No internals (models, embeddings, queues). The stages light up in turn; hovering one holds it. */

const EVENT_URL = '/novatrace/events/811905208';
const RA = 133.7628, DEC = 12.04325;

/* Swift-XRT 0.3–10 keV light curve (UKSSDC, target 01513082), log-binned: [log10 t (s), log10 flux (erg/cm²/s)]. */
const XRT: [number, number][] = [
  [2.069, -7.375], [2.197, -7.654], [2.308, -7.947], [2.432, -8.289], [2.528, -7.89], [3.578, -9.752], [3.66, -9.876],
  [4.196, -10.325], [4.333, -10.55], [4.537, -10.888], [4.634, -11.063], [4.964, -11.54], [4.988, -11.612], [5.256, -11.915],
];

/* Collect's sources around its oval: [name, colour, x (% of width), y (px)]. The oval sits at y 97–141. */
const SOURCES: [string, string | undefined, number, number][] = [
  ['GCN notices', undefined, 33, 6], ['GCN Circulars since 1997', undefined, 50, 6], ['ATels', undefined, 67, 6],
  ['Fermi', BAND.gamma, 21, 52], ['Swift', BAND.gamma, 35, 52], ['Einstein Probe', BAND.xray, 64, 52], ['SVOM', BAND.gamma, 79, 52],
  ['LIGO/Virgo/KAGRA', undefined, 17, 105], ['IceCube', BAND.neutrino, 32, 105], ['CHIME', BAND.radio, 68, 105], ['MAXI', BAND.xray, 82, 105],
  ['Konus-Wind', BAND.gamma, 24, 158], ['optical telescopes', BAND.optical, 39, 158], ['VLA', BAND.radio, 61, 158], ['NuSTAR', BAND.xray, 75, 158],
  ['… and the teams who write circulars', undefined, 31, 206],
];

function Read() {
  return (
    <>
      <span className="label">From the circular text</span>
      <Quote>“… giving a redshift estimate of <mark>z = 3.51 +/- 0.10</mark>”</Quote>
      <Stored><span className="arrow">→</span><b>redshift 3.51 ± 0.10</b><Chip>spectroscopic</Chip><span className="src">GCN 45740</span></Stored>
      <span className="note">Magnitudes, limits, fluxes, durations and positions too, each with its sentence.</span>
    </>
  );
}

function OneEvent() {
  return (
    <>
      <span className="label">Different names, one event</span>
      <Merge>
        <div className="names">
          <Chip $color={BAND.gamma}>Fermi trigger 811905208</Chip>
          <Chip $color={BAND.gamma}>Swift trigger 1513082</Chip>
          <Chip>GRB 260924A</Chip>
        </div>
        <span className="to">→</span>
        <a className="one" href={EVENT_URL} style={{ textDecoration: 'none', color: 'inherit' }}>
          <b>GRB 260924A</b>
          <span className="note">10 notices · 29 circulars</span>
        </a>
      </Merge>
    </>
  );
}

function Counterparts() {
  const [img, setImg] = useState(true);
  // A 168″ field (336 px at 0.5″): the whole 72″-radius region searched for known sources fits in it.
  // Legacy Surveys, not CDS hips2fits: on 2026-11-13 hips2fits returned 404 for every survey.
  const FIELD = 168, PX = 112, perArcsec = PX / FIELD;
  const src = `https://www.legacysurvey.org/viewer/cutout.jpg?ra=${RA}&dec=${DEC}&layer=ls-dr10&pixscale=0.5&size=${FIELD * 2}`;
  return (
    <>
      <span className="label">Around the position</span>
      <SkyRow>
        <figure>
          {img && <img src={src} alt="Legacy Surveys archival image of the GRB 260924A field" loading="lazy" onError={() => setImg(false)} />}
          <svg viewBox={`0 0 ${PX} ${PX}`} aria-hidden="true">
            <circle cx={PX / 2} cy={PX / 2} r={72 * perArcsec} fill="none" stroke="rgba(231, 223, 221, 0.35)" strokeDasharray="3 4" />
            <circle cx={PX / 2} cy={PX / 2} r={3} fill="none" stroke="var(--starithm-nebula-teal)" strokeWidth={1.4} />
            {[[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dx, dy], k) => (
              <line key={k} x1={PX / 2 + dx * 7} y1={PX / 2 + dy * 7} x2={PX / 2 + dx * 13} y2={PX / 2 + dy * 13} stroke="var(--starithm-nebula-teal)" strokeWidth={1.2} />
            ))}
          </svg>
        </figure>
        <ul>
          <li><b>X-ray</b> position, 2.1″, Swift-XRT</li>
          <li><b>Optical</b> afterglow, OSN 1.5 m</li>
          <li><b>Radio</b> at 15 GHz, VLA</li>
          <li><b>Known sources</b>: none within 72″ in 4FGL, XMM, 2SXPS</li>
        </ul>
      </SkyRow>
      <span className="note">Candidates from Lasair, TNS and Fink when there is no afterglow yet. Image: Legacy Surveys.</span>
    </>
  );
}

function Catalogues() {
  // log t 2 … 5.4 (100 s … 2.9 d), log F −12.2 … −7.2
  const W = 440, H = 120, L = 46, B = 22;
  const x = (lt: number) => L + ((lt - 2) / 3.4) * (W - L - 6);
  const y = (lf: number) => 6 + ((-7.2 - lf) / 5) * (H - B - 6);
  // the orbit gap (Swift slews away) splits the line
  const segs: [number, number][][] = [[]];
  XRT.forEach((p, i) => { if (i && p[0] - XRT[i - 1][0] > 0.5) segs.push([]); segs[segs.length - 1].push(p); });
  return (
    <>
      <span className="label">Refined later by the missions</span>
      <Curve viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Swift-XRT X-ray light curve of GRB 260924A, fading from about 4 × 10⁻⁸ to 1 × 10⁻¹² erg/cm²/s between 100 seconds and 2 days">
        <line className="ax" x1={L} y1={H - B} x2={W - 4} y2={H - B} />
        <line className="ax" x1={L} y1={4} x2={L} y2={H - B} />
        {[[2, '100 s'], [3.556, '1 h'], [4.937, '1 d']].map(([t, l]) => (
          <text key={l} className="tick" x={x(t as number)} y={H - 4} textAnchor="middle">{l}</text>
        ))}
        {[[-8, '10⁻⁸'], [-12, '10⁻¹²']].map(([f, l]) => (
          <text key={l} className="tick" x={L - 6} y={y(f as number) + 4} textAnchor="end">{l}</text>
        ))}
        {segs.map((s, k) => <polyline key={k} className="ln" points={s.map(([t, f]) => `${x(t)},${y(f)}`).join(' ')} />)}
        {XRT.map(([t, f]) => <circle key={t} className="pt" cx={x(t)} cy={y(f)} r={2.6} />)}
      </Curve>
      <span className="note">Swift-XRT light curve, 0.3–10 keV (UKSSDC). T90 337.9 ± 2.3 s in the Fermi GBM catalogue, 344.8 s in the Swift GRB table.</span>
    </>
  );
}

const STAGES: { name: string; card?: () => JSX.Element }[] = [
  { name: 'Collect' },
  { name: 'Read', card: Read },
  { name: 'One event', card: OneEvent },
  { name: 'Counterparts', card: Counterparts },
  { name: 'Catalogues', card: Catalogues },
  { name: 'Publish' },
];

const STEP_MS = 3800;

export function HowItWorks() {
  const [on, setOn] = useState(0);
  const [hold, setHold] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(es => setVisible(es.some(e => e.isIntersecting)), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (hold || !visible || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setOn(i => (i + 1) % STAGES.length), STEP_MS);
    return () => clearInterval(t);
  }, [hold, visible]);
  const hover = (i: number) => ({ onMouseEnter: () => { setOn(i); setHold(true); } });
  const last = STAGES.length - 1;
  return (
    <>
      <Spine ref={ref} onMouseLeave={() => setHold(false)} role="list" aria-label="From alert to event page">
        <Cloud $on={on === 0} role="listitem" {...hover(0)}>
          {SOURCES.map(([n, c, x, y]) => (
            <Chip key={n} className="pill" $color={c} style={{ left: `${x}%`, top: y }}>{n}</Chip>
          ))}
          <div className="oval"><Oval $on={on === 0}><small>01</small>Collect</Oval></div>
        </Cloud>
        {STAGES.slice(1).map((s, k) => {
          const i = k + 1, row = k + 2, C = s.card;
          return (
            <div key={s.name} role="listitem" style={{ display: 'contents' }}>
              <Node $row={row} $last={i === last} {...hover(i)}>
                <Oval $on={on === i}><small>{String(i + 1).padStart(2, '0')}</small>{s.name}</Oval>
              </Node>
              {C && (
                <Card $row={row} $side={k % 2 ? 'left' : 'right'} $on={on === i} {...hover(i)}>
                  <C />
                </Card>
              )}
            </div>
          );
        })}
      </Spine>
      <Loop>
        <a href={EVENT_URL} style={{ color: 'var(--accent-text)' }}>One page per event</a>, cited and searchable.
        New notices, circulars and corrections go through again, and the page updates.
      </Loop>
    </>
  );
}
