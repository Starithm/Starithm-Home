import { useState } from 'react';
import { ONE_LIGHT_DAY_UTC } from '../lib/ephemeris';
import { MOMENTS, RANGE, SPEEDS, travelTo, virtualNow, type Clock } from '../lib/time-travel';
import { useNow } from '../lib/use-now';
import { Chip, Chips, Dock, DockHead, Hint, Scrub } from '../styled_components/LiveSlide.styled';

interface Props {
  clock: Clock | null;
  onChange: (clock: Clock | null) => void;
  onClose: () => void;
}

const DAY = 86_400_000;

/* "T−18d 06h 12m" / "T+3d 04h" relative to the crossing */
function relative(ms: number) {
  const sign = ms < 0 ? '−' : '+';
  let s = Math.floor(Math.abs(ms) / 1000);
  const d = Math.floor(s / 86_400);
  s -= d * 86_400;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return d ? `T${sign}${d}d ${pad(h)}h ${pad(m)}m` : `T${sign}${pad(h)}h ${pad(m)}m ${pad(sec)}s`;
}

const stamp = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC',
});

/* Scrub the slide through time to see every state: the countdown, the last seconds, the
 * crossing and after. Only the slide travels; the panels below the slide stay on real time. */
export function TimeTravel({ clock, onChange, onClose }: Props) {
  const now = useNow(250);
  // the moment last picked stays lit while time runs on from it; scrubbing clears it
  const [picked, setPicked] = useState<string | null>(null);
  const t = virtualNow(clock, now);
  const offset = t - ONE_LIGHT_DAY_UTC;
  const speed = clock?.speed ?? 1;
  const crossAt = ((0 - RANGE.from) / (RANGE.to - RANGE.from)) * 100;

  return (
    <Dock role="region" aria-label="Time travel">
      <DockHead>
        <strong>Time travel</strong>
        <span>{stamp.format(t)} UTC</span>
        <em>{relative(offset)}</em>
        <Chip onClick={onClose} aria-label="Close time travel">Close (T)</Chip>
      </DockHead>

      <Chips>
        <Chip $on={!clock} onClick={() => { setPicked(null); onChange(null); }}>● Live now</Chip>
        {MOMENTS.map((m) => (
          <Chip
            key={m.key}
            $tone={m.offset < 0 ? 'teal' : 'gold'}
            $on={!!clock && picked === m.key}
            onClick={() => {
              setPicked(m.key);
              onChange(travelTo(ONE_LIGHT_DAY_UTC + m.offset));
            }}
          >
            {m.label}
          </Chip>
        ))}
      </Chips>

      <Scrub>
        <span>T−20 days</span>
        <div>
          <i style={{ left: `${crossAt}%` }} />
          <input
            type="range"
            min={RANGE.from}
            max={RANGE.to}
            step={60_000}
            value={Math.max(RANGE.from, Math.min(RANGE.to, offset))}
            onChange={(e) => {
              setPicked(null);
              onChange(travelTo(ONE_LIGHT_DAY_UTC + Number(e.target.value), speed));
            }}
            aria-label="Time relative to the crossing"
          />
        </div>
        <span>T+40 days</span>
      </Scrub>

      <Chips>
        {SPEEDS.map((s) => (
          <Chip key={s.speed} $on={!!clock && speed === s.speed} onClick={() => onChange(travelTo(t, s.speed))}>
            {s.label}
          </Chip>
        ))}
        <Hint style={{ alignSelf: 'center', marginLeft: 'auto' }}>
          {Math.abs(offset) < DAY ? 'crossing: 19 Nov 2026, 02:17:30 UTC' : 'gold tick on the track = the crossing'}
        </Hint>
      </Chips>
    </Dock>
  );
}
