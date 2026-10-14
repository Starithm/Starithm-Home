import type { Space, Track } from '../lib/melodies';
import { Arrangement, ArrangementReason, Instruments, Label } from '../styled_components/Ears.styled';

/* All six the pipeline can measure. Only three were listed when the space was still something a
 * model picked, and the other three never came up; measuring it changed that on the first day.
 * Of the first 22 measured tracks, 8 were void, 3 chamber and 2 dry, so most of them were landing
 * on an unmapped key and quietly losing this clause. */
const ROOM: Record<Space, string> = {
  dry: 'almost no room at all',
  chamber: 'a small stone chamber',
  room: 'a small room',
  hall: 'a warm hall',
  cathedral: 'a vast, echoing space',
  void: 'an immense, open emptiness',
};

/** "violas, concert harp and contrabass" */
function readableList(items: string[]): string {
  if (items.length < 2) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/* Which instruments play this track, and the arranger's one line about why they suit it.
 *
 * It sits under the note ladder rather than beside the poem: both describe the music itself, and the
 * poem's column is height-capped with the poem as its only shrinkable child, so a third fixed block
 * there squeezed the poem down to a hairline. */
export function ArrangementNote({ track }: { track: Track }) {
  const arrangement = track.arrangement;
  if (!arrangement?.instruments?.length) return null;
  const room = arrangement.space ? ROOM[arrangement.space] : null;

  return (
    <Arrangement>
      <Label>How it sounds</Label>
      <Instruments>
        {readableList(arrangement.instruments)}
        {arrangement.scale ? `, in ${arrangement.scale}` : ''}
        {room ? `, heard in ${room}` : ''}.
      </Instruments>
      {arrangement.reason && <ArrangementReason>{arrangement.reason}</ArrangementReason>}
    </Arrangement>
  );
}
