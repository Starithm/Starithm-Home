import { useEffect, useRef, useState } from 'react';
import type { PlayerData, Track } from '../lib/melodies';
import { assetUrl } from '../lib/melodies';
import {
  KeyCaveat, KeyChannel, KeyGrid, KeyNums, KeyPanel, KeyRow, KeyText, LabelRow, RefButton,
} from '../styled_components/Ears.styled';

const SCAN_WORDS: Record<string, string> = {
  spiral: 'outward from the brightest region',
  serpentine: 'row by row',
};

/* The legend, the way a figure carries one. Everything here is read from the track's own published
 * mapping rather than written into the page, so it stays true when a threshold changes.
 *
 * The timbre row is the point of the panel: instruments are varied on purpose, and without saying so
 * a listener is entitled to assume the difference means something. */
export function MappingKey({ track, player }: { track: Track; player: PlayerData }) {
  const mapping = player.mapping;
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playingReference, setPlayingReference] = useState(false);

  useEffect(() => () => { audio.current?.pause(); }, []);

  if (!mapping) return null;

  const { pitch, loudness, time, voices, level } = mapping;
  const [shortUm, longUm] = pitch.wavelength_um;
  const [lowHz, highHz] = pitch.frequency_hz;

  const toggleReference = () => {
    if (!audio.current) {
      audio.current = new Audio(assetUrl(track, 'reference.m4a'));
      audio.current.addEventListener('ended', () => setPlayingReference(false));
    }
    if (playingReference) {
      audio.current.pause();
      audio.current.currentTime = 0;
      setPlayingReference(false);
    } else {
      void audio.current.play().then(() => setPlayingReference(true)).catch(() => setPlayingReference(false));
    }
  };

  return (
    <KeyPanel>
      <LabelRow>
        <span>How to read this track</span>
        {mapping.reference_tone && (
          <RefButton type="button" onClick={toggleReference} aria-pressed={playingReference}>
            {playingReference ? 'Stop' : 'Hear the two end notes'}
          </RefButton>
        )}
      </LabelRow>

      <KeyGrid>
        <KeyRow>
          <KeyChannel>Pitch</KeyChannel>
          <KeyText>{pitch.direction}.</KeyText>
          <KeyNums>
            {shortUm} &ndash; {longUm} &micro;m &rarr; {Math.round(lowHz)} &ndash; {Math.round(highHz)} Hz
            {' '}&middot; {pitch.notes} notes over {pitch.octaves} octaves &middot; {pitch.scale}
          </KeyNums>
        </KeyRow>

        <KeyRow>
          <KeyChannel>Loudness</KeyChannel>
          <KeyText>{loudness.means}.</KeyText>
          <KeyNums>
            rings above +{loudness.emission_sigma}&sigma; &middot; breathes below &minus;{loudness.absorption_sigma}&sigma;
            {' '}&middot; measured against a {loudness.continuum_window_kms.toLocaleString()} km/s window
          </KeyNums>
        </KeyRow>

        <KeyRow>
          <KeyChannel>Time</KeyChannel>
          <KeyText>Where the song is standing on the target.</KeyText>
          <KeyNums>
            {SCAN_WORDS[time.scan] ?? time.scan} &middot; {time.regions} regions &middot; {time.seconds_per_region}s each
          </KeyNums>
        </KeyRow>

        <KeyRow>
          <KeyChannel>Voices</KeyChannel>
          <KeyText>{voices.melody}. {voices.plucks}.</KeyText>
          <KeyNums>{voices.breath} &middot; {voices.drone}</KeyNums>
        </KeyRow>
      </KeyGrid>

      <KeyCaveat>
        <strong>Instruments carry no information.</strong> Key and reverb are chosen for character as
        well, and varied deliberately from track to track, so two tracks sounding different does not
        mean the objects differ. Loudness is normalised for every track too, at{' '}
        {level.normalised_rms_dbfs} dBFS, so absolute brightness cannot be recovered by ear.
      </KeyCaveat>
    </KeyPanel>
  );
}
