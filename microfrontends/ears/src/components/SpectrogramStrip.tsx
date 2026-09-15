import { useRef } from 'react';
import { Playhead, Strip, StripImage } from '../styled_components/Ears.styled';

interface Props {
  url: string;
  time: number;
  duration: number;
  onSeek: (t: number) => void;
}

/* The musical rendering as a spectrogram. The image's columns are exactly aligned to song
 * time, so the playhead position is simply time / duration. Click or use arrow keys to seek. */
export function SpectrogramStrip({ url, time, duration, onSeek }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pct = duration ? Math.min(100, (time / duration) * 100) : 0;

  const seekFromPointer = (clientX: number) => {
    const box = ref.current?.getBoundingClientRect();
    if (box && box.width) onSeek(((clientX - box.left) / box.width) * duration);
  };

  return (
    <Strip
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Spectrogram of the music, select to seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(time)}
      onClick={e => seekFromPointer(e.clientX)}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') onSeek(time + 5);
        if (e.key === 'ArrowLeft') onSeek(time - 5);
      }}
    >
      <StripImage src={url} alt="" draggable={false} />
      <Playhead style={{ left: `${pct}%` }} />
    </Strip>
  );
}
