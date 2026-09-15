import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { StarithmLoader } from '@shared/components/StarithmLoader';
import {
  MELODIES_BASE_URL, assetUrl, fetchDay, fetchIndex, fetchPlayer, friendlyLineName, targetKind, type Track,
} from '../lib/melodies';
import { levelsAt, formatClock } from '../lib/playerMath';
import { usePlayback } from '../lib/usePlayback';
import { NoteLadder } from '../components/NoteLadder';
import { SkyMap } from '../components/SkyMap';
import { SpectrogramStrip } from '../components/SpectrogramStrip';
import { StoryPanel } from '../components/StoryPanel';
import { TrackPicker } from '../components/TrackPicker';
import { TransportBar } from '../components/TransportBar';
import {
  AsideArea, Brand, BrandMark, BrandName, Centered, Crumb, Eyebrow, Grid, Header, HeaderMeta, KindTag,
  LabelRow, LadderArea, Logline, MainArea, MetaLine, Notice, Page, TextButton, Title,
} from '../styled_components/Ears.styled';

const BASE_PATH = '/ears-to-the-universe';
const STALE = 5 * 60_000;

export default function EarsPage() {
  const { date: dateParam, trackId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const indexQuery = useQuery({ queryKey: ['melodies', 'index'], queryFn: fetchIndex, staleTime: STALE, enabled: !!MELODIES_BASE_URL });
  const date = dateParam ?? indexQuery.data?.latest_date ?? undefined;
  const dayQuery = useQuery({
    queryKey: ['melodies', 'day', date],
    queryFn: () => fetchDay(date as string),
    enabled: !!date && !!MELODIES_BASE_URL,
    staleTime: STALE,
    retry: (count, err) => !String(err).includes('404') && count < 2,
  });
  const tracks = dayQuery.data?.tracks ?? [];
  const track: Track | undefined = tracks.find(t => t.id === trackId) ?? tracks[0];

  const playerQuery = useQuery({
    queryKey: ['melodies', 'player', track?.release_date, track?.id],
    queryFn: () => fetchPlayer(track as Track),
    enabled: !!track,
    staleTime: Infinity,
  });
  const player = playerQuery.data;

  const duration = track?.duration_s ?? 90;
  const sources = useMemo(
    () => (track ? { musical: assetUrl(track, 'musical.m4a'), raw: assetUrl(track, 'raw.m4a') } : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [track?.release_date, track?.id],
  );
  // ?t=42 starts the song at 42 s (shareable moments)
  const startAt = Number(searchParams.get('t')) || 0;
  const playback = usePlayback(sources, duration, startAt);
  const { time, seek, toggle } = playback;

  useEffect(() => {
    document.title = track ? `${track.title} · Ears to the Universe · Starithm` : 'Ears to the Universe · Starithm';
  }, [track?.title]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.code !== 'Space' || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName) || el.isContentEditable) return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  const header = (
    <Header>
      <Brand to="/">
        <BrandMark aria-hidden="true" />
        <BrandName>STARITHM</BrandName>
        <Crumb>/</Crumb>
        <span>Ears to the Universe</span>
      </Brand>
      {track && (
        <HeaderMeta>
          <span>PROGRAM {track.observation.program_id}</span>
          {track.sonification?.setup && <span>{track.sonification.setup}</span>}
          {track.observation.observed && <span>OBSERVED {track.observation.observed}</span>}
        </HeaderMeta>
      )}
    </Header>
  );

  if (!MELODIES_BASE_URL) {
    return (
      <Page>
        {header}
        <Notice>
          <h2>Not connected yet</h2>
          <p>Set VITE_MELODIES_BASE_URL to the public URL of the melodies bucket.</p>
        </Notice>
      </Page>
    );
  }

  if (indexQuery.isLoading || (date && dayQuery.isLoading)) {
    return (
      <Page>
        {header}
        <Centered>
          <StarithmLoader size={48} delay={0} />
        </Centered>
      </Page>
    );
  }

  if (indexQuery.isError || !indexQuery.data) {
    return (
      <Page>
        {header}
        <Notice>
          <h2>The sky is quiet right now</h2>
          <p>We couldn't reach today's melodies. Please try again in a moment.</p>
          <TextButton onClick={() => indexQuery.refetch()}>Try again</TextButton>
        </Notice>
      </Page>
    );
  }

  const index = indexQuery.data;
  if (!date) {
    return (
      <Page>
        {header}
        <Notice>
          <h2>The first melodies are on their way</h2>
          <p>Every day, newly public James Webb Space Telescope observations become music here.</p>
        </Notice>
      </Page>
    );
  }

  const picker = (
    <TrackPicker
      index={index}
      date={date}
      tracks={tracks}
      activeId={track?.id}
      onDate={d => navigate(`${BASE_PATH}/${d}`)}
      onTrack={t => navigate(`${BASE_PATH}/${t.release_date}/${t.id}`)}
    />
  );

  if (!track) {
    return (
      <Page>
        {header}
        {picker}
        <Notice>
          <h2>No new music for {date}</h2>
          <p>
            {dayQuery.isError
              ? "We couldn't find melodies for this day."
              : 'No new public JWST spectral cubes with a clear target were released that day.'}
          </p>
          {index.latest_date && index.latest_date !== date && (
            <TextButton onClick={() => navigate(`${BASE_PATH}/${index.latest_date}`)}>Go to the latest</TextButton>
          )}
        </Notice>
      </Page>
    );
  }

  const kind = targetKind(track);
  const son = track.sonification;
  const started = time > 0 || playback.playing;
  const ringing = player && started
    ? Array.from(new Set(
        levelsAt(player, time).flatMap((level, k) => (level >= 0.25 ? player.notes[k].lines.map(friendlyLineName) : [])),
      ))
    : [];

  return (
    <Page>
      {header}
      {picker}
      <Grid>
        <LadderArea>{player && <NoteLadder player={player} time={time} active={started} />}</LadderArea>

        <MainArea>
          <div>
            <Eyebrow>
              <span>{track.target.name}</span>
              {kind && <KindTag>{kind}</KindTag>}
            </Eyebrow>
            <Title>{track.title}</Title>
          </div>
          {track.logline && <Logline>{track.logline}</Logline>}
          <MetaLine>
            {[
              son && `${son.wavelength_um[0].toFixed(2)}–${son.wavelength_um[1].toFixed(2)} µm`,
              son && `${son.regions} regions`,
              `${Math.round(duration)} s`,
              track.target.simbad_id,
            ].filter(Boolean).join(' · ')}
          </MetaLine>

          <LabelRow>
            <span>Where the song is, second by second</span>
          </LabelRow>
          {player ? (
            <SkyMap
              mapUrl={assetUrl(track, 'map.png')}
              player={player}
              time={time}
              alt={`Brightness map of ${track.target.name}; the dot follows the music across it`}
            />
          ) : (
            <Centered>{playerQuery.isError ? 'Map unavailable' : <StarithmLoader size={32} delay={0} />}</Centered>
          )}

          <LabelRow>
            <span>The music as a spectrogram</span>
            <span>
              T+{formatClock(time)}
              {ringing.length ? ` · ${ringing.join(', ')}` : ''}
            </span>
          </LabelRow>
          <SpectrogramStrip url={assetUrl(track, 'spectrogram.png')} time={time} duration={duration} onSeek={seek} />

          <TransportBar playback={playback} duration={duration} />
        </MainArea>

        <AsideArea>
          <StoryPanel track={track} player={player} time={time} onSeek={seek} />
        </AsideArea>
      </Grid>
    </Page>
  );
}
