import { useCallback, useEffect, useRef, useState } from 'react';

/* The signal as music. Voyager 1 sends 160 bits/s (read off a live DSN pass, 31 Oct 2026). At 60 bpm,
 * the tempo of Leonardo's Für Alina, one beat lasts 1 s, so each note stands for the 160 bits the
 * spacecraft sends in that time.
 *
 * The voicing borrows Arvo Pärt's tintinnabuli (the language of Für Alina): a melody voice that
 * moves by step through B minor, and a second voice that always takes the nearest B-minor
 * triad note below it.
 *
 * The phrases come from where Voyager stands in the sky of the dish listening to it. The higher it
 * is, the longer the phrase (2 notes near the horizon, 8 at the top), so a whole pass plays as an
 * arch. While it rises, each phrase falls to B4; while it sets, each phrase climbs to B4. Phrases
 * are separated by a 3-beat rest, and the received power sets how loud they are. */

export const BPM = 60;
export const BEAT_MS = 60_000 / BPM;
export const DOWNLINK_BPS = 160;
export const BITS_PER_NOTE = Math.round((DOWNLINK_BPS * BEAT_MS) / 1000);

const B_MINOR = [59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76, 78, 79, 81, 83]; // B3..B5
const TRIAD = new Set([11, 2, 6]); // B, D, F# pitch classes
const PEDAL = 47; // B2
const HOME = 7; // index of B4 in B_MINOR
const REST_BEATS = 3;
const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export const noteName = (midi: number) => `${NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;

export interface SignalSource {
  /** true when a DSN antenna is receiving Voyager 1 right now */
  live: boolean;
  dbm: number | null;
  station: string;
  elevationDeg: number;
  rising: boolean;
}

/** One beat. `melody` is null on a rest between phrases. */
export interface Beat {
  at: number;
  melody: number | null;
  tin: number | null;
  pedal: boolean;
  velocity: number;
  live: boolean;
  station: string;
  elevationDeg: number;
  rising: boolean;
}

export function phraseLength(elevationDeg: number) {
  return 2 + Math.round(Math.max(0, Math.min(1, (elevationDeg - 10) / 60)) * 6);
}

function phrase(src: SignalSource) {
  const len = phraseLength(src.elevationDeg);
  const dir = src.rising ? -1 : 1; // rising: fall to B4 from above; setting: climb to B4 from below
  return Array.from({ length: len }, (_, k) => B_MINOR[HOME - dir * (len - 1 - k)]);
}

function tintinnabuli(m: number) {
  for (let n = m - 1; n > m - 12; n--) if (TRIAD.has(n % 12)) return n;
  return m - 12;
}

interface MidiOut {
  id: string;
  name: string;
  send(data: number[], timestamp?: number): void;
}

/** `source(n)` describes beat n; returning null ends the piece. */
export function useSignalMusic(source: (n: number) => SignalSource | null) {
  const [playing, setPlaying] = useState(false);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [midiOutputs, setMidiOutputs] = useState<MidiOut[]>([]);
  const [midiId, setMidiId] = useState<string>('');
  const [midiError, setMidiError] = useState<string | null>(null);
  const [beatStart, setBeatStart] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const queueRef = useRef<number[]>([]);
  const restRef = useRef(0);
  const countRef = useRef(0);
  const sourceRef = useRef(source);
  sourceRef.current = source;
  const midiRef = useRef<MidiOut | null>(null);
  midiRef.current = midiOutputs.find((o) => o.id === midiId) ?? null;

  const connectMidi = useCallback(async () => {
    const nav = navigator as Navigator & { requestMIDIAccess?: () => Promise<any> };
    if (!nav.requestMIDIAccess) {
      setMidiError('This browser has no Web MIDI. Use Chrome or Edge.');
      return;
    }
    try {
      const access = await nav.requestMIDIAccess();
      const list = () => {
        const outs = Array.from(access.outputs.values()) as MidiOut[];
        setMidiOutputs(outs);
        setMidiError(outs.length ? null : 'No MIDI outputs found. Connect a device or open a virtual port.');
      };
      access.onstatechange = list;
      list();
    } catch {
      setMidiError('MIDI access was blocked.');
    }
  }, []);

  const voice = useCallback((midi: number, velocity: number, when: number, length: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const f = 440 * 2 ** ((midi - 69) / 12);
    const peak = 0.05 + (velocity / 127) * 0.16;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, when);
    out.gain.linearRampToValueAtTime(peak, when + 0.008);
    out.gain.exponentialRampToValueAtTime(0.0008, when + length);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(Math.min(9000, f * 8), when);
    lp.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.5), when + length);
    out.connect(lp).connect(ctx.destination);
    // a soft piano-ish tone: fundamental plus two quiet, slightly detuned partials
    [
      [1, 'triangle', 1],
      [2, 'sine', 0.35],
      [3.01, 'sine', 0.12],
    ].forEach(([mult, type, gain]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type as OscillatorType;
      o.frequency.value = f * (mult as number);
      g.gain.value = gain as number;
      o.connect(g).connect(out);
      o.start(when);
      o.stop(when + length + 0.05);
    });
  }, []);

  const tick = useCallback(() => {
    const n = countRef.current++;
    const src = sourceRef.current(n);
    if (!src) {
      setPlaying(false);
      return;
    }

    let melody: number | null = null;
    let pedal = false;
    if (restRef.current > 0) {
      restRef.current--;
    } else {
      if (!queueRef.current.length) {
        queueRef.current = phrase(src);
        pedal = true;
      }
      melody = queueRef.current.shift()!;
      if (!queueRef.current.length) restRef.current = REST_BEATS;
    }
    const tin = melody == null ? null : tintinnabuli(melody);
    const velocity = src.live && src.dbm != null
      ? Math.round(Math.max(45, Math.min(110, 45 + (src.dbm + 170) * 2.2)))
      : 52;

    const ctx = ctxRef.current;
    if (ctx && melody != null && tin != null) {
      const t = ctx.currentTime + 0.02;
      voice(melody, velocity, t, 2.6);
      voice(tin, velocity * 0.7, t, 2.6);
      if (pedal) voice(PEDAL, velocity * 0.8, t, 6);
    }
    const midi = midiRef.current;
    if (midi && melody != null && tin != null) {
      const notes = pedal ? [melody, tin, PEDAL] : [melody, tin];
      const offAt = performance.now() + BEAT_MS * 0.92;
      for (const note of notes) {
        midi.send([0x90, note, note === melody ? velocity : Math.round(velocity * 0.7)]);
        midi.send([0x80, note, 0], offAt);
      }
    }
    const at = Date.now();
    setCount(n + 1);
    setBeatStart(at);
    setBeats((b) => [...b.slice(-31), {
      at, melody, tin, pedal, velocity, live: src.live, station: src.station, elevationDeg: src.elevationDeg, rising: src.rising,
    }]);
  }, [voice]);

  useEffect(() => {
    if (!playing) return;
    tick();
    const id = setInterval(tick, BEAT_MS);
    return () => clearInterval(id);
  }, [playing, tick]);

  const start = useCallback(async () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    await ctxRef.current.resume();
    countRef.current = 0;
    queueRef.current = [];
    restRef.current = 0;
    setBeats([]);
    setCount(0);
    setBeatStart(null);
    setPlaying(true);
  }, []);
  const stop = useCallback(() => {
    setPlaying(false);
    setBeatStart(null);
  }, []);

  return { playing, start, stop, beats, beatStart, count, midiOutputs, midiId, setMidiId, connectMidi, midiError };
}
