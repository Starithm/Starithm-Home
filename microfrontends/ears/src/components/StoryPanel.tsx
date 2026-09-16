import { useEffect, useRef } from 'react';
import type { PlayerData, Track } from '../lib/melodies';
import { chapterIndex, formatClock } from '../lib/playerMath';
import {
  Arrangement, ArrangementReason, Credits, Instruments, Label, Science, SciencePara, Stanza, StanzaHead,
  StanzaText, Stanzas,
} from '../styled_components/Ears.styled';
import { SpectrumPlot } from './SpectrumPlot';

interface Props {
  track: Track;
  player: PlayerData | undefined;
  time: number;
  onSeek: (t: number) => void;
}

const ROOM: Record<string, string> = {
  room: 'a small room',
  hall: 'a warm hall',
  cathedral: 'a vast, echoing space',
};

/** "violas, concert harp and contrabass" */
function readableList(items: string[]): string {
  if (items.length < 2) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
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

      {track.arrangement && track.arrangement.instruments?.length > 0 && (
        <Arrangement>
          <Label>How it sounds</Label>
          <Instruments>
            {readableList(track.arrangement.instruments)}
            {track.arrangement.scale ? `, in ${track.arrangement.scale}` : ''}
            {track.arrangement.space && ROOM[track.arrangement.space]
              ? `, heard in ${ROOM[track.arrangement.space]}`
              : ''}
            .
          </Instruments>
          {track.arrangement.reason && <ArrangementReason>{track.arrangement.reason}</ArrangementReason>}
        </Arrangement>
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
              Poem written by an AI model from the measured data.
            </>
          )}
          {track.arrangement?.chosen_by === 'ai' && (
            <>
              <br />
              Instruments chosen by an AI model from the measured data. The data alone decides every note.
            </>
          )}
        </Credits>
      </Science>
    </>
  );
}
