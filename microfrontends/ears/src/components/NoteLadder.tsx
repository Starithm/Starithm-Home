import React, { useMemo } from 'react';
import type { PlayerData } from '../lib/melodies';
import { friendlyLineName, lineSymbol } from '../lib/melodies';
import { levelsAt } from '../lib/playerMath';
import {
  Ladder, LadderCaption, LadderFill, LadderHz, LadderRow, LadderTag, LadderTrack, Label,
} from '../styled_components/Ears.styled';

interface Props {
  player: PlayerData;
  time: number;
  active: boolean;
}

const LIT = 0.25;

/* Every note of the scale, highest at the top, with how loud it is right now.
 * Notes tied to a detected spectral line carry its element symbol. */
export function NoteLadder({ player, time, active }: Props) {
  // before playing, show each note's average over the whole song, faintly, so the ladder isn't blank
  const idle = useMemo(
    () => player.notes.map((_, k) => player.levels.reduce((sum, row) => sum + row[k], 0) / Math.max(1, player.levels.length) / 100),
    [player],
  );
  const levels = active ? levelsAt(player, time) : idle;
  const rows = player.notes.map((note, k) => ({ ...note, level: levels[k] })).reverse();

  return (
    <>
      <Label>Note ladder · D minor pent.</Label>
      <Ladder aria-label="Notes of the scale and their current loudness">
        {rows.map(row => {
          const lit = active && row.level >= LIT;
          const style = { '--level': row.level.toFixed(3) } as React.CSSProperties;
          const lineNames = row.lines.map(friendlyLineName).join(', ');
          return (
            <LadderRow key={row.hz} $lit={lit} title={lineNames ? `${row.hz} Hz · ${lineNames}` : `${row.hz} Hz`}>
              <LadderHz>{row.hz.toFixed(1)}</LadderHz>
              <LadderTrack>
                <LadderFill $lit={lit} style={style} />
              </LadderTrack>
              <LadderTag>{row.lines.length ? lineSymbol(row.lines) : ''}</LadderTag>
            </LadderRow>
          );
        })}
      </Ladder>
      <LadderCaption>Shorter wavelength, higher note. Bars show how loud each note is right now.</LadderCaption>
    </>
  );
}
