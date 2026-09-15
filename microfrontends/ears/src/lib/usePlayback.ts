import { useCallback, useEffect, useRef, useState } from 'react';

export type Version = 'musical' | 'raw';

export interface Playback {
  time: number;
  playing: boolean;
  ready: boolean;
  error: string | null;
  version: Version;
  setVersion: (v: Version) => void;
  toggle: () => void;
  seek: (t: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  muted: boolean;
  toggleMute: () => void;
}

/** One audio element for the page. Switching track starts at `startAt` (a ?t= link) or 0;
 * switching version keeps the position. */
export function usePlayback(sources: Record<Version, string> | null, duration: number, startAt = 0): Playback {
  const startAtRef = useRef(startAt);
  startAtRef.current = startAt;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [version, setVersion] = useState<Version>('musical');
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = 0.8;
    audioRef.current = audio;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onReady = () => setReady(true);
    const onError = () => setError('This track could not be loaded.');
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('canplay', onReady);
    audio.addEventListener('error', onError);
    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('canplay', onReady);
      audio.removeEventListener('error', onError);
      audio.removeAttribute('src');
      audio.load();
    };
  }, []);

  const src = sources ? sources[version] : '';
  const lastSources = useRef(sources);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    const sameTrack = lastSources.current === sources; // only the version changed
    lastSources.current = sources;
    const resumeAt = sameTrack ? audio.currentTime : Math.max(0, Math.min(startAtRef.current, duration));
    const resumePlaying = sameTrack && !audio.paused;
    setReady(false);
    setError(null);
    if (!sameTrack) setTime(resumeAt);
    audio.src = src;
    audio.load();
    const restore = () => {
      audio.currentTime = resumeAt;
      if (resumePlaying) audio.play().catch(() => undefined);
    };
    audio.addEventListener('loadedmetadata', restore, { once: true });
    return () => audio.removeEventListener('loadedmetadata', restore);
    // `sources` identity marks a track change; it is memoised by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      if (audioRef.current) setTime(audioRef.current.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (audio.paused) {
      if (audio.ended || audio.currentTime >= duration - 0.05) audio.currentTime = 0;
      audio.play().catch(err => setError(err?.message ?? 'Playback failed.'));
    } else {
      audio.pause();
    }
  }, [duration]);

  const seek = useCallback((t: number) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(t, duration));
    if (audio) audio.currentTime = clamped;
    setTime(clamped);
  }, [duration]);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(1, v));
    if (audio) {
      audio.volume = clamped;
      if (clamped > 0 && audio.muted) {
        audio.muted = false;
        setMuted(false);
      }
    }
    setVolumeState(clamped);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }, []);

  return { time, playing, ready, error, version, setVersion, toggle, seek, volume, setVolume, muted, toggleMute };
}
