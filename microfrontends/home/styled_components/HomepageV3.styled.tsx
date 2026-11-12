import styled, { keyframes, css } from 'styled-components';

/* Homepage v3 (2026-11-12), from the Claude Design canvas "Starithm homepage redesign".
 *
 * Tokens from shared/styles/globals.css (see CLAUDE.md), Newsreader (--font-display) for
 * display type and Google Sans Code for everything functional. Motion is decorative only and stops
 * under prefers-reduced-motion. */

const VIOLET = 'var(--primary)';
const VIOLET_D = 'var(--starithm-electric-violet-dark)';
const LILAC = 'var(--accent-text)';
const GOLD = 'var(--starithm-golden-yellow)';
const PLATINUM = 'var(--foreground)';
/* The homepage ground: --surface-sunken, the darkest token (chosen 2026-11-12), so cards on --surface stand out. */
const BLACK = 'var(--surface-sunken)';
const PANEL = 'var(--surface)';
const RAISED = 'var(--surface-raised)';
const SUNKEN = 'var(--surface-sunken)';
const TEAL = 'var(--starithm-nebula-teal)';

/* Alpha variants of --starithm-platinum (231,223,221) for borders and muted text, as in v2. */
export const line = (a: number) => `rgba(231, 223, 221, ${a})`;

const serif = css`font-family: var(--font-display); font-weight: 400;`;
/* NovaTrace's faces (CLAUDE.md): Newsreader for homepage titles; numbers and labels in Google Sans Code;
   multi-sentence text in Andika. */
const heading = css`font-family: var(--font-mono); font-weight: 600; letter-spacing: -0.01em;`;
const prose = css`font-family: var(--font-prose);`;

const floaty = keyframes`0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-18px) rotate(0.5deg)}`;
const ping = keyframes`0%{box-shadow:0 0 0 0 rgba(78,205,196,0.6)}100%{box-shadow:0 0 0 10px rgba(78,205,196,0)}`;
const fadeup = keyframes`from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}`;
const marquee = keyframes`from{transform:translateX(0)}to{transform:translateX(-50%)}`;
const still = css`@media (prefers-reduced-motion: reduce) { animation: none; }`;

export const Page = styled.div`
  background: ${BLACK};
  color: ${PLATINUM};
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
  a { color: ${LILAC}; }
  img, svg { max-width: 100%; }
`;

export const Wrap = styled.div<{ $narrow?: boolean }>`
  width: 100%;
  max-width: ${p => (p.$narrow ? '1040px' : '1440px')};
  margin: 0 auto;
  padding: 0 49px;
  box-sizing: border-box;
  @media (max-width: 760px) { padding: 0 14px; }
`;

/* ── nav ── */
export const Header = styled.header`
  position: sticky; top: 0; z-index: 10;
  background: ${BLACK};
`;
export const NavRow = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding-top: 14px; padding-bottom: 14px;
`;
export const Brand = styled.a`
  display: flex; align-items: center; gap: 9px; text-decoration: none; color: ${PLATINUM} !important;
  img { width: 23px; height: 23px; }
  span { font-weight: 600; letter-spacing: 0.28em; font-size: 13px; }
`;
export const NavLinks = styled.nav`
  display: flex; align-items: center; gap: 25px; font-size: 12px;
  a { color: ${line(0.72)}; text-decoration: none; white-space: nowrap; }
  a:hover { color: ${PLATINUM}; }
  @media (max-width: 760px) { gap: 12px; a.hide-sm { display: none; } }
`;
export const NavButton = styled.button`
  background: ${line(0.08)}; color: ${PLATINUM}; border: 0; border-radius: 879px;
  padding: 7px 14px; font: inherit; font-size: 11px; cursor: pointer; white-space: nowrap;
  &:hover { background: ${line(0.14)}; }
`;

/* ── shared section pieces ── */
/* Sections size to their content; only the hero is screen-height. */
export const Section = styled.section<{ $alt?: boolean }>`
  background: ${BLACK}; /* one ground for every section; $alt no longer changes it */
  border-top: 1px solid ${line(0.07)};
  > div { padding-top: 67px; padding-bottom: 67px; }
  @media (max-width: 760px) { > div { padding-top: 49px; padding-bottom: 49px; } }
`;
export const Stack = styled.div<{ $gap?: number }>`
  display: flex; flex-direction: column; gap: ${p => p.$gap ?? 42}px;
`;
export const Kicker = styled.div<{ $color?: string }>`
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: ${p => p.$color ?? GOLD};
`;
export const H2 = styled.h2<{ $size?: number }>`
  ${serif};
  margin: 0; font-size: ${p => p.$size ?? 42}px; line-height: 1.1; letter-spacing: -0.01em;
  @media (max-width: 760px) { font-size: 30px; }
`;
export const Muted = styled.div<{ $size?: number }>`
  ${prose}; font-size: ${p => p.$size ?? 13}px; color: ${line(0.68)};
`;
export const LiveDot = styled.span<{ $size?: number; $still?: boolean }>`
  flex: none; width: ${p => p.$size ?? 7}px; height: ${p => p.$size ?? 7}px; border-radius: 50%; background: ${TEAL};
  ${p => !p.$still && css`animation: ${ping} 1.6s ease-out infinite; ${still}`}
`;

/* ── buttons ── */
const btn = css`
  display: inline-flex; align-items: center; gap: 9px; text-decoration: none;
  font: inherit; font-size: 12.5px; border-radius: 999px; padding: 0 20px; min-height: 40px; cursor: pointer;
  box-sizing: border-box;
`;
export const PrimaryButton = styled.a`
  ${btn}; background: ${VIOLET}; color: var(--foreground) !important; font-weight: 600; border: 0;
  &:hover { background: ${VIOLET_D}; }
`;
export const GhostButton = styled.a`
  ${btn}; background: transparent; color: ${line(0.9)} !important; font-weight: 500; border: 1px solid ${line(0.28)};
  &:hover { border-color: ${line(0.55)}; color: ${PLATINUM} !important; }
`;

/* ── hero ── */
export const Hero = styled.section`
  position: relative; overflow: hidden;
  min-height: max(560px, min(86vh, 740px));
  display: flex; align-items: center;
  background: ${BLACK};
  /* content after the sky layer, positioned so it paints over it (z-index is reset globally) */
  > div:last-child { position: relative; }
  @media (max-width: 760px) { min-height: 0; }
`;
export const HeroRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 48px; align-items: center;
  padding-top: 40px; padding-bottom: 150px;
  @media (max-width: 760px) { gap: 32px; padding-top: 32px; padding-bottom: 100px; }
`;
export const HeroCopy = styled.div`
  flex: 1 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 22px;
`;
/* Sized as the previous homepage's hero title (clamp to 66 px, light weight). */
export const H1 = styled.h1`
  ${serif};
  margin: 0; font-size: clamp(38px, 5.4vw, 62px); font-weight: 300; line-height: 1.02; letter-spacing: -0.02em;
  em { color: ${LILAC}; }
`;
export const Lede = styled.p`
  ${prose}; margin: 0; max-width: 52ch; font-size: 13.5px; line-height: 1.8; color: ${line(0.66)};
`;

/* ── ask box ── */
export const AskForm = styled.form`
  /* Contains the visually hidden label: without it the label is placed against <html>, which then
     scrolls on phones (body is the scroller there) and pushes the page out of view. */
  position: relative;
  display: flex; align-items: center; gap: 9px;
  background: ${RAISED}; border: 1px solid rgba(154, 72, 255, 0.28); border-radius: 14px;
  padding: 6px 6px 6px 15px; max-width: 560px; width: 100%; box-sizing: border-box; text-align: left;
  &:focus-within { border-color: rgba(154, 72, 255, 0.6); box-shadow: 0 0 0 3px rgba(141, 15, 245, 0.12); }
  svg { flex: none; }
  input {
    flex: 1 1 auto; min-width: 0; background: transparent; border: 0; color: ${PLATINUM};
    font: inherit; font-size: 12.5px; padding: 8px 0;
    &::placeholder { color: ${line(0.5)}; }
    &:focus { outline: none; }
  }
  button {
    flex: none; background: ${VIOLET}; color: var(--foreground); border: 0; font: inherit; font-weight: 600; font-size: 13px;
    border-radius: 10px; padding: 0 16px; min-height: 34px; cursor: pointer;
    &:hover { background: ${VIOLET_D}; }
  }
  @media (max-width: 520px) { padding-left: 12px; button { padding: 0 14px; } }
`;
export const VisuallyHidden = styled.label`
  position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
`;
export const Chips = styled.div`
  display: flex; flex-wrap: wrap; gap: 7px;
  a {
    font-size: 11px; color: ${line(0.75)}; text-decoration: none; border: 1px solid ${line(0.14)};
    border-radius: 879px; padding: 0 11px; min-height: 28px; display: inline-flex; align-items: center;
  }
  a:hover { border-color: ${VIOLET_D}; color: ${PLATINUM}; }
`;

/* ── hero event card ── */
export const CardSlot = styled.div`
  flex: 1 1 400px; min-width: 0; display: flex; justify-content: center;
`;
/* Dark panel with a teal border that echoes Earth's atmosphere rim below (chosen 2026-11-12). */
export const EventCard = styled.a`
  width: 100%; max-width: 470px; display: block; text-decoration: none; color: ${PLATINUM} !important;
  background: ${PANEL}; border: 1px solid rgba(79, 224, 207, 0.35); border-radius: 14px;
  overflow: hidden; box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  animation: ${floaty} 6s ease-in-out infinite; ${still}
  &:hover { border-color: rgba(79, 224, 207, 0.6); }
`;
export const CardHead = styled.div`
  display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; padding: 14px 18px;
  > span:first-child { display: flex; align-items: center; gap: 9px; font-weight: 600; white-space: nowrap; font-size: 13.5px; }
  > span:last-child { font-size: 10px; letter-spacing: 0.14em; white-space: nowrap; color: ${GOLD}; }
`;
export const CardStats = styled.div`
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid ${line(0.08)}; border-bottom: 1px solid ${line(0.08)};
  > div { padding: 11px 18px; display: flex; flex-direction: column; gap: 1px; }
  > div + div { border-left: 1px solid ${line(0.08)}; }
  small { font-size: 9.5px; color: ${line(0.6)}; }
  strong { ${serif}; font-size: 21px; line-height: 1.1; }
  @media (max-width: 520px) { > div { padding: 10px 12px; } strong { font-size: 19px; } }
`;
export const CardRows = styled.div`
  display: flex; flex-direction: column; font-size: 11.5px; padding: 5px 0;
`;
export const CardRow = styled.div<{ $active?: boolean }>`
  display: grid; grid-template-columns: 50px minmax(0, 1fr) auto; gap: 10px; padding: 8px 18px;
  transition: background 0.4s;
  background: ${p => (p.$active ? 'rgba(141, 15, 245, 0.08)' : 'transparent')};
  > span:first-child { color: ${line(0.6)}; }
  @media (max-width: 520px) { padding: 8px 12px; grid-template-columns: 44px minmax(0, 1fr) auto; }
`;
export const CardFoot = styled.div`
  display: flex; justify-content: space-between; align-items: center; gap: 7px; padding: 11px 18px;
  border-top: 1px solid ${line(0.08)}; font-size: 10.5px;
  > span:first-child { color: ${line(0.6)}; }
  > span:last-child { color: ${LILAC}; font-weight: 500; }
`;

/* ── just-in ticker ── */
export const Ticker = styled.div`
  display: flex; align-items: center; border-top: 1px solid ${line(0.07)}; background: ${BLACK};
  overflow: hidden; min-height: 49px;
`;
export const TickerLabel = styled.a`
  flex: none; align-self: stretch; display: flex; align-items: center; gap: 9px; padding: 0 21px;
  font-size: 10px; letter-spacing: 0.16em; color: ${TEAL} !important; text-decoration: none;
  background: ${BLACK}; position: relative; z-index: 1; border-right: 1px solid ${line(0.08)};
`;
export const TickerTrack = styled.div`
  flex: 1 1 auto; min-width: 0; overflow: hidden;
  &:hover > div { animation-play-state: paused; }
`;
/* Scrolls slowly (about 14 s per item); pauses on hover; still under reduced motion. */
export const TickerRun = styled.div<{ $seconds: number }>`
  display: flex; gap: 48px; width: max-content; font-size: 12.5px; white-space: nowrap; padding-left: 24px;
  animation: ${marquee} ${p => p.$seconds}s linear infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
  a { display: inline-flex; gap: 10px; align-items: center; color: ${PLATINUM}; text-decoration: none; }
  .ev { color: ${line(0.6)}; }
  .ago { color: ${line(0.45)}; }
  a:hover .what { text-decoration: underline; }
`;
export const TickerDot = styled.span<{ $color: string }>`
  width: 5px; height: 5px; border-radius: 50%; background: ${p => p.$color}; flex: none;
`;

/* ── problem carousel ── */


/* ── what it does: bento ── */


/* ── accuracy ── */

export const HeadRow = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end; gap: 21px; flex-wrap: wrap;
`;

/* ── how it works ── */


/* ── join early ── */
export const SplitRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 63px; align-items: center;
  > div { flex: 1 1 422px; min-width: 0; }
  @media (max-width: 760px) { gap: 35px; }
`;
export const Providers = styled.div`
  display: flex; flex-direction: column; gap: 11px; max-width: 352px;
  button {
    display: inline-flex; align-items: center; justify-content: center; gap: 9px;
    background: transparent; color: ${PLATINUM}; border: 1px solid ${line(0.28)}; border-radius: 11px;
    min-height: 42px; font: inherit; font-size: 12px; font-weight: 500; cursor: pointer;
  }
  button:first-child { background: ${PLATINUM}; color: ${BLACK}; border: 0; font-weight: 600; }
  button:disabled { opacity: 0.6; cursor: default; }
`;
export const ErrorNote = styled.div<{ $color: string }>`
  font-size: 11px; color: ${p => p.$color};
`;
export const FormCard = styled.div`
  width: 100%; max-width: 493px; margin: 0 auto; border: 1px solid ${line(0.14)}; border-radius: 19px;
  background: ${BLACK}; overflow: hidden; box-shadow: 0 40px 120px rgba(0, 0, 0, 0.5);
  animation: ${floaty} 6s ease-in-out infinite; ${still}
  > div:first-child {
    padding: 18px 23px; border-bottom: 1px solid ${line(0.08)}; font-size: 12px;
    display: flex; justify-content: space-between; gap: 11px;
    span:first-child { font-weight: 600; } span:last-child { color: ${line(0.6)}; }
  }
  > div:last-child { padding: 23px; display: flex; flex-direction: column; gap: 12px; }
`;
export const FormTitle = styled.div`${serif}; font-size: 21px;`;
export const FakeField = styled.div<{ $tall?: boolean }>`
  border: 1px solid ${line(0.14)}; border-radius: 9px; padding: 12px; font-size: 11px; color: ${line(0.6)};
  min-height: ${p => (p.$tall ? 80 : 0)}px; box-sizing: border-box;
`;
export const FieldRow = styled.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px;
`;

/* ── closing ── */
export const Closing = styled.section`
  border-top: 1px solid ${line(0.07)};
  background: ${BLACK};
  > div { padding-top: 67px; padding-bottom: 67px; display: flex; flex-direction: column; align-items: center; gap: 25px; text-align: center; }
`;
export const Contact = styled.div`
  margin-top: 35px; display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 563px;
  > div:last-child { display: flex; flex-wrap: wrap; gap: 11px; justify-content: center; }
  ${GhostButton} { min-height: 42px; padding: 0 18px; font-size: 12px; }
`;

/* ── footer ── */
export const Footer = styled.footer`
  border-top: 1px solid ${line(0.07)};
  > div { padding-top: 42px; padding-bottom: 42px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 28px; font-size: 11px; }
`;
export const FooterCols = styled.div`
  display: flex; flex-wrap: wrap; gap: 42px;
  > div { display: flex; flex-direction: column; gap: 7px; }
  span { color: ${line(0.6)}; font-size: 11px; }
  a { color: ${line(0.8)}; text-decoration: none; }
  a:hover { color: ${PLATINUM}; }
`;


/* ── what it does ── */
export const DeckRow = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 34px; text-align: center;
`;


export const DeckTitle = styled.div`${serif}; font-size: 28px; line-height: 1.15;`;
export const DeckBody = styled.div`${prose}; font-size: 14px; line-height: 1.7; color: ${line(0.72)}; max-width: 60ch;`;


/* ── accuracy: a grid graph whose columns rise to their value ── */
export const Graph = styled.figure`
  margin: 0; display: flex; flex-direction: column; gap: 18px;
  svg { display: block; width: 100%; height: auto; overflow: visible; }
  .grid line { stroke: ${line(0.09)}; stroke-width: 1; }
  .grid line.base { stroke: ${line(0.3)}; }
  .tick { fill: ${line(0.5)}; font-family: var(--font-mono); font-size: 11px; }
  .xlab { fill: ${line(0.85)}; font-family: var(--font-mono); font-size: 12px; }
  .val { fill: ${PLATINUM}; font-family: var(--font-mono); font-size: 15px; font-weight: 600; }
  .val.muted { fill: ${line(0.6)}; }
  .trace { fill: none; stroke: ${TEAL}; stroke-width: 2.5; stroke-linejoin: round; filter: drop-shadow(0 0 6px rgba(79, 224, 207, 0.5)); }
  .pt .stem, .pt .mark, .pt .val { opacity: 0; transition: opacity 0.5s; }
  .pt.on .stem, .pt.on .mark, .pt.on .val { opacity: 1; }
  .stem { stroke: rgba(79, 224, 207, 0.35); stroke-width: 1.5; stroke-dasharray: 3 4; }
  .stem.muted { stroke: ${line(0.25)}; }
  .mark { fill: ${TEAL}; stroke: ${PANEL}; stroke-width: 2; }
  .mark.muted { fill: ${line(0.45)}; }
  .pen { fill: ${PLATINUM}; filter: drop-shadow(0 0 10px rgba(79, 224, 207, 0.9)); }
  @media (prefers-reduced-motion: reduce) { .pt .stem, .pt .mark, .pt .val { transition: none; } }
`;
export const GraphNotes = styled.ul`
  list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px 24px;
  li { ${prose}; font-size: 12.5px; line-height: 1.6; color: ${line(0.6)}; }
  b { font-family: var(--font-mono); font-weight: 600; color: ${line(0.85)}; margin-right: 6px; }
`;


/* ── how it works: a vertical flow chart, one dot travelling through it and round the update loop ── */
export const FlowFigure = styled.figure`
  margin: 0 auto; width: 100%; max-width: 640px;
  svg { display: block; width: 100%; height: auto; overflow: visible; }
  .node rect { fill: ${PANEL}; stroke: ${line(0.14)}; stroke-width: 1; transition: fill 0.4s, stroke 0.4s; }
  .node.on rect { fill: rgba(141, 15, 245, 0.08); stroke: rgba(154, 72, 255, 0.4); }
  .node .n { fill: ${line(0.5)}; font-family: var(--font-mono); font-size: 11px; }
  .node .name { fill: ${PLATINUM}; font-family: var(--font-mono); font-size: 16px; font-weight: 600; }
  .node .desc { fill: ${line(0.68)}; font-family: var(--font-prose); font-size: 13px; }
  .link { stroke: ${line(0.22)}; stroke-width: 1.5; fill: none; }
  .loop { stroke: ${line(0.3)}; stroke-width: 1.5; fill: none; stroke-dasharray: 5 6; }
  .loop-label { fill: ${line(0.6)}; font-family: var(--font-prose); font-size: 12px; }
  .arrow { fill: ${line(0.4)}; }
  .link, .loop, .arrow { transition: stroke 0.25s, fill 0.25s, filter 0.25s; }
  .link.on, .loop.on { stroke: rgba(202, 144, 250, 0.7); stroke-width: 2; filter: drop-shadow(0 0 3px rgba(141, 15, 245, 0.5)); }
  .loop.on { stroke-dasharray: none; }
  .arrow.on { fill: rgba(202, 144, 250, 0.8); filter: drop-shadow(0 0 3px rgba(141, 15, 245, 0.5)); }
`;


/* ── the problem: three static blocks ── */
export const ProblemGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
  > div {
    border: 1px solid ${line(0.12)}; border-radius: 16px; padding: 24px; background: ${BLACK};
    display: flex; flex-direction: column; gap: 10px;
  }
  strong { ${serif}; font-size: 24px; line-height: 1.2; }
  span { ${prose}; font-size: 14px; line-height: 1.65; color: ${line(0.66)}; }
`;
export const Resolve = styled.div`
  text-align: center; ${serif}; font-size: 30px; line-height: 1.25;
  em { ${serif}; color: ${LILAC}; font-style: normal; }
  small { display: block; ${prose}; font-size: 14px; color: ${line(0.66)}; margin-top: 8px; }
  @media (max-width: 760px) { font-size: 24px; }
`;


/* ── what it does: tabs on the left, the current feature on the right ── */
export const TabsRow = styled.div`
  display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 28px; width: 100%; text-align: left;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;
export const TabList = styled.div`display: flex; flex-direction: column; gap: 6px;`;
export const TabItem = styled.button<{ $on: boolean }>`
  all: unset; cursor: pointer; display: flex; flex-direction: column; gap: 6px; padding: 14px 16px; border-radius: 12px;
  background: ${p => (p.$on ? PANEL : 'transparent')}; border: 1px solid ${p => (p.$on ? line(0.14) : 'transparent')};
  span.t { ${heading}; font-size: 14px; color: ${p => (p.$on ? PLATINUM : line(0.62))}; }
  &:hover span.t { color: ${PLATINUM}; }
  &:focus-visible { outline: 2px solid var(--primary); }
`;
const grow = keyframes`from { width: 0%; } to { width: 100%; }`;
export const TabProgress = styled.span<{ $on: boolean; $ms: number; $paused: boolean }>`
  display: block; height: 2px; border-radius: 2px; background: ${line(0.1)}; overflow: hidden;
  &::after { content: ''; display: block; height: 100%; width: 0; background: var(--accent-text);
    ${p => p.$on && css`animation: ${grow} ${p.$ms}ms linear forwards; animation-play-state: ${p.$paused ? 'paused' : 'running'};`} }
  @media (prefers-reduced-motion: reduce) { &::after { animation: none; width: ${p => (p.$on ? '100%' : '0')}; } }
`;
export const ShowPanel = styled.a`
  display: flex; flex-direction: column; justify-content: space-between; gap: 22px; min-height: 300px; box-sizing: border-box;
  padding: 34px; border-radius: 18px; text-decoration: none; color: ${PLATINUM} !important;
  border: 1px solid rgba(154, 72, 255, 0.3);
  background: linear-gradient(160deg, rgba(32, 12, 53, 0.9), rgba(32, 12, 53, 0)) ${PANEL};
`;



/* ── previews inside the feature panel: real data from GRB 260924A ── */
export const Preview = styled.div`
  flex: 1 1 auto; display: flex; align-items: center; justify-content: center; min-height: 150px;
  > div { width: 100%; max-width: 520px; }
`;
export const PreviewBox = styled.div`
  border: 1px solid ${line(0.12)}; border-radius: 12px; background: ${line(0.03)}; padding: 14px 16px;
  font-size: 12.5px; display: flex; flex-direction: column; gap: 10px;
  .q { align-self: flex-end; background: ${line(0.08)}; border-radius: 12px 12px 4px 12px; padding: 8px 12px; }
  .a { ${prose}; font-size: 13.5px; line-height: 1.6; color: ${line(0.85)}; }
  .cite { font-family: var(--font-mono); font-size: 11px; color: var(--accent-text); border: 1px solid rgba(154, 72, 255, 0.35);
    border-radius: 6px; padding: 1px 6px; margin-left: 6px; white-space: nowrap; }
  .note { font-size: 10.5px; color: ${line(0.45)}; }
  .facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 16px; }
  .facts small { display: block; font-size: 10px; color: ${line(0.5)}; letter-spacing: 0.08em; }
  .facts b { font-weight: 500; }
  table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
  th { text-align: left; font-weight: 500; font-size: 10.5px; color: ${line(0.5)}; padding: 0 8px 6px 0; }
  td { padding: 5px 8px 5px 0; border-top: 1px solid ${line(0.07)}; }
  .quote { ${prose}; font-size: 12px; color: ${line(0.6)}; border-left: 2px solid rgba(255, 195, 50, 0.5); padding-left: 10px; }
  .live { display: flex; flex-direction: column; gap: 8px; }
  .live a { display: flex; gap: 8px; align-items: baseline; color: ${PLATINUM}; text-decoration: none; min-width: 0; }
  .live .what { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
  .live .ago { flex: none; color: ${line(0.45)}; font-size: 11px; margin-left: auto; }
  svg text { font-family: var(--font-mono); font-size: 10.5px; fill: ${line(0.65)}; }
`;
