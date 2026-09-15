import { useEffect, useRef } from 'react';
import type { PlayerData, Track } from '../lib/melodies';
import { chapterIndex, formatClock } from '../lib/playerMath';
import {
  Credits, Label, Science, SciencePara, Stanza, StanzaHead, StanzaText, Stanzas,
} from '../styled_components/Ears.styled';
import { SpectrumPlot } from './SpectrumPlot';

interface Props {
  track: Track;
  player: PlayerData | undefined;
  time: number;
  onSeek: (t: number) => void;
}

/* The poem, one stanza per chapter of the song. The stanza being heard is lit; selecting a
 * stanza jumps the music there. Below it, the plain-language science and the credits. */
export function StoryPanel({ track, player, time, onSeek }: Props) {
  const active = chapterIndex(track.chapters, time);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // keep the lit stanza in view, but only when the panel scrolls on its own (desktop)
    const box = listRef.current;
    const item = itemRefs.current[active];
    if (!box || !item || box.scrollHeight <= box.clientHeight + 4) return;
    box.scrollTo({ top: Math.max(0, item.offsetTop - box.clientHeight * 0.2), behavior: 'smooth' });
  }, [active]);

  return (
    <>
      <Label>{track.chapters.length ? 'The poem' : 'About this track'}</Label>
      {track.chapters.length > 0 && (
        <Stanzas ref={listRef}>
          {track.chapters.map((chapter, k) => (
            <Stanza
              key={`${chapter.start_s}-${k}`}
              ref={el => { itemRefs.current[k] = el; }}
              $active={k === active}
              aria-current={k === active ? 'true' : undefined}
              onClick={() => onSeek(chapter.start_s)}
            >
              <StanzaHead>
                <span>{String(k + 1).padStart(2, '0')} · {chapter.heading}</span>
                <span>{formatClock(chapter.start_s)}</span>
              </StanzaHead>
              <StanzaText $active={k === active}>{chapter.text}</StanzaText>
            </Stanza>
          ))}
        </Stanzas>
      )}

      <Science>
        <Label>The science</Label>
        <SciencePara>
          {track.science_note ||
            `Music made from a JWST ${track.observation.instrument} spectral cube of ${track.target.name}.`}
        </SciencePara>
        {player && <SpectrumPlot player={player} />}
        <Credits>
          <a href={track.observation.program_url} target="_blank" rel="noreferrer">
            JWST program {track.observation.program_id}
          </a>
          {track.observation.program_title ? `: ${track.observation.program_title}` : ''}
          <br />
          Sonified from {track.observation.file}
          {track.ai && (
            <>
              <br />
              Poem written by an AI model ({track.ai.model.split('/').pop()}) from the measured data.
            </>
          )}
        </Credits>
      </Science>
    </>
  );
}
