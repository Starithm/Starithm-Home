/* Data published daily by the sky-melodies pipeline to Cloudflare R2.
 *
 *   index.json                          days, newest first
 *   days/<YYYY-MM-DD>.json              that day's tracks
 *   tracks/<date>/<id>/<file>           musical.m4a, raw.m4a, map.png, spectrogram.png, player.json, ...
 *
 * Asset URLs are built from MELODIES_BASE_URL + key rather than the absolute URLs stored in
 * the JSON, so moving the bucket to another domain doesn't require republishing anything.
 */

export const MELODIES_BASE_URL = ((import.meta.env.VITE_MELODIES_BASE_URL as string | undefined) || '').replace(/\/$/, '');

export interface DayIndexEntry {
  date: string;
  track_count: number;
  titles: string[];
}

export interface MelodyIndex {
  updated_at: string;
  latest_date: string | null;
  days: DayIndexEntry[];
}

export interface Chapter {
  start_s: number;
  end_s: number;
  heading: string;
  /** A short stanza; lines separated by "\n". */
  text: string;
}

export interface Track {
  id: string;
  release_date: string;
  duration_s: number;
  sonification?: {
    setup: string;
    wavelength_um: [number, number];
    regions: number;
    grid: [number, number];
    scale: string;
  };
  /** How the track was dressed: chosen before a note was made, from the measured data.
   *  Absent on tracks published before instrument palettes existed. */
  arrangement?: {
    palette: string;
    /** Display name of the palette, e.g. "Cathedral". */
    name: string;
    /** The three voices a listener hears: melody, plucks, drone. */
    instruments: string[];
    space: 'room' | 'hall' | 'cathedral' | null;
    scale: string | null;
    /** One sentence from the arranger about why these instruments suit this object. */
    reason: string | null;
    chosen_by: 'ai' | 'rule' | null;
  } | null;
  title: string;
  logline: string | null;
  chapters: Chapter[];
  science_note: string | null;
  mood: string | null;
  ai: { model: string; provider: string } | null;
  target: {
    name: string;
    classification: string | null;
    simbad_id?: string;
    type?: string | null;
    redshift?: number | null;
    match?: 'name' | 'position';
    ra: number | null;
    dec: number | null;
  };
  observation: {
    program_id: string;
    program_title: string;
    program_url: string;
    instrument: string;
    file: string;
    observed: string | null;
  };
  lines: { line: string; kind: 'emission' | 'absorption'; significance: number }[];
}

export interface DayDoc {
  date: string;
  generated_at: string;
  cubes_released: number;
  tracks: Track[];
}

export interface PlayerData {
  version: 1;
  duration_s: number;
  grid: { width: number; height: number };
  /** How the song walks the target (absent on early tracks, which were serpentine). */
  scan?: 'spiral' | 'serpentine';
  /** [song time s, x, y] per region; x, y in 0..1 of the map image, origin top-left. */
  path: [number, number, number][];
  notes: { hz: number; lines: string[]; absorption_lines?: string[] }[];
  /** Per region, per note, 0..100: emission, which rings. */
  levels: number[][];
  /** Per region, per note, 0..100: absorption, which breathes (absent on early tracks). */
  absorption_levels?: number[][];
  /** Per region, 0..100. */
  brightness: number[];
  spectrum: { wave_um: number[]; flux: number[] };
  lines: { line: string; observed_um: number; kind: 'emission' | 'absorption'; velocity_kms?: number }[];
  spectrogram: { f_min_hz: number; f_max_hz: number; scale: 'log'; columns_per_second: number };
}

export type TrackAsset = 'musical.m4a' | 'raw.m4a' | 'map.png' | 'spectrogram.png' | 'player.json' | 'story.png' | 'meta.json';

export function assetUrl(track: Pick<Track, 'release_date' | 'id'>, file: TrackAsset): string {
  return `${MELODIES_BASE_URL}/tracks/${track.release_date}/${track.id}/${file}`;
}

async function getJson<T>(key: string): Promise<T> {
  if (!MELODIES_BASE_URL) throw new Error('VITE_MELODIES_BASE_URL is not configured');
  const res = await fetch(`${MELODIES_BASE_URL}/${key}`);
  if (!res.ok) throw new Error(`${key}: ${res.status}`);
  return res.json() as Promise<T>;
}

export const fetchIndex = () => getJson<MelodyIndex>('index.json');
export const fetchDay = (date: string) => getJson<DayDoc>(`days/${date}.json`);
export const fetchPlayer = (track: Track) => getJson<PlayerData>(`tracks/${track.release_date}/${track.id}/player.json`);

/** Plain names for spectral lines, matching the storyteller's vocabulary. */
const FRIENDLY: [string, string][] = [
  ['H2 ', 'warm molecular hydrogen'], ['Pa ', 'hydrogen'], ['Br ', 'hydrogen'], ['Pf ', 'hydrogen'], ['Hu ', 'hydrogen'],
  ['He ', 'helium'], ['[Ne', 'ionized neon'], ['[Fe', 'ionized iron'], ['[Ar', 'ionized argon'], ['[S ', 'ionized sulfur'],
  ['[O ', 'ionized oxygen'], ['[Cl', 'ionized chlorine'], ['Na ', 'sodium'], ['CO ', 'carbon monoxide'],
];

export function friendlyLineName(line: string): string {
  return FRIENDLY.find(([prefix]) => line.startsWith(prefix))?.[1] ?? line;
}

const SYMBOLS: [string, string][] = [
  ['H2 ', 'H₂'], ['Pa ', 'H'], ['Br ', 'H'], ['Pf ', 'H'], ['Hu ', 'H'], ['He ', 'He'], ['[Ne', 'Ne'], ['[Fe', 'Fe'],
  ['[Ar', 'Ar'], ['[S ', 'S'], ['[O ', 'O'], ['[Cl', 'Cl'], ['Na ', 'Na'], ['CO ', 'CO'],
];

/** Compact tag for the note ladder, e.g. "Ne", "H₂". */
export function lineSymbol(lines: string[]): string {
  const tags = lines.map(l => SYMBOLS.find(([p]) => l.startsWith(p))?.[1] ?? l);
  return Array.from(new Set(tags)).join(' ');
}

/** "Seyfert 2 Galaxy" from SIMBAD when matched by name, else the last part of MAST's classification. */
export function targetKind(track: Track): string | null {
  if (track.target.type && track.target.match === 'name') return track.target.type;
  const parts = (track.target.classification || '').split(';').map(s => s.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : track.target.type ?? null;
}
