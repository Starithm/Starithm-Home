import type { PlayerData } from '../lib/melodies';
import { SpectrumAxis, SpectrumFigure } from '../styled_components/Ears.styled';

/* Mean spectrum across the whole target, with detected lines marked: emission in yellow,
 * absorption in blue. */
export function SpectrumPlot({ player }: { player: PlayerData }) {
  const { wave_um: wave, flux } = player.spectrum;
  if (wave.length < 2) return null;

  const x0 = wave[0];
  const x1 = wave[wave.length - 1];
  const X = (v: number) => ((v - x0) / (x1 - x0 || 1)) * 400;
  const Y = (v: number) => 94 - v * 88;
  const d = wave.map((v, k) => `${k ? 'L' : 'M'}${X(v).toFixed(1)},${Y(flux[k]).toFixed(1)}`).join('');
  const marks = [
    ...player.lines.filter(l => l.kind === 'emission').slice(0, 4),
    ...player.lines.filter(l => l.kind === 'absorption').slice(0, 2),
  ];

  return (
    <SpectrumFigure>
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" role="img" aria-label="Mean spectrum of the target">
        {marks.map(m => (
          <line
            key={m.line}
            x1={X(m.observed_um)}
            x2={X(m.observed_um)}
            y1={2}
            y2={98}
            vectorEffect="non-scaling-stroke"
            style={{
              stroke: m.kind === 'emission' ? 'var(--starithm-selective-yellow)' : 'var(--starithm-link)',
              strokeOpacity: 0.55,
              strokeDasharray: '2 3',
            }}
          />
        ))}
        <path d={d} fill="none" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--accent-text)', strokeWidth: 1 }} />
      </svg>
      <SpectrumAxis>
        <span>{x0.toFixed(2)} µm</span>
        <span title={player.lines.map(m => m.line).join(' · ')}>
          {marks.slice(0, 3).map(m => m.line).join(' · ')}
          {player.lines.length > 3 ? ` +${player.lines.length - 3}` : ''}
        </span>
        <span>{x1.toFixed(2)} µm</span>
      </SpectrumAxis>
    </SpectrumFigure>
  );
}
