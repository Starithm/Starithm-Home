import React from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import type { Playback } from '../lib/usePlayback';
import { formatClock } from '../lib/playerMath';
import {
  Clock, IconButton, PlayButton, PlaybackError, Scrubber, Transport, VersionButton, VersionToggle, VolumeGroup,
} from '../styled_components/Ears.styled';

interface Props {
  playback: Playback;
  duration: number;
  disabled?: boolean;
}

export function TransportBar({ playback, duration, disabled }: Props) {
  const { time, playing, toggle, seek, version, setVersion, volume, setVolume, muted, toggleMute, error } = playback;
  const pct = duration ? `${Math.min(100, (time / duration) * 100)}%` : '0%';
  const volPct = `${muted ? 0 : volume * 100}%`;

  return (
    <>
      <Transport>
        <PlayButton onClick={toggle} disabled={disabled} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </PlayButton>
        <Clock>
          {formatClock(time)}
          <span> / {formatClock(duration)}</span>
        </Clock>
        <Scrubber
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={Math.min(time, duration)}
          onChange={e => seek(Number(e.target.value))}
          aria-label="Seek"
          style={{ '--pct': pct } as React.CSSProperties}
          disabled={disabled}
        />
        <VersionToggle role="group" aria-label="Which rendering to hear">
          <VersionButton $active={version === 'musical'} aria-pressed={version === 'musical'} onClick={() => setVersion('musical')}>
            Melody
          </VersionButton>
          <VersionButton $active={version === 'raw'} aria-pressed={version === 'raw'} onClick={() => setVersion('raw')}>
            Raw light
          </VersionButton>
        </VersionToggle>
        <VolumeGroup>
          <IconButton onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </IconButton>
          <input
            type="range"
            min={0}
            max={100}
            value={muted ? 0 : Math.round(volume * 100)}
            onChange={e => setVolume(Number(e.target.value) / 100)}
            aria-label="Volume"
            style={{ '--pct': volPct } as React.CSSProperties}
          />
        </VolumeGroup>
      </Transport>
      {error && <PlaybackError role="alert">{error}</PlaybackError>}
    </>
  );
}
