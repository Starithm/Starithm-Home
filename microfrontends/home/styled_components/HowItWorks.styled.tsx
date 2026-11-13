import styled, { css } from 'styled-components';
import { line } from './HomepageV3.styled';

/* "From alert to event page" (2026-11-13): a spine of stage ovals down the middle. The first is ringed by
   its sources as pills; each later one reaches out on a dotted line to a small card of real data from one
   event, alternating right and left, so cards on the two sides overlap in height. Tokens only (CLAUDE.md).
   The global "* { z-index: auto !important }" reset means stacking comes from DOM order. */

const PLATINUM = 'var(--foreground)';
const LILAC = 'var(--accent-text)';
const PANEL = 'var(--surface)';
const ON = 'rgba(154, 72, 255, 0.7)';
const GLOW = '0 0 14px rgba(141, 15, 245, 0.45)';
const prose = css`font-family: var(--font-prose);`;
const mono = css`font-family: var(--font-mono);`;

/* Messenger / band colours for the source pills. */
export const BAND = {
  gamma: 'var(--chart-3)',
  xray: 'var(--starithm-veronica-dark)',
  optical: 'var(--starithm-golden-yellow)',
  radio: 'var(--starithm-link)',
  neutrino: 'var(--starithm-nebula-teal)',
} as const;

const SPINE_W = 190;
const ROW = 112;
const REACH = 30; // dotted line from the oval's edge to the card

export const Spine = styled.div`
  display: grid; width: 100%; max-width: 1120px; align-self: center;
  grid-template-columns: minmax(0, 1fr) ${SPINE_W}px minmax(0, 1fr);
  grid-auto-rows: minmax(${ROW}px, auto); column-gap: ${REACH - 1}px;
  @media (max-width: 860px) { grid-template-columns: 1fr; grid-auto-rows: auto; row-gap: 14px; }
`;

/* Stage 1: the oval with its sources around it. */
export const Cloud = styled.div<{ $on: boolean }>`
  grid-column: 1 / -1; position: relative; height: 236px;
  /* the spine from Collect down */
  &::after { content: ''; position: absolute; left: 50%; top: 141px; bottom: 0; width: 1px; background: ${line(0.18)}; }
  .oval { position: absolute; left: 50%; top: 97px; transform: translateX(-50%); }
  .pill { position: absolute; transform: translateX(-50%); transition: box-shadow 0.5s, opacity 0.5s; opacity: ${p => (p.$on ? 1 : 0.78)}; }
  @media (max-width: 860px) {
    height: auto; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px;
    &::after { display: none; }
    .oval { position: static; transform: none; flex-basis: 100%; display: flex; justify-content: center; margin-bottom: 6px; }
    .pill { position: static; transform: none; }
  }
`;

export const Oval = styled.div<{ $on: boolean }>`
  width: 160px; height: 44px; border-radius: 999px; box-sizing: border-box; position: relative;
  display: flex; align-items: center; justify-content: center; gap: 8px; background: ${PANEL};
  border: 1px solid ${p => (p.$on ? ON : line(0.22))}; box-shadow: ${p => (p.$on ? GLOW : 'none')};
  ${mono}; font-size: 14px; font-weight: 600; color: ${PLATINUM};
  transition: border-color 0.4s, box-shadow 0.4s;
  small { font-size: 10px; font-weight: 400; color: ${p => (p.$on ? LILAC : line(0.5))}; }
`;

/* A stage oval in the spine column, with the spine line through its cell. */
export const Node = styled.div<{ $row: number; $last?: boolean }>`
  grid-column: 2; grid-row: ${p => p.$row}; position: relative; display: flex; justify-content: center;
  &::before {
    content: ''; position: absolute; left: 50%; top: 0; width: 1px; background: ${line(0.18)};
    height: ${p => (p.$last ? '22px' : '100%')};
  }
  @media (max-width: 860px) { grid-column: 1; grid-row: auto; &::before { display: none; } }
`;

export const Card = styled.div<{ $row: number; $side: 'left' | 'right'; $on: boolean }>`
  grid-column: ${p => (p.$side === 'left' ? 1 : 3)}; grid-row: ${p => p.$row} / span 2; align-self: start;
  position: relative; box-sizing: border-box; min-width: 0; max-width: 470px;
  justify-self: ${p => (p.$side === 'left' ? 'end' : 'start')}; width: 100%;
  border: 1px solid ${p => (p.$on ? 'rgba(154, 72, 255, 0.45)' : line(0.12))}; border-radius: 14px;
  background: ${PANEL}; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px;
  ${mono}; font-size: 12px; color: ${line(0.85)}; transition: border-color 0.4s;
  /* the dotted line back to the oval, level with its centre */
  &::before {
    content: ''; position: absolute; top: 21px; width: ${REACH + (SPINE_W - 160) / 2}px;
    ${p => (p.$side === 'left' ? 'left: 100%;' : 'right: 100%;')}
    border-top: 1.5px ${p => (p.$on ? 'solid' : 'dashed')} ${p => (p.$on ? ON : line(0.3))};
    ${p => (p.$on ? 'filter: drop-shadow(0 0 3px rgba(141, 15, 245, 0.6));' : '')}
  }
  .label { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: ${line(0.5)}; }
  .desc { ${prose}; font-size: 13px; line-height: 1.5; color: ${line(0.72)}; margin: 0; }
  .note { ${prose}; font-size: 11.5px; color: ${line(0.55)}; }
  .src { color: ${LILAC}; white-space: nowrap; }
  @media (max-width: 860px) {
    grid-column: 1; grid-row: auto; justify-self: stretch; max-width: none; margin-bottom: 10px;
    &::before { display: none; }
  }
`;

export const Chips = styled.div`display: flex; flex-wrap: wrap; gap: 6px;`;
export const Chip = styled.span<{ $color?: string }>`
  ${mono}; font-size: 11px; line-height: 1; padding: 6px 9px; border-radius: 999px; white-space: nowrap;
  border: 1px solid ${p => (p.$color ? `color-mix(in srgb, ${p.$color} 45%, transparent)` : line(0.18))};
  color: ${p => p.$color ?? line(0.75)};
  background: ${p => (p.$color ? `color-mix(in srgb, ${p.$color} 8%, ${PANEL})` : PANEL)};
`;

/* A circular sentence with the value marked, and what is stored from it. */
export const Quote = styled.div`
  ${prose}; font-size: 13px; line-height: 1.5; color: ${line(0.75)};
  border-left: 2px solid ${line(0.2)}; padding-left: 10px;
  mark { background: rgba(141, 15, 245, 0.22); color: ${PLATINUM}; border-radius: 3px; padding: 0 2px; }
`;
export const Stored = styled.div`
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  .arrow { color: ${line(0.4)}; }
  b { font-weight: 600; color: ${PLATINUM}; }
`;

/* Names that resolve to one event. */
export const Merge = styled.div`
  display: grid; grid-template-columns: auto auto minmax(0, 1fr); align-items: center; gap: 8px 12px;
  .names { display: flex; flex-direction: column; gap: 5px; }
  .to { color: ${line(0.4)}; font-size: 16px; }
  .one { border: 1px solid rgba(154, 72, 255, 0.4); border-radius: 10px; padding: 9px 11px; }
  .one b { display: block; font-size: 13px; color: ${PLATINUM}; }
  @media (max-width: 480px) { grid-template-columns: 1fr; .to { transform: rotate(90deg); justify-self: start; } }
`;

export const SkyRow = styled.div`
  display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 12px; align-items: start;
  figure { margin: 0; position: relative; width: 112px; height: 112px; border-radius: 8px; overflow: hidden; background: ${line(0.04)}; }
  figure img, figure svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 5px; }
  li { ${prose}; font-size: 12px; line-height: 1.4; color: ${line(0.75)}; }
  li b { ${mono}; font-weight: 600; color: ${PLATINUM}; }
`;

export const Curve = styled.svg`
  width: 100%; height: auto; display: block; overflow: visible;
  .ax { stroke: ${line(0.18)}; stroke-width: 1; }
  .tick { fill: ${line(0.5)}; font-family: var(--font-mono); font-size: 13px; }
  .ln { fill: none; stroke: ${BAND.xray}; stroke-width: 2; }
  .pt { fill: ${BAND.xray}; }
`;

export const Facts = styled.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 16px;
  small { display: block; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: ${line(0.5)}; margin-bottom: 1px; }
  b { font-size: 13px; font-weight: 600; color: ${PLATINUM}; }
`;

export const Loop = styled.p`
  ${prose}; margin: 4px 0 0; text-align: center; font-size: 13px; color: ${line(0.6)};
`;
