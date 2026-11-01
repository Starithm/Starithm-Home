import { useCallback, useEffect, useRef, useState } from 'react';

/* The signal as music. Voyager 1 sends 160 bits/s (read off a live DSN pass, 31 Oct 2026). At 60 bpm,
 * the tempo of Leonardo's Für Alina, one beat lasts 1 s, so each note stands for the 160 bits the
 * spacecraft sends in that time.
 *
 * The voicing borrows Arvo Pärt's tintinnabuli (the language of Für Alina): a melody voice that
 * moves by step through B minor, and a second voice that always takes the nearest B-minor
 * triad note below it. The data chooses the steps; the rules keep it music. */

export const BPM = 60;
export const BEAT_MS = 60_000 / BPM;
export const DOWNLINK_BPS = 160;
export const BITS_PER_NOTE = Math.round((DOWNLINK_BPS * BEAT_MS) / 1000);

const B_MINOR = [59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76, 78, 79, 81, 83]; // B3..B5
const TRIAD = new Set([11, 2, 6]); // B, D, F# pitch classes
const PEDAL = 47; // B2
const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export const noteName = (midi: number) => `${NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;

export interface SignalSource {
  /** true when a DSN antenna is receiving Voyager 1 right now */
  live: boolean;
  dbm: number | null;
  distanceKm: number;
}

export interface Beat {
  at: number;
  melody: number;
  tin: number;
  pedal: boolean;
  velocity: number;
  live: boolean;
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

export function useSignalMusic(source: () => SignalSource) {
  const [playing, setPlaying] = useState(false);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [midiOutputs, setMidiOutputs] = useState<MidiOut[]>([]);
  const [midiId, setMidiId] = useState<string>('');
  const [midiError, setMidiError] = useState<string | null>(null);
  const [beatStart, setBeatStart] = useState<number | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const stepRef = useRef(7); // index into B_MINOR: start on B4
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
    const src = sourceRef.current();
    const n = countRef.current++;

    // The data picks a step of -2..+2 through the scale: from the received power while a dish is
    // listening, otherwise from the metres Voyager covered during this beat.
    const metres = Math.floor(src.distanceKm * 1000);
    const seed = src.live && src.dbm != null ? metres ^ Math.round(src.dbm * 1000) : metres;
    const step = (((seed % 5) + 5) % 5) - 2;
    let i = stepRef.current + step;
    if (i < 0 || i >= B_MINOR.length) i = stepRef.current - step; // reflect at the edges
    stepRef.current = i;

    const melody = B_MINOR[i];
    const tin = tintinnabuli(melody);
    const pedal = n % 8 === 0;
    const velocity = src.live && src.dbm != null
      ? Math.round(Math.max(45, Math.min(110, 45 + (src.dbm + 170) * 2.2)))
      : 52;

    const ctx = ctxRef.current;
    if (ctx) {
      const t = ctx.currentTime + 0.02;
      voice(melody, velocity, t, 2.6);
      voice(tin, velocity * 0.7, t, 2.6);
      if (pedal) voice(PEDAL, velocity * 0.8, t, 6);
    }
    const midi = midiRef.current;
    if (midi) {
      const notes = pedal ? [melody, tin, PEDAL] : [melody, tin];
      const offAt = performance.now() + BEAT_MS * 0.92;
      for (const note of notes) {
        midi.send([0x90, note, note === melody ? velocity : Math.round(velocity * 0.7)]);
        midi.send([0x80, note, 0], offAt);
      }
    }
    const at = Date.now();
    setBeatStart(at);
    setBeats((b) => [...b.slice(-31), { at, melody, tin, pedal, velocity, live: src.live }]);
  }, [voice]);

  useEffect(() => {
    if (!playing) return;
    tick();
    const id = setInterval(tick, BEAT_MS);
    return () => clearInterval(id);
  }, [playing, tick]);

  const toggle = useCallback(async () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    await ctxRef.current.resume();
    setPlaying((p) => !p);
    setBeatStart(null);
  }, []);

  return { playing, toggle, beats, beatStart, midiOutputs, midiId, setMidiId, connectMidi, midiError };
}
