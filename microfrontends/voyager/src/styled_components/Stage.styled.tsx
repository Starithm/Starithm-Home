import styled, { css, keyframes } from 'styled-components';
import { Frame, STAGE_H, STAGE_W } from './LiveSlide.styled';

/* The concert stage (/voyager-1/stage): three full-screen scenes on the live slide's 1920×1080 stage.
 * Every size below is in stage pixels; colours are tokens. */

const prose = css`
  font-family: var(--font-prose);
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const spin = keyframes`to { transform: rotate(360deg); }`;

/* the whole screen: black around a 16:9 scene, which fades in on each change */
export const StageRoot = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  background: var(--surface-sunken);
  cursor: none;

  > * {
    animation: ${fadeIn} 1.2s ease;
  }
`;

export const SceneFrame = Frame;

export const SceneDots = styled.div<{ $show: boolean }>`
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  opacity: ${(p) => (p.$show ? 0.8 : 0)};
  transition: opacity 0.6s;
  animation: none;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-faint);
  }
  span[data-on='true'] {
    background: var(--accent-text);
  }
`;

/* ---- scene 2: the signal ---- */

export const Fall = styled.canvas`
  position: absolute;
  inset: 0;
  width: ${STAGE_W}px;
  height: ${STAGE_H}px;
`;

export const StationRow = styled.div`
  position: absolute;
  left: 96px;
  right: 96px;
  top: 130px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
`;

export const StationCard = styled.div<{ $on: boolean }>`
  padding: 18px 26px;
  border-radius: 14px;
  border: 1.5px solid ${(p) => (p.$on ? 'var(--accent-text)' : 'var(--line-subtle)')};
  background: color-mix(in srgb, var(--surface-sunken) 75%, transparent);
  box-shadow: ${(p) => (p.$on ? '0 0 40px color-mix(in srgb, var(--accent-text) 30%, transparent)' : 'none')};

  > div:nth-child(1) {
    font-family: var(--font-display);
    font-size: 38px;
    line-height: 1.1;
    color: ${(p) => (p.$on ? 'var(--accent-text)' : 'var(--foreground)')};
  }
  > div:nth-child(2) {
    ${prose};
    font-size: 20px;
    color: var(--slide-label);
  }
  > div:nth-child(3) {
    ${prose};
    margin-top: 8px;
    font-size: 24px;
    color: ${(p) => (p.$on ? 'var(--foreground)' : 'var(--slide-label)')};
  }
  b {
    font-family: var(--font-mono);
    font-weight: 400;
  }
`;

const blink = keyframes`50% { opacity: 0; }`;

/* typed out in the middle of the falls, a monospace line with a blinking cursor */
export const Caption = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 540px;
  transform: translateY(-50%);
  text-align: center;
  font-family: var(--font-mono);
  font-weight: 300;
  font-size: 48px;
  white-space: pre;
  text-shadow: 0 0 24px var(--surface-sunken), 0 2px 12px var(--surface-sunken);

  b {
    font-family: inherit;
    font-weight: 700;
    font-size: 54px;
  }

  i {
    display: inline-block;
    width: 0.55em;
    height: 1em;
    margin: 0 -0.55em 0 0; /* the cursor takes no room: the line keeps its place */
    vertical-align: -0.12em;
    background: var(--starithm-nebula-teal);
    animation: ${blink} 1s steps(1) infinite;
  }
`;

export const Scale = styled.svg`
  position: absolute;
  left: 0;
  top: 860px;
  width: ${STAGE_W}px;
  height: 200px;
  background: none; /* the global svg rule paints a ground */

  line {
    stroke: var(--text-secondary);
    stroke-width: 2;
  }
  .gold {
    stroke: var(--starithm-golden-yellow);
    stroke-width: 3;
  }
  .sun {
    fill: var(--starithm-golden-yellow);
  }
  .voyager {
    fill: var(--accent-text);
    filter: drop-shadow(0 0 8px var(--accent-text));
  }
`;

export const ScaleLabel = styled.div<{ $tone?: 'gold' | 'accent' | 'muted'; $align?: 'left' | 'right' }>`
  ${prose};
  position: absolute;
  white-space: nowrap;
  font-size: 24px;
  transform: ${(p) => (p.$align === 'left' ? 'none' : p.$align === 'right' ? 'translateX(-100%)' : 'translateX(-50%)')};
  color: ${(p) =>
    p.$tone === 'gold' ? 'var(--starithm-golden-yellow)'
      : p.$tone === 'accent' ? 'var(--accent-text)'
        : p.$tone === 'muted' ? 'var(--text-muted)'
          : 'var(--slide-label)'};
`;

/* ---- scene 3: the record ---- */

/* 16⅔ rpm: one turn in 3.6 s. The light stays put while the disc turns under it. */
export const Disc = styled.div`
  position: absolute;
  left: 291px;
  top: 205px;
  width: 430px;
  height: 430px;
  border-radius: 50%;
  box-shadow: 0 0 70px color-mix(in srgb, var(--starithm-golden-yellow) 24%, transparent);

  img {
    width: 100%;
    height: 100%;
    max-width: none;
    border-radius: 50%;
    animation: ${spin} 3.6s linear infinite;
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 300deg, transparent 0deg, color-mix(in srgb, var(--foreground) 22%, transparent) 14deg,
      transparent 30deg, transparent 180deg, color-mix(in srgb, var(--foreground) 16%, transparent) 194deg, transparent 210deg);
    mix-blend-mode: soft-light;
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      animation-duration: 60s;
    }
  }
`;

export const Facts = styled.div`
  position: absolute;
  left: 96px;
  top: 740px;
  width: 820px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 26px;
  text-shadow: 0 2px 12px var(--surface-sunken);

  > div > div:first-child {
    font-family: var(--font-mono);
    font-weight: 300;
    font-size: 64px;
    line-height: 1;
    color: var(--starithm-golden-yellow);
  }
  > div > div:last-child {
    ${prose};
    margin-top: 4px;
    font-size: 24px;
    color: var(--slide-label);
  }
`;

/* Voyager on its own, cut out of the NASA render onto transparency (scripts/cut-out-craft.py), so it sits
   solid in front of the moving sky; drifting a little. Shown below its 745×840 size, so it stays sharp. */
const float = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-10px, 12px) rotate(-1.5deg); }
`;

export const Craft = styled.img`
  position: absolute;
  left: 1150px;
  top: 64px;
  width: 550px;
  height: 620px;
  max-width: none;
  background: none; /* a global rule grounds every img, which would box the cut-out */
  filter: drop-shadow(0 0 18px color-mix(in srgb, var(--accent-text) 45%, transparent));
  animation: ${float} 14s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Look = styled.div`
  position: absolute;
  right: 96px;
  top: 720px;
  width: 820px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-shadow: 0 2px 12px var(--surface-sunken);

  > div:nth-child(1) {
    ${prose};
    font-size: 26px;
    color: var(--slide-label);
  }
  > div:nth-child(2) {
    font-family: var(--font-display);
    font-size: 52px;
    line-height: 1.1;
    color: var(--accent-text);
  }
  > div:nth-child(3) {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 300;
    font-size: 30px;
  }
  > div:nth-child(4) {
    ${prose};
    margin-top: 10px;
    font-size: 26px;
    color: var(--slide-label);
  }
`;
