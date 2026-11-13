import styled from 'styled-components';
import { useSkyCutout } from '@novatrace/lib/skyCutouts';

/* The sky at an event's position, with its error circle: a survey image (lib/skyCutouts.ts, first one that
 * loads), not interactive itself; where the image is from Legacy Surveys it opens their viewer at the
 * position. Renders nothing above SKY_CUTOUT_MAX_ERR_DEG or when no survey loads. */
export function SkyCutoutFigure({ ra, dec, errDeg, width }: { ra: number; dec: number; errDeg: number | null; width?: number }) {
  const { cutout: c, fov, onError } = useSkyCutout(ra, dec, errDeg);
  if (!c || errDeg == null) return null;
  const r = Math.max((errDeg / fov) * 50, 1.2); // error radius, % of the width
  const img = (
    <Frame>
      <img src={c.src} alt={`Sky survey image around the event position, ${c.caption}`} loading="lazy"
        onError={onError} />
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx={50} cy={50} r={r} fill="none" stroke="var(--starithm-nebula-teal)" strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
        {r < 6 && [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dx, dy], k) => (
          <line key={k} x1={50 + dx * (r + 2)} y1={50 + dy * (r + 2)} x2={50 + dx * (r + 6)} y2={50 + dy * (r + 6)}
            stroke="var(--starithm-nebula-teal)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
    </Frame>
  );
  return (
    <Figure style={width ? { width } : undefined}>
      {c.viewer ? <a href={c.viewer} target="_blank" rel="noopener noreferrer" title="Open in the Legacy Surveys sky viewer">{img}</a> : img}
      <figcaption>
        {c.caption} · {(fov * 60).toFixed(fov < 0.1 ? 1 : 0)}′ across, circle = error
        {c.viewer && <> · <a href={c.viewer} target="_blank" rel="noopener noreferrer">open viewer ↗</a></>}
      </figcaption>
    </Figure>
  );
}

const Figure = styled.figure`
  margin: 0; display: flex; flex-direction: column; gap: 6px; min-width: 0;
  figcaption { font-size: 11px; line-height: 1.5; color: var(--text-muted); }
  figcaption a { color: var(--accent-text); }
`;
const Frame = styled.div`
  position: relative; width: 100%; aspect-ratio: 1 / 1; border-radius: 6px; overflow: hidden;
  background: var(--surface-sunken); border: 1px solid var(--line-hairline);
  img, svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  /* page styles give svg a background; the overlay must not hide the image */
  svg { background: transparent !important; }
`;
