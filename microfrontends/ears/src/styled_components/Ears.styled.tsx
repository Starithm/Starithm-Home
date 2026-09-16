import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

/* Ears to the Universe: a full-screen instrument.
 *
 * Desktop: note ladder | sky map + transport | stanzas & science.
 * Below 1100px everything stacks, the ladder becomes a 21-bar equalizer and the transport
 * docks to the bottom of the screen. Colours come only from globals.css tokens. */

const NARROW = '@media (max-width: 1099px)';

const label = css`
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

export const Page = styled.div`
  min-height: 100vh;
  color: var(--text-body);
  font-family: var(--font-mono);
  background:
    radial-gradient(110% 70% at 50% 0%, color-mix(in srgb, var(--accent-surface) 75%, transparent) 0%, transparent 60%),
    var(--surface-sunken);

  /* cancel the shell's .microfrontend-container padding (2rem; none at <=768px) so the
     canvas, gradient included, runs edge to edge */
  margin: -2rem;

  @media (max-width: 768px) {
    margin: 0;
  }

  ${NARROW} {
    padding-bottom: 88px; /* room for the docked transport */
  }
`;

/* ---- header ---- */

export const Header = styled.header`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 20px;
  padding: 18px 28px 10px;

  ${NARROW} {
    padding: 14px 20px 8px;
  }
`;

export const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-body);
  text-decoration: none;

  &:hover span:first-of-type {
    color: var(--accent-text);
  }
`;

/* the site's mark, same asset as the shell nav and homepage */
export const BrandLogo = styled.img`
  width: 24px;
  height: 24px;
  flex: none;
`;

export const BrandName = styled.span`
  letter-spacing: 0.18em;
  color: var(--text-muted);
`;

export const Crumb = styled.span`
  color: var(--text-disabled);
`;

export const HeaderMeta = styled.div`
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  font-size: 10.5px;
  letter-spacing: 0.1em;
  color: var(--text-faint);

  span + span::before {
    content: '|';
    margin-right: 12px;
    color: var(--line-control);
  }

  ${NARROW} {
    margin-left: 0;
    width: 100%;

    /* separators would dangle at the start of a wrapped line */
    span + span::before {
      display: none;
    }
  }
`;

/* ---- day & track picker ---- */

export const Picker = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 18px;
  padding: 4px 28px 14px;
  border-bottom: 1px solid var(--line-hairline);

  ${NARROW} {
    padding: 4px 20px 12px;
  }
`;

export const DayNav = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
`;

export const IconButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--line-control);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--accent-border);
    color: var(--accent-text);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  &:focus-visible {
    outline: 1px solid var(--accent-text);
    outline-offset: 2px;
  }
`;

export const TrackTabs = styled.div`
  display: flex;
  gap: 4px;
  overflow-x: auto;
  min-width: 0;
  scrollbar-width: none;
`;

export const TrackTab = styled.button<{ $active: boolean }>`
  flex: none;
  max-width: 260px;
  padding: 6px 12px;
  border: 1px solid ${p => (p.$active ? 'var(--accent-border)' : 'transparent')};
  border-radius: 999px;
  background: ${p => (p.$active ? 'var(--accent-surface)' : 'transparent')};
  color: ${p => (p.$active ? 'var(--text-body)' : 'var(--text-muted)')};
  font: inherit;
  font-size: 11.5px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    color: var(--text-body);
  }

  &:focus-visible {
    outline: 1px solid var(--accent-text);
    outline-offset: 2px;
  }
`;

/* ---- layout ---- */

export const Grid = styled.div<{ $ladder: boolean }>`
  display: grid;
  gap: 28px;
  padding: 20px 28px 32px;
  /* without player data there is no ladder: don't leave an empty column */
  grid-template-columns: ${p => (p.$ladder ? '150px minmax(0, 1fr) minmax(280px, 340px)' : 'minmax(0, 1fr) minmax(280px, 340px)')};
  grid-template-areas: ${p => (p.$ladder ? "'ladder main aside'" : "'main aside'")};
  align-items: start;

  ${NARROW} {
    gap: 24px;
    padding: 16px 20px 24px;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'main' 'ladder' 'aside';
  }
`;

export const LadderArea = styled.section`
  grid-area: ladder;
  position: sticky;
  top: 20px;

  ${NARROW} {
    position: static;
  }
`;

export const MainArea = styled.main`
  grid-area: main;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const AsideArea = styled.aside`
  grid-area: aside;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 0;

  ${NARROW} {
    position: static;
    max-height: none;
  }
`;

export const Label = styled.div`
  ${label}
`;

export const LabelRow = styled.div`
  display: flex;
  flex-wrap: wrap; /* on phones the live readout drops below the label instead of colliding */
  justify-content: space-between;
  align-items: baseline;
  gap: 4px 12px;
  ${label}

  span:first-child {
    white-space: nowrap;
  }

  span:last-child {
    letter-spacing: 0.06em;
    text-transform: none;
    color: var(--text-faint);
  }
`;

/* ---- title ---- */

export const Eyebrow = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 12px;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
`;

export const KindTag = styled.span`
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--starithm-selective-yellow);
`;

export const Title = styled.h1`
  margin: 2px 0 0;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(26px, 3.2vw, 38px);
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--text-body);
`;

export const Logline = styled.p`
  margin: 0;
  max-width: var(--measure);
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: 17px;
  line-height: 1.5;
  color: var(--text-secondary);
`;

export const MetaLine = styled.div`
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--text-faint);
`;

/* ---- sky map ---- */

export const MapFrame = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0;
`;

export const MapBox = styled.div<{ $ratio: number }>`
  position: relative;
  width: 100%;
  /* leave room for title, spectrogram and transport so the controls stay above the fold */
  max-width: calc(clamp(220px, 100vh - 540px, 640px) * ${p => p.$ratio});
  aspect-ratio: ${p => p.$ratio};

  ${NARROW} {
    max-width: calc(52vh * ${p => p.$ratio});
  }
`;

export const MapImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  opacity: 0.8;
`;

export const MapCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
`;

export const AmbientNote = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  text-align: center;
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-faint);
  pointer-events: none;
`;

/* ---- spectrogram ---- */

export const Strip = styled.div`
  position: relative;
  height: 56px;
  overflow: hidden;
  cursor: pointer;
  background: var(--surface);
  border: 1px solid var(--line-hairline);

  &:focus-visible {
    outline: 1px solid var(--accent-text);
    outline-offset: 2px;
  }
`;

export const StripImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  opacity: 0.7;
`;

const drift = keyframes`
  from { background-position: 0 0, 0 0; }
  to { background-position: 63px 0, -140px 0; }
`;

/* Stand-in when the spectrogram image is missing: soft moving bands, running only while playing. */
export const StripShimmer = styled.div<{ $playing: boolean }>`
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--accent-border) 80%, transparent) 0 2px, transparent 2px 9px),
    linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--starithm-electric-violet) 22%, transparent) 50%, transparent 100%);
  background-size: auto, 140px 100%;
  -webkit-mask-image: linear-gradient(0deg, black 10%, transparent 90%);
  mask-image: linear-gradient(0deg, black 10%, transparent 90%);
  opacity: ${p => (p.$playing ? 0.9 : 0.4)};
  transition: opacity 600ms ease;
  animation: ${drift} 3s linear infinite;
  animation-play-state: ${p => (p.$playing ? 'running' : 'paused')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Playhead = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--starithm-selective-yellow);
  box-shadow: 0 0 8px var(--starithm-selective-yellow);
  pointer-events: none;
`;

/* ---- transport ---- */

export const Transport = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  ${NARROW} {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    /* !important: globals.css resets every element with "* { z-index: auto !important }", which let the
       poem (painted later) cover the dock. A class selector wins over * at equal importance. */
    z-index: 20 !important;
    padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
    background: var(--surface-sunken); /* solid: text scrolling underneath must not show through */
    border-top: 1px solid var(--line-hairline);
    gap: 10px;
  }
`;

export const PlayButton = styled.button`
  flex: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--accent-border);
  background: transparent;
  color: var(--text-body);
  display: grid;
  place-items: center;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--starithm-electric-violet);
    background: color-mix(in srgb, var(--starithm-electric-violet) 12%, transparent);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  &:focus-visible {
    outline: 1px solid var(--accent-text);
    outline-offset: 2px;
  }
`;

export const Clock = styled.div`
  flex: none;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  /* phones: current time only, so the docked bar fits in 390px */
  @media (max-width: 480px) {
    span {
      display: none;
    }
  }
`;

const rangeBase = css`
  -webkit-appearance: none;
  appearance: none;
  height: 16px;
  background: transparent;
  cursor: pointer;
  --fill: var(--starithm-electric-violet);

  &::-webkit-slider-runnable-track {
    height: 2px;
    background: linear-gradient(90deg, var(--fill) var(--pct, 0%), var(--line-subtle) var(--pct, 0%));
  }
  &::-moz-range-track {
    height: 2px;
    background: linear-gradient(90deg, var(--fill) var(--pct, 0%), var(--line-subtle) var(--pct, 0%));
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
    margin-top: -4px;
    border-radius: 50%;
    background: var(--accent-text);
    border: none;
  }
  &::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent-text);
    border: none;
  }
  &:focus-visible {
    outline: 1px solid var(--accent-text);
    outline-offset: 4px;
  }
`;

export const Scrubber = styled.input`
  ${rangeBase}
  flex: 1;
  min-width: 60px;
`;

export const VolumeGroup = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  gap: 6px;

  input {
    ${rangeBase}
    width: 64px;
  }

  ${NARROW} {
    input {
      display: none;
    }
  }
`;

export const VersionToggle = styled.div`
  flex: none;
  display: flex;
  border: 1px solid var(--line-control);
  border-radius: 999px;
  padding: 2px;
`;

export const VersionButton = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border: none;
  border-radius: 999px;
  background: ${p => (p.$active ? 'var(--accent-surface)' : 'transparent')};
  color: ${p => (p.$active ? 'var(--accent-text)' : 'var(--text-faint)')};
  font: inherit;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    color: var(--text-body);
  }

  &:focus-visible {
    outline: 1px solid var(--accent-text);
    outline-offset: 1px;
  }

  ${NARROW} {
    padding: 4px 8px;
  }

  @media (max-width: 480px) {
    padding: 4px 6px;
    letter-spacing: 0.04em;
  }
`;

export const PlaybackError = styled.div`
  font-family: var(--font-prose);
  font-size: 12px;
  color: var(--starithm-selective-yellow);
`;

/* ---- note ladder ---- */

export const Ladder = styled.ol`
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${NARROW} {
    flex-direction: row-reverse; /* rows arrive high -> low; show low notes on the left */
    align-items: stretch;
    height: 72px;
    gap: 3px;
  }
`;

export const LadderRow = styled.li<{ $lit: boolean }>`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 26px;
  align-items: center;
  gap: 6px;
  height: 16px;
  font-size: 9.5px;
  font-variant-numeric: tabular-nums;
  color: ${p => (p.$lit ? 'var(--text-body)' : 'var(--text-faint)')};
  transition: color 300ms ease;

  ${NARROW} {
    flex: 1;
    height: auto;
    display: flex;
    flex-direction: column-reverse;
    align-items: stretch; /* the desktop grid's centering left the bar tracks 0px wide */
    gap: 3px;
  }
`;

export const LadderHz = styled.span`
  text-align: right;

  ${NARROW} {
    display: none;
  }
`;

export const LadderTrack = styled.span`
  position: relative;
  height: 3px;
  background: var(--line-hairline);

  ${NARROW} {
    flex: 1;
    height: auto;
  }
`;

export const LadderFill = styled.span<{ $lit: boolean }>`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 100%;
  width: calc(var(--level, 0) * 100%);
  background: ${p => (p.$lit ? 'var(--accent-text)' : 'var(--accent-border)')};
  transition: width 220ms ease, height 220ms ease, background 300ms ease;

  ${NARROW} {
    width: 100%;
    height: calc(var(--level, 0) * 100%);
  }
`;

export const LadderTag = styled.span`
  font-size: 9px;
  color: var(--starithm-selective-yellow);
  white-space: nowrap;

  ${NARROW} {
    text-align: center;
    min-height: 11px;
  }
`;

/* absorption: the brand's blue, growing from the opposite end to the emission bar
   (right on desktop, top on phones) so the two never hide each other */
export const LadderAbsorb = styled.span`
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
  width: calc(var(--absorb, 0) * 100%);
  background: var(--starithm-link);
  opacity: 0.85;
  transition: width 220ms ease, height 220ms ease;

  ${NARROW} {
    top: 0;
    bottom: auto;
    width: 100%;
    height: calc(var(--absorb, 0) * 100%);
  }
`;

export const LadderTagAbsorb = styled.span`
  color: var(--starithm-link);

  &:not(:first-child) {
    margin-left: 3px;
  }
`;

export const LadderCaption = styled.p`
  margin: 12px 0 0;
  font-family: var(--font-prose); /* sentences: prose face per the type roles in globals.css */
  font-size: 11px;
  line-height: 1.6;
  color: var(--text-faint);
`;

/* ---- stanzas & science ---- */

export const Stanzas = styled.div`
  position: relative;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--line-control) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--line-control);
    border-radius: 3px;
  }

  ${NARROW} {
    overflow: visible;
  }
`;

export const Stanza = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-left: 2px solid ${p => (p.$active ? 'var(--starithm-electric-violet)' : 'transparent')};
  background: ${p => (p.$active ? 'color-mix(in srgb, var(--accent-surface) 55%, transparent)' : 'transparent')};
  text-align: left;
  font: inherit;
  cursor: pointer;
  transition: background 500ms ease, border-color 500ms ease;

  &:hover {
    background: var(--row-hover);
  }

  &:focus-visible {
    outline: 1px solid var(--accent-text);
    outline-offset: -1px;
  }
`;

export const StanzaHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 6px;
`;

export const StanzaText = styled.p<{ $active: boolean }>`
  margin: 0;
  background: transparent; /* otherwise it inherits the stanza's translucent fill and doubles it */
  white-space: pre-line;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 18px;
  line-height: 1.65;
  color: ${p => (p.$active ? 'var(--text-body)' : 'var(--text-faint)')};
  transition: color 650ms ease;
`;

/* ---- how the track was dressed ---- */

export const Arrangement = styled.section`
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 14px;
  border-top: 1px solid var(--line-hairline);
`;

export const Instruments = styled.div`
  font-family: var(--font-prose);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-body);
`;

export const ArrangementReason = styled.p`
  margin: 0;
  max-width: var(--measure);
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--text-secondary);
`;

export const Science = styled.section`
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--line-hairline);
`;

export const SciencePara = styled.p`
  margin: 0;
  font-family: var(--font-prose);
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-secondary);
`;

export const SpectrumFigure = styled.figure`
  margin: 0;
  background: var(--surface);
  border: 1px solid var(--line-hairline);
  padding: 6px 8px 4px;

  svg {
    display: block;
    width: 100%;
    height: 84px;
  }
`;

export const SpectrumAxis = styled.figcaption`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 9px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;

  span {
    white-space: nowrap;
  }

  span:nth-child(2) {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Credits = styled.div`
  font-size: 9.5px;
  line-height: 1.7;
  letter-spacing: 0.03em;
  color: var(--text-faint);
  overflow-wrap: anywhere;

  a {
    color: var(--accent-text);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

/* ---- states ---- */

export const Notice = styled.div`
  max-width: 520px;
  margin: 12vh auto;
  padding: 0 24px;
  text-align: center;

  h2 {
    margin: 0 0 10px;
    font-family: var(--font-display);
    font-weight: 300;
    font-size: 28px;
    color: var(--text-body);
  }

  p {
    margin: 0 0 18px;
    font-family: var(--font-prose);
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-muted);
  }
`;

export const TextButton = styled.button`
  padding: 8px 16px;
  border: 1px solid var(--accent-border);
  border-radius: 999px;
  background: transparent;
  color: var(--accent-text);
  font: inherit;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    background: var(--accent-surface);
  }
`;

export const Centered = styled.div`
  min-height: 60vh;
  display: grid;
  place-items: center;
`;
