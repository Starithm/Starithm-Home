import { BEAT_MS, BITS_PER_NOTE, BPM, DOWNLINK_BPS, noteName, type Beat } from '../lib/signal-music';
import { useNow } from '../lib/use-now';
import {
  Bit, BitBudget, NowPlaying, BitTrack, Fine, Panel, PanelHead, PanelTitle, PlayButton, Prose, Roll, Tag, TextButton, Transport,
} from '../styled_components/Voyager.styled';

interface Props {
  playing: boolean;
  toggle: () => void;
  beats: Beat[];
  beatStart: number | null;
  live: boolean;
  midiOutputs: { id: string; name: string }[];
  midiId: string;
  setMidiId: (id: string) => void;
  connectMidi: () => void;
  midiError: string | null;
}

const LOW = 45;
const HIGH = 86;
const CELLS = 48;

export function MusicPanel(p: Props) {
  const now = useNow(50);
  const elapsed = p.playing && p.beatStart ? Math.min(BEAT_MS, now - p.beatStart) : 0;
  const bits = Math.floor((elapsed / 1000) * DOWNLINK_BPS);
  const lit = Math.round((bits / BITS_PER_NOTE) * CELLS);
  const last = p.beats[p.beats.length - 1];

  const W = 640;
  const H = 170;
  const span = 32;
  const y = (n: number) => H - 10 - ((n - LOW) / (HIGH - LOW)) * (H - 20);
  const colW = W / span;

  return (
    <Panel>
      <PanelHead>
        <PanelTitle>The signal as music</PanelTitle>
        <Tag $tone={p.live ? 'live' : 'idle'}>{p.live ? 'Driven by the live signal' : 'Driven by distance'}</Tag>
      </PanelHead>

      <Prose>
        Voyager 1 sends <strong>{DOWNLINK_BPS} bits a second</strong>. At {BPM} beats a minute each note lasts
        {BEAT_MS / 1000} s, the time it takes the spacecraft to send <strong>{BITS_PER_NOTE} bits</strong>. One note, one
        breath of data.
      </Prose>

      <Transport>
        <PlayButton $on={p.playing} onClick={p.toggle}>
          {p.playing ? '■ Stop' : '▶ Listen'}
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
        {last && (
          <NowPlaying>
            {noteName(last.melody)} + {noteName(last.tin)}{last.pedal ? ' + B2' : ''} · vel {last.velocity}
          </NowPlaying>
        )}
      </Transport>
      {p.midiError && <Fine as="div" style={{ margin: '-6px 0 12px' }}>{p.midiError}</Fine>}

      <BitBudget>
        <div>
          <span>bits received this beat</span>
          <span>{String(bits).padStart(3, '0')} / {BITS_PER_NOTE}</span>
        </div>
        <BitTrack>
          {Array.from({ length: CELLS }, (_, i) => <Bit key={i} $on={i < lit} />)}
        </BitTrack>
      </BitBudget>

      <Roll viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="The last 32 notes">
        {[47, 59, 71, 83].map((n) => (
          <line key={n} x1={0} x2={W} y1={y(n)} y2={y(n)} stroke="var(--line-hairline)" strokeDasharray="2 6" />
        ))}
        {p.beats.slice(-span).map((b, i, arr) => {
          const x = (span - arr.length + i) * colW;
          const fresh = i === arr.length - 1 ? 1 : 0.35 + (0.5 * i) / arr.length;
          return (
            <g key={b.at} opacity={fresh}>
              <rect x={x + 2} y={y(b.melody) - 3} width={colW - 4} height={6} rx={2} fill="var(--accent-text)" />
              <rect x={x + 2} y={y(b.tin) - 2} width={colW - 4} height={4} rx={2} fill="var(--starithm-golden-yellow)" />
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
        note below it, after Arvo Pärt's tintinnabuli in <em>Für Alina</em>. While a dish receives Voyager 1, the
        received power picks each step and sets how loud it is; otherwise the metres travelled in that beat pick
        it. The real data bits aren't published, so this is the signal's shape, not its content. At the event,
        press Space on the slide as the piano starts: its ripples then follow the piece's own notes and rests.
      </Fine>
    </Panel>
  );
}
