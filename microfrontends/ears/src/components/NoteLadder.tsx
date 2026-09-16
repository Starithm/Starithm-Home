import React, { useMemo } from 'react';
import type { PlayerData } from '../lib/melodies';
import { friendlyLineName, lineSymbol } from '../lib/melodies';
import { absorptionAt, levelsAt } from '../lib/playerMath';
import {
  Ladder, LadderAbsorb, LadderCaption, LadderFill, LadderHz, LadderRow, LadderTag, LadderTagAbsorb, LadderTrack, Label,
} from '../styled_components/Ears.styled';

interface Props {
  player: PlayerData;
  time: number;
  active: boolean;
  /** e.g. "D minor pentatonic". Every track chooses its own key and scale, so this is never assumed. */
  scale?: string;
}

const LIT = 0.25;

/* The ladder sits in a ~120px column, so full scale names like "D suspended pentatonic" wrap onto
 * a second line and push the rungs down. Shorten the words, keep the key. */
function shortScale(scale: string): string {
  return scale.replace(/\bsuspended\b/i, 'sus.').replace(/\bpentatonic\b/i, 'pent.');
}

function averageLevels(rows: number[][] | undefined, voices: number): number[] {
  if (!rows?.length) return Array(voices).fill(0);
  return Array.from({ length: voices }, (_, k) => rows.reduce((sum, row) => sum + row[k], 0) / rows.length / 100);
}

/* Every note of the scale, highest at the top, with how loud it is right now. Violet bars are
 * emission (tones); blue bars from the other end are absorption (breath). Notes tied to a detected
 * spectral line carry its element symbol. */
export function NoteLadder({ player, time, active, scale }: Props) {
  // before playing, show each note's average over the whole song, faintly, so the ladder isn't blank
  const idle = useMemo(() => averageLevels(player.levels, player.notes.length), [player]);
  const idleAbsorb = useMemo(() => averageLevels(player.absorption_levels, player.notes.length), [player]);
  const levels = active ? levelsAt(player, time) : idle;
  const absorb = active ? absorptionAt(player, time) : idleAbsorb;
  const hasAbsorption = player.notes.some(n => n.absorption_lines?.length);
  const rows = player.notes.map((note, k) => ({ ...note, level: levels[k], absorb: absorb[k] })).reverse();

  return (
    <>
      <Label>{scale ? `Note ladder · ${shortScale(scale)}` : 'Note ladder'}</Label>
      <Ladder aria-label="Notes of the scale and their current loudness">
        {rows.map(row => {
          const lit = active && (row.level >= LIT || row.absorb >= LIT);
          const style = { '--level': row.level.toFixed(3), '--absorb': row.absorb.toFixed(3) } as React.CSSProperties;
          const absorbing = row.absorption_lines ?? [];
          const names = [
            ...row.lines.map(friendlyLineName),
            ...absorbing.map(l => `${friendlyLineName(l)} (absorbing)`),
          ].join(', ');
          return (
            <LadderRow key={row.hz} $lit={lit} title={names ? `${row.hz} Hz · ${names}` : `${row.hz} Hz`}>
              <LadderHz>{row.hz.toFixed(1)}</LadderHz>
              <LadderTrack>
                <LadderFill $lit={active && row.level >= LIT} style={style} />
                {absorbing.length > 0 && <LadderAbsorb style={style} />}
              </LadderTrack>
              <LadderTag>
                {row.lines.length ? lineSymbol(row.lines) : ''}
                {absorbing.length > 0 && <LadderTagAbsorb>{lineSymbol(absorbing)}</LadderTagAbsorb>}
              </LadderTag>
            </LadderRow>
          );
        })}
      </Ladder>
      <LadderCaption>
        Shorter wavelength, higher note. Bars show how loud each note is right now
        {hasAbsorption ? '; blue bars are light absorbed by cooler gas, heard as breath.' : '.'}
      </LadderCaption>
    </>
  );
}
