import { useMemo } from 'react';
import { BEAT_MS, BITS_PER_NOTE, BPM, DOWNLINK_BPS, noteName, phraseLength, type Beat } from '../lib/signal-music';
import { elevationAt, HORIZON_DEG, type Pass } from '../lib/sky-elevation';
import { useNow } from '../lib/use-now';
import {
  Bit, BitBudget, NowPlaying, BitTrack, Fine, Panel, PanelHead, PanelTitle, PlayButton, Prose, Roll, Tag, TextButton, Transport,
} from '../styled_components/Voyager.styled';

interface Props {
  playing: boolean;
  stop: () => void;
  beats: Beat[];
  beatStart: number | null;
  count: number;
  live: boolean;
  pass: Pass | null;
  passBeats: number;
  onLive: () => void;
  onPass: () => void;
  midiOutputs: { id: string; name: string }[];
  midiId: string;
  setMidiId: (id: string) => void;
  connectMidi: () => void;
  midiError: string | null;
}

const LOW = 45;
const HIGH = 86;
const CELLS = 48;

const utc = (ms: number) => `${new Date(ms).toISOString().slice(11, 16)} UTC`;

/* The elevation of Voyager over the pass being replayed, with a playhead. */
function PassArc({ pass, progress }: { pass: Pass; progress: number }) {
  const W = 640;
  const H = 120;
  const top = 75;
  const points = useMemo(
    () =>
      Array.from({ length: 97 }, (_, i) => {
        const t = pass.rise + (i / 96) * (pass.set - pass.rise);
        return [(i / 96) * W, H - 22 - (elevationAt(t, pass.station) / top) * (H - 34)] as const;
      }),
    [pass],
  );
  const at = Math.min(96, Math.round(progress * 96));
  const [hx, hy] = points[at];
  const horizon = H - 22 - (HORIZON_DEG / top) * (H - 34);

  return (
    <Roll viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 120, marginBottom: 10 }} role="img"
      aria-label={`Voyager's height over ${pass.station} during the pass`}>
      <line x1={0} x2={W} y1={horizon} y2={horizon} stroke="var(--line-hairline)" strokeDasharray="2 6" />
      <polyline points={points.map((p) => p.join(',')).join(' ')} fill="none" stroke="var(--text-faint)" strokeWidth={1.5} />
      <polyline points={points.slice(0, at + 1).map((p) => p.join(',')).join(' ')} fill="none"
        stroke="var(--starithm-nebula-teal)" strokeWidth={2.5} />
      <circle cx={hx} cy={hy} r={5} fill="var(--starithm-nebula-teal)" />
      <text x={6} y={H - 6} fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">rises {utc(pass.rise)}</text>
      <text x={W - 6} y={H - 6} textAnchor="end" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">
        sets {utc(pass.set)}
      </text>
      <text x={W / 2} y={14} textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">
        {pass.station} · highest {Math.round(pass.peakDeg)}°
      </text>
    </Roll>
  );
}

export function MusicPanel(p: Props) {
  const now = useNow(50);
  const elapsed = p.playing && p.beatStart ? Math.min(BEAT_MS, now - p.beatStart) : 0;
  const bits = Math.floor((elapsed / 1000) * DOWNLINK_BPS);
  const lit = Math.round((bits / BITS_PER_NOTE) * CELLS);
  const last = p.beats[p.beats.length - 1];
  const replaying = p.playing && !!p.pass;
  const listening = p.playing && !p.pass;

  const W = 640;
  const H = 170;
  const span = 32;
  const y = (n: number) => H - 10 - ((n - LOW) / (HIGH - LOW)) * (H - 20);
  const colW = W / span;

  return (
    <Panel>
      <PanelHead>
        <PanelTitle>The signal as music</PanelTitle>
        <Tag $tone={p.live && !p.pass ? 'live' : 'idle'}>
          {p.pass ? 'A whole pass, replayed' : p.live ? 'Driven by the live pass' : "Driven by Voyager's place in the sky"}
        </Tag>
      </PanelHead>

      <Prose>
        Voyager 1 sends <strong>{DOWNLINK_BPS} bits a second</strong>. At {BPM} beats a minute each note lasts{' '}
        {BEAT_MS / 1000} s, the time it takes the spacecraft to send <strong>{BITS_PER_NOTE} bits</strong>. The
        phrases follow Voyager across the sky of the dish listening to it: <strong>the higher it stands, the longer
        the phrase</strong>. While it rises each phrase falls to B; while it sets each phrase climbs back to B.
      </Prose>

      <Transport>
        <PlayButton $on={listening} onClick={listening ? p.stop : p.onLive}>
          {listening ? '■ Stop' : '▶ Listen live'}
        </PlayButton>
        <PlayButton $on={replaying} onClick={replaying ? p.stop : p.onPass}>
          {replaying ? '■ Stop' : `▶ A whole pass in ${Math.round(p.passBeats / 60)} min`}
        </PlayButton>
        {p.midiOutputs.length ? (
          <select value={p.midiId} onChange={(e) => p.setMidiId(e.target.value)} aria-label="MIDI output">
            <option value="">MIDI out: off</option>
            {p.midiOutputs.map((o) => (
              <option key={o.id} value={o.id}>MIDI → {o.name}</option>
            ))}
          </select>
        ) : (
          <TextButton onClick={p.connectMidi}>Send to a MIDI instrument…</TextButton>
        )}
      </Transport>
      {p.midiError && <Fine as="div" style={{ margin: '-6px 0 12px' }}>{p.midiError}</Fine>}
      {last && p.playing && (
        <NowPlaying as="div" style={{ marginBottom: 14 }}>
          {last.station} · Voyager {last.elevationDeg.toFixed(1)}° up, {last.rising ? 'rising' : 'setting'} · phrases
          of {phraseLength(last.elevationDeg)} ·{' '}
          {last.melody == null
            ? 'rest'
            : `${noteName(last.melody)} + ${noteName(last.tin!)}${last.pedal ? ' + B2' : ''} · vel ${last.velocity}`}
        </NowPlaying>
      )}

      {p.pass && <PassArc pass={p.pass} progress={p.count / p.passBeats} />}

      <BitBudget>
        <div>
          <span>bits received this beat</span>
          <span>{String(bits).padStart(3, '0')} / {BITS_PER_NOTE}</span>
        </div>
        <BitTrack>
          {Array.from({ length: CELLS }, (_, i) => <Bit key={i} $on={i < lit} />)}
        </BitTrack>
      </BitBudget>

      <Roll viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="The last 32 beats">
        {[47, 59, 71, 83].map((n) => (
          <line key={n} x1={0} x2={W} y1={y(n)} y2={y(n)} stroke="var(--line-hairline)" strokeDasharray="2 6" />
        ))}
        {p.beats.slice(-span).map((b, i, arr) => {
          const x = (span - arr.length + i) * colW;
          const fresh = i === arr.length - 1 ? 1 : 0.35 + (0.5 * i) / arr.length;
          return (
            <g key={b.at} opacity={fresh}>
              {b.melody != null && b.tin != null && (
                <>
                  <rect x={x + 2} y={y(b.melody) - 3} width={colW - 4} height={6} rx={2} fill="var(--accent-text)" />
                  <rect x={x + 2} y={y(b.tin) - 2} width={colW - 4} height={4} rx={2} fill="var(--starithm-golden-yellow)" />
                </>
              )}
              {b.pedal && <rect x={x + 2} y={y(47) - 2} width={colW * 6} height={4} rx={2} fill="var(--text-faint)" />}
            </g>
          );
        })}
        {!p.beats.length && (
          <text x={W / 2} y={H / 2} textAnchor="middle" fill="var(--text-faint)" fontSize="13" fontFamily="var(--font-mono)">
            press Listen
          </text>
        )}
      </Roll>

      <Fine>
        Melody (violet) steps through B minor; the second voice (gold) always takes the nearest B-minor triad
        note below it, after Arvo Pärt's tintinnabuli in <em>Für Alina</em>. Phrases run from 2 notes near the
        horizon to 8 at the top of the sky, each followed by a 3-beat rest, so a whole pass plays as an arch.
        Voyager's height is computed to the second from JPL's ephemeris; while a dish is receiving it, the
        received power sets how loud the notes are. The real data bits aren't published, so this is the
        signal's path, not its content. At the event, press Space on the slide as the piano starts: its ripples
        then follow the piece's own notes and rests.
      </Fine>
    </Panel>
  );
}
