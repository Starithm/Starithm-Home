import type { Chapter, PlayerData } from './melodies';

/** Regions are evenly spaced in song time; returns the pair around t and the blend between them. */
function around(player: PlayerData, t: number) {
  const n = player.path.length;
  const f = Math.max(0, Math.min(n - 1, (t / player.duration_s) * n - 0.5));
  const i = Math.floor(f);
  return { i, j: Math.min(n - 1, i + 1), frac: f - i };
}

const smoothstep = (p: number) => p * p * (3 - 2 * p);

/** Note levels at time t, 0..1, in ascending pitch order. */
export function levelsAt(player: PlayerData, t: number): number[] {
  if (!player.levels.length) return player.notes.map(() => 0);
  const { i, j, frac } = around(player, t);
  const a = player.levels[i];
  const b = player.levels[j];
  return a.map((v, k) => (v + (b[k] - v) * frac) / 100);
}

export function brightnessAt(player: PlayerData, t: number): number {
  if (!player.brightness.length) return 0;
  const { i, j, frac } = around(player, t);
  return (player.brightness[i] + (player.brightness[j] - player.brightness[i]) * frac) / 100;
}

/** Where the song is on the map at time t: x, y in 0..1. */
export function pointAt(player: PlayerData, t: number): [number, number] {
  if (!player.path.length) return [0.5, 0.5];
  const { i, j, frac } = around(player, t);
  const s = smoothstep(frac);
  const a = player.path[i];
  const b = player.path[j];
  return [a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s];
}

export function chapterIndex(chapters: Chapter[], t: number): number {
  for (let k = chapters.length - 1; k >= 0; k--) if (t >= chapters[k].start_s) return k;
  return chapters.length ? 0 : -1;
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
