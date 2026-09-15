import { useEffect, useRef, useState } from 'react';
import { Playhead, Strip, StripImage, StripShimmer } from '../styled_components/Ears.styled';

interface Props {
  url: string;
  time: number;
  duration: number;
  playing: boolean;
  onSeek: (t: number) => void;
}

/* The musical rendering as a spectrogram. The image's columns are exactly aligned to song
 * time, so the playhead position is simply time / duration. Click or use arrow keys to seek.
 * If the image is missing, a soft animated stand-in keeps the strip alive. */
export function SpectrogramStrip({ url, time, duration, playing, onSeek }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const pct = duration ? Math.min(100, (time / duration) * 100) : 0;

  useEffect(() => setFailed(false), [url]);

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
      {failed ? (
        <StripShimmer $playing={playing} aria-hidden="true" />
      ) : (
        <StripImage src={url} alt="" draggable={false} onError={() => setFailed(true)} />
      )}
      <Playhead style={{ left: `${pct}%` }} />
    </Strip>
  );
}
