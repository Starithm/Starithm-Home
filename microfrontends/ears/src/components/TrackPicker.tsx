import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MelodyIndex, Track } from '../lib/melodies';
import { DayNav, IconButton, Picker, TrackTab, TrackTabs } from '../styled_components/Ears.styled';

interface Props {
  index: MelodyIndex;
  date: string;
  tracks: Track[];
  activeId: string | undefined;
  onDate: (date: string) => void;
  onTrack: (track: Track) => void;
}

/* Days that have music, newest first; arrows step between them. Then that day's tracks. */
export function TrackPicker({ index, date, tracks, activeId, onDate, onTrack }: Props) {
  const days = index.days.filter(d => d.track_count > 0 || d.date === date);
  const pos = days.findIndex(d => d.date === date);
  const newer = pos > 0 ? days[pos - 1] : undefined;
  const older = pos >= 0 && pos < days.length - 1 ? days[pos + 1] : undefined;

  return (
    <Picker aria-label="Choose a day and track">
      <DayNav>
        <IconButton onClick={() => older && onDate(older.date)} disabled={!older} aria-label="Older day">
          <ChevronLeft size={14} />
        </IconButton>
        <span>{date}</span>
        <IconButton onClick={() => newer && onDate(newer.date)} disabled={!newer} aria-label="Newer day">
          <ChevronRight size={14} />
        </IconButton>
      </DayNav>
      <TrackTabs role="tablist">
        {tracks.map(track => (
          <TrackTab
            key={track.id}
            role="tab"
            aria-selected={track.id === activeId}
            $active={track.id === activeId}
            onClick={() => onTrack(track)}
            title={`${track.title} · ${track.target.name}`}
          >
            {track.title}
          </TrackTab>
        ))}
      </TrackTabs>
    </Picker>
  );
}
