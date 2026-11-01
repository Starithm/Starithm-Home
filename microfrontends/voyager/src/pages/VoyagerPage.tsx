import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DsnPanel } from '../components/DsnPanel';
import { GoldenRecord } from '../components/GoldenRecord';
import { LiveSlide } from '../components/LiveSlide';
import { MusicPanel } from '../components/MusicPanel';
import { ScaleBar } from '../components/ScaleBar';
import { SkyPanel } from '../components/SkyPanel';
import { StatStrip } from '../components/StatStrip';
import { TimeTravel } from '../components/TimeTravel';
import { useDsn, type VoyagerLink } from '../lib/dsn';
import { positionAt } from '../lib/ephemeris';
import { useSignalMusic } from '../lib/signal-music';
import { clockFromUrl, type Clock } from '../lib/time-travel';
import { useNow } from '../lib/use-now';
import {
  Below, Brand, BrandLogo, BrandName, CraftFrame, Crumb, Footer, Grid, Header, HeaderRight, Inner, Page, Pill,
  Stack,
} from '../styled_components/Voyager.styled';

/* A rehearsal pass for when no dish is on Voyager 1: Canberra's 70 m dish at the real downlink rate,
 * received power wandering around a realistic −157 dBm. Labelled as simulated everywhere it shows. */
function useSimulatedLink(on: boolean): VoyagerLink | null {
  const [dbm, setDbm] = useState(-157.2);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setDbm((d) => Math.max(-162, Math.min(-152, d + (Math.random() - 0.5) * 1.4))), 2000);
    return () => clearInterval(id);
  }, [on]);
  return useMemo(
    () =>
      on
        ? { dish: 'DSS43', station: 'Canberra', elevation: 41, azimuth: 52, down: { active: true, bps: 160, dbm, band: 'X' }, up: null }
        : null,
    [on, dbm],
  );
}

function UtcClock() {
  const now = useNow(1000);
  return <span>{new Date(now).toISOString().slice(11, 19)} UTC</span>;
}

export default function VoyagerPage() {
  const dsn = useDsn();
  const [simulated, setSimulated] = useState(false);
  const sim = useSimulatedLink(simulated);
  const link = simulated ? sim : dsn.voyager;
  const receiving = !!link?.down?.active;

  const linkRef = useRef(link);
  linkRef.current = link;
  const source = useCallback(() => {
    const l = linkRef.current;
    return {
      live: !!l?.down?.active,
      dbm: l?.down?.active ? l.down.dbm : null,
      distanceKm: positionAt(Date.now()).earthKm,
    };
  }, []);
  const music = useSignalMusic(source);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Voyager 1 · One light-day · Starithm';
    return () => {
      document.title = prev;
    };
  }, []);

  // Time travel for the slide. ?state= links open straight into a moment.
  const [clock, setClock] = useState<Clock | null>(() => clockFromUrl(window.location.search));
  const [travelOpen, setTravelOpen] = useState(() => !!clockFromUrl(window.location.search));
  const openTravel = () => {
    setTravelOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const closeTravel = () => {
    setTravelOpen(false);
    setClock(null);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 't' || e.key === 'T') setTravelOpen((open) => {
        if (open) setClock(null);
        return !open;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const slideRef = useRef<HTMLElement | null>(null);
  const present = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else slideRef.current?.requestFullscreen?.();
  };

  return (
    <Page>
      {/* The event screen, exactly one viewport. Everything below is for website visitors. */}
      <LiveSlide ref={slideRef} link={link} clock={clock}>
        {travelOpen && <TimeTravel clock={clock} onChange={setClock} onClose={closeTravel} />}
      </LiveSlide>

      <Below>
      <Inner>
        <Header>
          <Brand to="/">
            <BrandLogo src="/logo_without_name.png" alt="" />
            <BrandName>STARITHM</BrandName>
          </Brand>
          <Crumb>/ Voyager 1 · One light-day</Crumb>
          <HeaderRight>
            <UtcClock />
            <Pill onClick={openTravel} title="Scrub the slide through the countdown and after (T)">Time travel</Pill>
            <Pill onClick={present} title="Show the live slide full screen (F)">Present</Pill>
          </HeaderRight>
        </Header>

        <StatStrip />

        <Grid $cols="minmax(0, 1fr) minmax(0, 1fr)">
          <DsnPanel dsn={dsn} link={link} simulated={simulated} onSimulate={setSimulated} />
          <MusicPanel {...music} live={receiving} />
        </Grid>

        <ScaleBar />

        <Grid $cols="minmax(0, 3fr) minmax(0, 2fr)">
          <GoldenRecord />
          <Stack>
            <CraftFrame>
              <img src="/voyager/voyager-1-pia17049.jpg" alt="Artist's rendering of Voyager 1 against the stars, its high-gain dish facing Earth" loading="lazy" />
              <figcaption>Voyager 1 · NASA/JPL-Caltech (PIA17049)</figcaption>
            </CraftFrame>
            <SkyPanel />
          </Stack>
        </Grid>

        <Footer>
          <span>
            Positions: <a href="https://ssd.jpl.nasa.gov/horizons/" target="_blank" rel="noreferrer">JPL Horizons</a> ·
            Antennas: <a href="https://eyes.nasa.gov/apps/dsn-now/" target="_blank" rel="noreferrer">NASA DSN Now</a> ·
            Images: NASA/JPL-Caltech
          </span>
          <span>Starithm × Space Art Lab · demo</span>
        </Footer>
      </Inner>
      </Below>
    </Page>
  );
}
