import styled, { css, keyframes } from 'styled-components';

/* The live slide: a fixed 1920×1080 stage, scaled to fit, so it can be screen-shared or dropped
 * into a deck and read from the back of a hall. Every size below is in stage pixels. Layout is
 * Claude Design's "Voyager Live Slide"; colours are tokens. */

export const STAGE_W = 1920;
export const STAGE_H = 1080;

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const rise = keyframes`from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; }`;
const ring = keyframes`
  from { transform: translate(-50%, -50%) scale(1); opacity: var(--o, 0.85); }
  to { transform: translate(-50%, -50%) scale(var(--s, 4.2)); opacity: 0; }
`;
const drift = keyframes`
  0% { transform: translate(0, 0) scale(1.06); }
  50% { transform: translate(-90px, 40px) scale(1.12); }
  100% { transform: translate(0, 0) scale(1.06); }
`;

/* src/index.css sets the mono face on every element with `*`, so nothing inherits a font:
   each prose element below names it. */
const prose = css`
  font-family: var(--font-prose);
`;

/* The viewport-sized frame. On a 16:9 screen it is exactly one screen; narrower screens get a
 * 16:9 band, wider ones letterbox. */
export const Frame = styled.section`
  position: relative;
  width: 100%;
  height: min(100vh, 56.25vw);
  overflow: hidden;
  background: var(--surface-sunken);

  &:fullscreen {
    height: 100vh;
  }
`;

export const Stage = styled.div`
  /* a violet-tinted grey the design uses for every label: brighter than --text-muted so it
     carries on a projector, and still clearly secondary to the numbers */
  --slide-label: color-mix(in srgb, var(--accent-text) 22%, var(--text-secondary));

  position: absolute;
  left: 0;
  top: 0;
  width: ${STAGE_W}px;
  height: ${STAGE_H}px;
  transform-origin: 0 0;
  overflow: hidden;
  color: var(--foreground);
  font-family: var(--font-prose);
  background: var(--surface-sunken);
`;

export const Sky = styled.div`
  position: absolute;
  inset: 0;
  transform-origin: 960px 540px;
  animation: ${drift} 40s ease-in-out infinite;

  canvas {
    position: absolute;
    inset: 0;
    width: ${STAGE_W}px;
    height: ${STAGE_H}px;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Layer = styled.div`
  position: absolute;
  inset: 0;

  /* the path layer only; the spacecraft drawing inside the marker sizes itself */
  > svg {
    position: absolute;
    inset: 0;
    width: ${STAGE_W}px;
    height: ${STAGE_H}px;
    overflow: visible;
  }
`;

export const TickLabel = styled.div<{ $gold?: boolean }>`
  ${prose};
  position: absolute;
  font-size: 28px;
  line-height: 1;
  white-space: nowrap;
  color: var(--starithm-golden-yellow);
  opacity: ${(p) => (p.$gold ? 1 : 0.85)};
`;

/* Voyager's marker: four crosshair bars, a bright point, and its label to the right */
/* $gap is the crosshair's open radius: wider when a small spacecraft sits in the middle */
export const Marker = styled.div<{ $gap?: number }>`
  --gap: ${(p) => p.$gap ?? 20}px;
  position: absolute;
  width: 0;
  height: 0;

  i {
    position: absolute;
    background: var(--accent-text);
  }
  i:nth-of-type(1) { left: calc(-1 * var(--gap) - 26px); top: -1.5px; width: 26px; height: 3px; }
  i:nth-of-type(2) { left: var(--gap); top: -1.5px; width: 26px; height: 3px; }
  i:nth-of-type(3) { left: -1.5px; top: calc(-1 * var(--gap) - 26px); width: 3px; height: 26px; }
  i:nth-of-type(4) { left: -1.5px; top: var(--gap); width: 3px; height: 26px; }

  b {
    position: absolute;
    left: -4px;
    top: -4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--foreground);
    box-shadow: 0 0 14px var(--accent-text);
  }
`;

/* centred under the marker, below the bottom crosshair tick: beside it, it would run into the readouts */
export const MarkerLabel = styled.div`
  position: absolute;
  left: 0;
  top: calc(var(--gap) + 40px);
  transform: translateX(-50%);
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  div:first-child {
    font-family: var(--font-display);
    font-size: 52px;
    line-height: 1;
  }
  div:last-child {
    ${prose};
    font-size: 28px;
    color: var(--slide-label);
  }
`;

export const Ripples = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
`;

/* One ring per voice of a note. Its reach (--s), strength (--o), weight and length are set per
   note by the slide, so the ripples phrase like the music instead of pulsing evenly. */
export const Ring = styled.div<{ $gold?: boolean; $w?: number; $ms?: number }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: ${(p) => p.$w ?? 2}px solid ${(p) => (p.$gold ? 'var(--starithm-golden-yellow)' : 'var(--accent-text)')};
  transform: translate(-50%, -50%);
  animation: ${ring} ${(p) => p.$ms ?? 4800}ms cubic-bezier(0.2, 0.6, 0.3, 1) forwards;
`;

export const SlideTitle = styled.div`
  position: absolute;
  left: 96px;
  top: 54px;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: 40px;
  line-height: 1.1;

  span {
    font-family: inherit;
    color: var(--slide-label);
  }
`;

const column = css`
  position: absolute;
  top: 200px;
  width: 480px;
  display: flex;
  flex-direction: column;
  text-shadow: 0 2px 12px var(--surface-sunken);
`;

export const LeftCol = styled.div`
  ${column};
  left: 96px;
  gap: 10px;
`;

export const RightCol = styled.div`
  ${column};
  right: 96px;
  gap: 26px;
  text-align: right;
`;

export const Kicker = styled.div<{ $gold?: boolean }>`
  ${prose};
  font-size: 30px;
  margin-bottom: 6px;
  color: ${(p) => (p.$gold ? 'var(--starithm-golden-yellow)' : 'var(--starithm-nebula-teal)')};
`;

export const BigUnit = styled.div<{ $gold?: boolean }>`
  display: flex;
  align-items: baseline;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 120px;
  font-weight: 300;
  letter-spacing: -0.04em;
  line-height: 1.02;
  color: ${(p) => (p.$gold ? 'var(--starithm-golden-yellow)' : 'var(--starithm-nebula-teal)')};

  span:last-child {
    font-family: var(--font-prose);
    font-size: 40px;
    letter-spacing: 0;
    margin-left: 14px;
  }
`;

export const Crossed = styled.div`
  font-family: var(--font-display);
  color: var(--starithm-golden-yellow);
  font-size: 128px;
  line-height: 0.95;
  letter-spacing: -0.03em;

  & + div {
    font-family: var(--font-display);
    font-size: 48px;
    line-height: 1.15;
    margin-top: 12px;
    text-wrap: balance;
  }
`;

export const Readout = styled.div<{ $size?: number; $top?: number }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${(p) => p.$top && `margin-top: ${p.$top}px;`}

  > div:first-child {
    ${prose};
    font-size: 26px;
    color: var(--slide-label);
  }
  > div:nth-child(2) {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 300;
    font-size: ${(p) => p.$size ?? 44}px;
    line-height: 1.05;
    white-space: nowrap;
  }
  > div:nth-child(2) small {
    font-family: var(--font-prose);
    font-size: 30px;
    color: var(--slide-label);
    margin-left: 12px;
  }
  > div:nth-child(3) {
    ${prose};
    font-size: 26px;
    color: var(--slide-label);
    white-space: nowrap;
  }
`;

export const LiveRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 26px;
  white-space: nowrap;
`;

export const LiveTag = styled.span<{ $live: boolean }>`
  padding: 3px 12px;
  border-radius: 999px;
  background: ${(p) => (p.$live ? 'var(--accent-text)' : 'var(--slide-label)')};
  color: var(--background);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-shadow: none;
`;

/** The viewer's time zone, beside a readout label: local times are otherwise unmarked next to the UTC clock. */
export const Zone = styled.span`
  font-family: var(--font-prose);
  color: var(--text-faint);
`;

export const Credit = styled.div`
  ${prose};
  position: absolute;
  right: 96px;
  bottom: 40px;
  font-size: 20px;
  color: var(--slide-label);
`;

export const FinalCount = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: color-mix(in srgb, var(--surface-sunken) 90%, transparent);
  animation: ${fadeIn} 1s ease both;

  div:first-child {
    ${prose};
    font-size: 40px;
    color: var(--slide-label);
  }
  div:last-child {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 300;
    font-size: 420px;
    line-height: 1;
    color: var(--starithm-golden-yellow);
  }
`;

export const PaleBlueDot = styled.div`
  position: absolute;
  inset: 0;
  background: var(--surface-sunken);
  animation: ${fadeIn} 1.5s ease both;

  img {
    position: absolute;
    left: 1060px;
    top: 54px;
    width: 764px;
    height: 972px;
    object-fit: cover;
    display: block;
  }
`;

export const DotWords = styled.div`
  position: absolute;
  left: 96px;
  top: 300px;
  width: 880px;
  display: flex;
  flex-direction: column;
  gap: 36px;
  animation: ${rise} 2s 1s ease-out both;

  div:first-child {
    font-family: var(--font-display);
    font-size: 68px;
    line-height: 1.12;
    letter-spacing: -0.015em;
    text-wrap: pretty;
  }
  div:last-child {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 52px;
    line-height: 1.2;
    color: var(--starithm-golden-yellow);
    text-wrap: pretty;
  }
`;

export const DotCredit = styled.div`
  ${prose};
  position: absolute;
  left: 96px;
  bottom: 54px;
  font-size: 28px;
  color: var(--slide-label);
`;

/* ---- time-travel dock: sits on the frame, outside the scaled stage, in screen pixels ---- */

export const Dock = styled.div`
  ${prose};
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  width: min(980px, calc(100% - 32px));
  padding: 14px 18px 16px;
  border-radius: 14px;
  border: 1px solid var(--line-control);
  background: color-mix(in srgb, var(--background) 82%, transparent);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 48px color-mix(in srgb, var(--surface-sunken) 80%, transparent);
  /* steps back while you watch; comes forward when you reach for it */
  opacity: 0.22;
  transition: opacity 220ms ease;
  /* keyboard focus brings it back too; a mouse click's focus doesn't, so it dims once you look away */
  &:hover,
  &:has(:focus-visible) {
    opacity: 1;
  }
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 5;
`;

export const DockHead = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 14px;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  color: var(--text-secondary);

  strong {
    font-family: inherit;
    font-weight: 500;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent-text);
  }

  span {
    font-family: inherit;
  }

  em {
    font-family: inherit;
    font-style: normal;
    color: var(--starithm-nebula-teal);
  }

  button {
    margin-left: auto;
  }
`;

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const Chip = styled.button<{ $on?: boolean; $tone?: 'gold' | 'teal' }>`
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 5px 11px;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$on ? 'var(--accent-border)' : 'var(--line-control)')};
  background: ${(p) => (p.$on ? 'var(--accent-surface)' : 'transparent')};
  color: ${(p) =>
    p.$on
      ? 'var(--accent-text)'
      : p.$tone === 'gold'
        ? 'var(--starithm-golden-yellow)'
        : p.$tone === 'teal'
          ? 'var(--starithm-nebula-teal)'
          : 'var(--text-secondary)'};

  &:hover {
    border-color: var(--accent-border);
  }

  &:focus-visible {
    outline: 1px solid var(--accent-text);
    outline-offset: 2px;
  }
`;

export const Scrub = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);

  span {
    font-family: inherit;
  }

  div {
    position: relative;
  }

  input {
    width: 100%;
    accent-color: var(--accent-text);
    cursor: pointer;
  }

  /* the crossing, marked on the track */
  i {
    position: absolute;
    top: -6px;
    width: 2px;
    height: 8px;
    background: var(--starithm-golden-yellow);
    transform: translateX(-1px);
    pointer-events: none;
  }
`;

export const Hint = styled.div`
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
`;

/* Voyager itself in the crosshair. The NASA render sits on black, so `screen` lets the sky show
   through and only the spacecraft remains; a soft round mask hides the crop's edges. */
export const CraftPhoto = styled.img`
  position: absolute;
  left: -170px;
  top: -170px;
  width: 340px;
  height: 340px;
  max-width: none; /* the global img max-width would collapse it: the marker is 0 px wide */
  mix-blend-mode: screen;
  mask-image: radial-gradient(circle, black 55%, transparent 72%);
  filter: drop-shadow(0 0 10px var(--accent-text));
`;

export const CraftLine = styled.svg`
  position: absolute;
  left: -40px;
  top: -40px;
  width: 80px;
  height: 80px;
  overflow: visible;
  filter: drop-shadow(0 0 8px var(--accent-text));
`;

/* The Golden Record, bottom-right above the credits: the disc turning very slowly, and one line
   on what it carries. */
const spin = keyframes`to { transform: rotate(360deg); }`;

export const RecordCard = styled.div<{ $small?: boolean }>`
  position: absolute;
  top: ${(p) => (p.$small ? 846 : 822)}px;
  right: 96px;
  flex-direction: row-reverse;
  text-align: right;
  width: 520px;
  display: flex;
  align-items: center;
  gap: 24px;
  text-shadow: 0 2px 12px var(--surface-sunken);

  img {
    width: ${(p) => (p.$small ? 112 : 150)}px;
    height: ${(p) => (p.$small ? 112 : 150)}px;
    max-width: none;
    flex: none;
    border-radius: 50%;
    clip-path: circle(49%);
    box-shadow: 0 0 40px color-mix(in srgb, var(--starithm-golden-yellow) 30%, transparent);
    animation: ${spin} 90s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  ${(p) => p.$small && 'width: 440px;'}

  > div > div:first-child {
    font-family: var(--font-display);
    font-size: ${(p) => (p.$small ? 28 : 34)}px;
    line-height: 1.1;
    color: var(--starithm-golden-yellow);
  }

  > div > div:last-child {
    ${prose};
    margin-top: 6px;
    font-size: ${(p) => (p.$small ? 20 : 24)}px;
    line-height: 1.3;
    color: var(--slide-label);
  }
`;

/* Stage scene 1: the date row top-right, level with the title, and the readouts under the title, clear of
   the signal's way home to Earth (down and to the left) */
export const StageLive = styled(LiveRow)`
  position: absolute;
  right: 96px;
  top: 58px;
  text-shadow: 0 2px 12px var(--surface-sunken);
`;

export const StageReadouts = styled.div`
  position: absolute;
  left: 96px;
  top: 150px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  text-shadow: 0 2px 12px var(--surface-sunken);
`;
