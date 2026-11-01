// Turns a MIDI performance file into the note timeline the slide's ripples follow:
// note-on times in milliseconds (chords merged), honouring the file's tempo map.
// Only timing is kept, not pitches: the ripples breathe with the piece without the page
// carrying a copy of the score.
//   node microfrontends/voyager/scripts/midi-to-onsets.mjs <file.mid> [out.json]
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const [, , input, output = fileURLToPath(new URL('../src/data/score-onsets.json', import.meta.url))] = process.argv;
if (!input) throw new Error('usage: midi-to-onsets.mjs <file.mid> [out.json]');
const b = readFileSync(input);

const u16 = (i) => b.readUInt16BE(i);
const u32 = (i) => b.readUInt32BE(i);
if (b.toString('latin1', 0, 4) !== 'MThd') throw new Error('not a MIDI file');
const tracks = u16(10);
const division = u16(12);
if (division & 0x8000) throw new Error('SMPTE time division is not supported');

function vlq(d, i) {
  let v = 0;
  for (;;) {
    const c = d[i++];
    v = (v << 7) | (c & 0x7f);
    if (c < 0x80) return [v, i];
  }
}

const tempos = []; // [tick, microseconds per quarter]
const ons = []; // ticks
let pos = 14;
for (let t = 0; t < tracks; t++) {
  if (b.toString('latin1', pos, pos + 4) !== 'MTrk') throw new Error(`bad track ${t}`);
  const len = u32(pos + 4);
  const d = b.subarray(pos + 8, pos + 8 + len);
  pos += 8 + len;
  let i = 0;
  let tick = 0;
  let status = 0;
  while (i < d.length) {
    let dt;
    [dt, i] = vlq(d, i);
    tick += dt;
    const s = d[i];
    if (s === 0xff) {
      const type = d[i + 1];
      let l;
      [l, i] = vlq(d, i + 2);
      if (type === 0x51) tempos.push([tick, (d[i] << 16) | (d[i + 1] << 8) | d[i + 2]]);
      i += l;
    } else if (s === 0xf0 || s === 0xf7) {
      let l;
      [l, i] = vlq(d, i + 1);
      i += l;
    } else {
      if (s & 0x80) {
        status = s;
        i++;
      }
      const hi = status & 0xf0;
      const n = hi === 0xc0 || hi === 0xd0 ? 1 : 2;
      if (hi === 0x90 && d[i + 1] > 0) ons.push(tick);
      i += n;
    }
  }
}

tempos.sort((a, c) => a[0] - c[0]);
if (!tempos.length || tempos[0][0] > 0) tempos.unshift([0, 500_000]); // MIDI default: 120 bpm
const toMs = (tick) => {
  let ms = 0;
  for (let k = 0; k < tempos.length; k++) {
    const [start, usPerQ] = tempos[k];
    const end = k + 1 < tempos.length ? Math.min(tick, tempos[k + 1][0]) : tick;
    if (end > start) ms += ((end - start) / division) * (usPerQ / 1000);
    if (k + 1 < tempos.length && tick <= tempos[k + 1][0]) break;
  }
  return Math.round(ms);
};

const onsets = [...new Set(ons)].sort((a, c) => a - c).map(toMs);
const out = {
  source: basename(input),
  bpm: Math.round(60_000_000 / tempos[0][1]),
  notes: ons.length,
  lengthMs: onsets[onsets.length - 1] + Math.round(tempos[0][1] / 1000),
  onsets,
};
writeFileSync(output, JSON.stringify(out));

