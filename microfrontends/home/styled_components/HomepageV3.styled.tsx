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
const BLACK = 'var(--background)';
const PANEL = 'var(--surface)';
const RAISED = 'var(--surface-raised)';
const SUNKEN = 'var(--surface-sunken)';
const TEAL = 'var(--starithm-nebula-teal)';

/* Alpha variants of --starithm-platinum (231,223,221) for borders and muted text, as in v2. */
export const line = (a: number) => `rgba(231, 223, 221, ${a})`;

const serif = css`font-family: var(--font-display); font-weight: 400;`;
/* NovaTrace's faces (CLAUDE.md): Newsreader is for the homepage hero title only; headings, numbers and
   labels are Google Sans Code; multi-sentence text is Andika. */
const heading = css`font-family: var(--font-mono); font-weight: 600; letter-spacing: -0.01em;`;
const prose = css`font-family: var(--font-prose);`;

const floaty = keyframes`0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-18px) rotate(0.5deg)}`;
const blink = keyframes`0%,49%{opacity:1}50%,100%{opacity:0}`;
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
  background: rgba(14, 11, 22, 0.85);
  backdrop-filter: blur(9px);
  border-bottom: 1px solid ${line(0.07)};
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
  background: ${p => (p.$alt ? PANEL : 'transparent')};
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
  ${heading};
  margin: 0; font-size: ${p => p.$size ?? 32}px; line-height: 1.15;
  @media (max-width: 760px) { font-size: 24px; }
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
  min-height: max(500px, min(80vh, 660px));
  display: flex; align-items: center;
  background: radial-gradient(1100px 600px at 78% 45%, rgba(141, 15, 245, 0.16), rgba(14, 11, 22, 0) 70%);
  @media (max-width: 760px) { min-height: 0; }
`;
export const HeroRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 48px; align-items: center;
  padding-top: 48px; padding-bottom: 56px;
  @media (max-width: 760px) { gap: 32px; padding-top: 32px; padding-bottom: 40px; }
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
  background: ${RAISED}; border: 1px solid rgba(154, 72, 255, 0.5); border-radius: 14px;
  padding: 6px 6px 6px 15px; max-width: 560px; width: 100%; box-sizing: border-box; text-align: left;
  &:focus-within { border-color: ${VIOLET_D}; box-shadow: 0 0 0 4px rgba(141, 15, 245, 0.22); }
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
export const EventCard = styled.a`
  width: 100%; max-width: 470px; display: block; text-decoration: none; color: ${PLATINUM} !important;
  background: linear-gradient(180deg, ${RAISED}, ${PANEL}); border: 1px solid ${line(0.14)}; border-radius: 14px;
  overflow: hidden; box-shadow: 0 30px 90px rgba(141, 15, 245, 0.25);
  animation: ${floaty} 6s ease-in-out infinite; ${still}
  &:hover { border-color: rgba(154, 72, 255, 0.5); }
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
  background: ${p => (p.$active ? 'rgba(141, 15, 245, 0.16)' : 'transparent')};
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
  display: flex; align-items: center; border-top: 1px solid ${line(0.07)}; background: ${SUNKEN};
  overflow: hidden; min-height: 49px;
`;
export const TickerLabel = styled.a`
  flex: none; align-self: stretch; display: flex; align-items: center; gap: 9px; padding: 0 21px;
  font-size: 10px; letter-spacing: 0.16em; color: ${TEAL} !important; text-decoration: none;
  background: ${SUNKEN}; position: relative; z-index: 1; border-right: 1px solid ${line(0.08)};
`;
export const TickerTrack = styled.div`
  flex: 1 1 auto; min-width: 0; overflow: hidden;
  &:hover > div { animation-play-state: paused; }
`;
export const TickerRun = styled.div<{ $seconds: number }>`
  display: flex; gap: 42px; width: max-content; font-size: 12px; white-space: nowrap; padding-left: 21px;
  animation: ${marquee} ${p => p.$seconds}s linear infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; overflow-x: auto; }
  a { display: inline-flex; gap: 9px; align-items: center; color: ${PLATINUM}; text-decoration: none; }
  a:hover span:last-child { text-decoration: underline; }
`;
export const TickerDot = styled.span<{ $color: string }>`
  width: 5px; height: 5px; border-radius: 50%; background: ${p => p.$color}; flex: none;
`;

/* ── problem carousel ── */
export const Typed = styled.div<{ $accent?: boolean }>`
  ${heading}; font-weight: 500;
  font-size: 44px; line-height: 1.15; letter-spacing: -0.02em; max-width: 1000px; margin: 0 auto; text-align: center;
  color: ${p => (p.$accent ? LILAC : PLATINUM)};
  min-height: 2.08em;
  @media (max-width: 760px) { font-size: 28px; }
`;
export const Caret = styled.span`
  color: ${LILAC}; font-weight: 300; animation: ${blink} 1s step-end infinite; ${still}
`;
export const Sub = styled.div`
  ${prose}; font-size: 16px; color: ${line(0.72)}; max-width: 563px; margin: 0 auto; text-align: center; animation: ${fadeup} 0.6s ease-out both; ${still}
`;
export const Dots = styled.div`
  display: flex; align-items: center; justify-content: center; gap: 11px; flex-wrap: wrap;
  > button.dot { background: transparent; border: 0; padding: 16px 0; cursor: pointer; width: 84px; }
  > button.pause {
    margin-left: 7px; background: transparent; color: ${line(0.7)}; border: 1px solid ${line(0.2)};
    border-radius: 879px; width: 39px; height: 39px; cursor: pointer; font: inherit; font-size: 11px;
  }
  @media (max-width: 520px) { > button.dot { width: 49px; } }
`;
export const DotBar = styled.span<{ $on: boolean }>`
  display: block; height: 3px; border-radius: 2px; background: ${p => (p.$on ? 'var(--starithm-veronica-dark)' : line(0.2))};
`;

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
export const FormTitle = styled.div`${heading}; font-size: 16px;`;
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
  background: radial-gradient(900px 500px at 50% 40%, rgba(141, 15, 245, 0.14), rgba(14, 11, 22, 0) 70%);
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


/* ── what it does: a deck of cards that deals itself ── */
export const DeckRow = styled.div`
  display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 56px; align-items: center;
  @media (max-width: 860px) { grid-template-columns: 1fr; gap: 32px; }
`;
export const Deck = styled.div`
  position: relative; height: 300px;
  @media (max-width: 520px) { height: 340px; }
`;
export const DeckCard = styled.a<{ $pos: number; $out: boolean; $feature?: boolean }>`
  position: absolute; inset: 0; box-sizing: border-box;
  display: flex; flex-direction: column; justify-content: space-between; gap: 18px;
  padding: 30px; border-radius: 18px; text-decoration: none; color: ${PLATINUM} !important;
  border: 1px solid ${p => (p.$feature ? 'rgba(154, 72, 255, 0.45)' : line(0.14))};
  background: ${p => (p.$feature ? `linear-gradient(135deg, var(--accent-surface), ${PANEL})` : PANEL)};
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  transition: transform 0.7s cubic-bezier(.2, .7, .2, 1), opacity 0.7s;
  /* !important: globals.css resets every element with "* { z-index: auto !important }" (as in Ears.styled.tsx). */
  z-index: ${p => (p.$out ? 6 : 5 - p.$pos)} !important;
  transform: ${p => (p.$out ? 'translateX(-115%) rotate(-7deg)' : `translateY(${p.$pos * 14}px) scale(${1 - p.$pos * 0.04})`)};
  opacity: ${p => (p.$out ? 0 : p.$pos > 2 ? 0 : 1 - p.$pos * 0.28)};
  pointer-events: ${p => (p.$pos === 0 && !p.$out ? 'auto' : 'none')};
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
export const DeckTitle = styled.div`${heading}; font-size: 22px; line-height: 1.3;`;
export const DeckBody = styled.div`${prose}; font-size: 14px; line-height: 1.7; color: ${line(0.72)}; max-width: 60ch;`;
export const DeckNav = styled.div`
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  button.arrow {
    width: 38px; height: 38px; border-radius: 999px; border: 1px solid ${line(0.2)}; background: transparent;
    color: ${line(0.8)}; cursor: pointer; font: inherit; font-size: 14px;
  }
  button.arrow:hover { border-color: ${VIOLET_D}; color: ${PLATINUM}; }
  button.dot { background: transparent; border: 0; padding: 14px 0; cursor: pointer; width: 34px; }
`;

/* ── accuracy: bars that fill to their value ── */
export const Bars = styled.div`display: flex; flex-direction: column; gap: 22px;`;
export const BarRow = styled.div`
  display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr) 88px; gap: 20px; align-items: center;
  @media (max-width: 760px) { grid-template-columns: 1fr 72px; > div:nth-child(2) { grid-column: 1 / -1; grid-row: 2; } }
`;
export const BarLabel = styled.div`
  font-size: 13px; color: ${line(0.85)};
  small { display: block; ${prose}; font-size: 12px; color: ${line(0.55)}; margin-top: 2px; }
`;
export const BarTrack = styled.div`
  position: relative; height: 10px; border-radius: 999px; background: ${line(0.08)}; overflow: hidden;
`;
export const BarFill = styled.div<{ $pct: number; $muted?: boolean }>`
  position: absolute; inset: 0 auto 0 0; width: ${p => p.$pct}%; border-radius: 999px;
  background: ${p => (p.$muted ? line(0.35) : `linear-gradient(90deg, ${VIOLET}, var(--starithm-veronica-dark))`)};
  transition: width 1.6s cubic-bezier(.2, .7, .2, 1);
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
export const BarValue = styled.div<{ $muted?: boolean }>`
  ${heading}; font-size: 26px; text-align: right; font-variant-numeric: tabular-nums;
  color: ${p => (p.$muted ? line(0.6) : PLATINUM)};
`;

/* ── how it works: a flow chart with pulses running along it ── */
const flow = keyframes`from { left: -6%; } to { left: 100%; }`;
const flowDown = keyframes`from { top: -6%; } to { top: 100%; }`;
export const Flow = styled.ol`
  list-style: none; margin: 0; padding: 0; display: flex; align-items: stretch;
  @media (max-width: 860px) { flex-direction: column; }
`;
export const FlowNode = styled.li<{ $on: boolean }>`
  flex: 1 1 0; min-width: 0; box-sizing: border-box; padding: 20px; border-radius: 16px;
  display: flex; flex-direction: column; gap: 6px;
  border: 1px solid ${p => (p.$on ? 'rgba(154, 72, 255, 0.7)' : line(0.12))};
  background: ${p => (p.$on ? 'rgba(141, 15, 245, 0.14)' : PANEL)};
  transition: border-color 0.5s, background 0.5s;
  small { font-size: 11px; color: ${line(0.55)}; }
  strong { ${heading}; font-size: 17px; }
  span { ${prose}; font-size: 13px; line-height: 1.55; color: ${line(0.7)}; }
`;
export const FlowLink = styled.li`
  flex: 0 0 48px; position: relative; align-self: center; height: 2px; background: ${line(0.12)}; overflow: hidden;
  i {
    position: absolute; top: -2px; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-text);
    box-shadow: 0 0 10px var(--primary); animation: ${flow} 1.8s linear infinite;
  }
  i:nth-child(2) { animation-delay: 0.6s; }
  i:nth-child(3) { animation-delay: 1.2s; }
  @media (max-width: 860px) {
    flex: 0 0 32px; width: 2px; height: auto; align-self: center;
    i { top: auto; left: -2px; animation-name: ${flowDown}; }
  }
  @media (prefers-reduced-motion: reduce) { i { display: none; } }
`;
