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

const floaty = keyframes`0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-18px) rotate(0.5deg)}`;
const blink = keyframes`0%,49%{opacity:1}50%,100%{opacity:0}`;
const ping = keyframes`0%{box-shadow:0 0 0 0 rgba(78,205,196,0.6)}100%{box-shadow:0 0 0 10px rgba(78,205,196,0)}`;
const fadeup = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}`;
const marquee = keyframes`from{transform:translateX(0)}to{transform:translateX(-50%)}`;
const still = css`@media (prefers-reduced-motion: reduce) { animation: none; }`;

export const Page = styled.div`
  background: ${BLACK};
  color: ${PLATINUM};
  font-family: var(--font-mono);
  font-size: 16px;
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
  padding: 0 56px;
  box-sizing: border-box;
  @media (max-width: 760px) { padding: 0 16px; }
`;

/* ── nav ── */
export const Header = styled.header`
  position: sticky; top: 0; z-index: 10;
  background: rgba(14, 11, 22, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${line(0.07)};
`;
export const NavRow = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding-top: 16px; padding-bottom: 16px;
`;
export const Brand = styled.a`
  display: flex; align-items: center; gap: 10px; text-decoration: none; color: ${PLATINUM} !important;
  img { width: 26px; height: 26px; }
  span { font-weight: 600; letter-spacing: 0.28em; font-size: 15px; }
`;
export const NavLinks = styled.nav`
  display: flex; align-items: center; gap: 28px; font-size: 14px;
  a { color: ${line(0.72)}; text-decoration: none; white-space: nowrap; }
  a:hover { color: ${PLATINUM}; }
  @media (max-width: 760px) { gap: 14px; a.hide-sm { display: none; } }
`;
export const NavButton = styled.button`
  background: ${line(0.08)}; color: ${PLATINUM}; border: 0; border-radius: 999px;
  padding: 8px 16px; font: inherit; font-size: 13px; cursor: pointer; white-space: nowrap;
  &:hover { background: ${line(0.14)}; }
`;

/* ── shared section pieces ── */
export const Section = styled.section<{ $alt?: boolean; $minH?: number }>`
  min-height: ${p => (p.$minH ? `max(${p.$minH}px, min(100vh, ${p.$minH + 220}px))` : 'auto')};
  display: flex; align-items: center;
  background: ${p => (p.$alt ? PANEL : 'transparent')};
  border-top: 1px solid ${line(0.07)};
  > div { padding-top: 96px; padding-bottom: 96px; }
  @media (max-width: 760px) { min-height: 0; > div { padding-top: 64px; padding-bottom: 64px; } }
`;
export const Stack = styled.div<{ $gap?: number }>`
  display: flex; flex-direction: column; gap: ${p => p.$gap ?? 48}px;
`;
export const Kicker = styled.div<{ $color?: string }>`
  font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: ${p => p.$color ?? GOLD};
`;
export const H2 = styled.h2<{ $size?: number }>`
  ${serif};
  margin: 0; font-size: ${p => p.$size ?? 64}px; line-height: 1.05;
  @media (max-width: 760px) { font-size: 40px; }
`;
export const Muted = styled.div<{ $size?: number }>`
  font-size: ${p => p.$size ?? 14}px; color: ${line(0.68)};
`;
export const LiveDot = styled.span<{ $size?: number; $still?: boolean }>`
  flex: none; width: ${p => p.$size ?? 8}px; height: ${p => p.$size ?? 8}px; border-radius: 50%; background: ${TEAL};
  ${p => !p.$still && css`animation: ${ping} 1.6s ease-out infinite; ${still}`}
`;

/* ── buttons ── */
const btn = css`
  display: inline-flex; align-items: center; gap: 10px; text-decoration: none;
  font: inherit; font-size: 15px; border-radius: 12px; padding: 0 28px; min-height: 56px; cursor: pointer;
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
  min-height: max(760px, min(100vh, 960px));
  display: flex; align-items: center;
  background: radial-gradient(1100px 600px at 78% 45%, rgba(141, 15, 245, 0.16), rgba(14, 11, 22, 0) 70%);
  @media (max-width: 760px) { min-height: 0; }
`;
export const HeroRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 64px; align-items: center;
  padding-top: 72px; padding-bottom: 72px;
  @media (max-width: 760px) { gap: 40px; padding-top: 40px; padding-bottom: 48px; }
`;
export const HeroCopy = styled.div`
  flex: 1 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 32px;
`;
export const H1 = styled.h1`
  ${serif};
  margin: 0; font-size: 96px; line-height: 0.98; letter-spacing: -0.025em;
  em { color: ${LILAC}; }
  @media (max-width: 760px) { font-size: 56px; }
`;
export const Lede = styled.p`
  margin: 0; max-width: 56ch; font-size: 15px; line-height: 1.75; color: ${line(0.7)};
`;

/* ── ask box ── */
export const AskForm = styled.form`
  display: flex; align-items: center; gap: 10px;
  background: ${RAISED}; border: 1px solid rgba(154, 72, 255, 0.5); border-radius: 18px;
  padding: 10px 10px 10px 22px; max-width: 720px; width: 100%; box-sizing: border-box; text-align: left;
  &:focus-within { border-color: ${VIOLET_D}; box-shadow: 0 0 0 4px rgba(141, 15, 245, 0.22); }
  svg { flex: none; }
  input {
    flex: 1 1 auto; min-width: 0; background: transparent; border: 0; color: ${PLATINUM};
    font: inherit; font-size: 16px; padding: 14px 0;
    &::placeholder { color: ${line(0.5)}; }
    &:focus { outline: none; }
  }
  button {
    flex: none; background: ${VIOLET}; color: var(--foreground); border: 0; font: inherit; font-weight: 600; font-size: 15px;
    border-radius: 12px; padding: 0 26px; min-height: 52px; cursor: pointer;
    &:hover { background: ${VIOLET_D}; }
  }
  @media (max-width: 520px) { padding-left: 14px; button { padding: 0 16px; } }
`;
export const VisuallyHidden = styled.label`
  position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
`;
export const Chips = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px;
  a {
    font-size: 13px; color: ${line(0.75)}; text-decoration: none; border: 1px solid ${line(0.14)};
    border-radius: 999px; padding: 0 14px; min-height: 36px; display: inline-flex; align-items: center;
  }
  a:hover { border-color: ${VIOLET_D}; color: ${PLATINUM}; }
`;

/* ── hero event card ── */
export const CardSlot = styled.div`
  flex: 1 1 480px; min-width: 0; display: flex; justify-content: center;
`;
export const EventCard = styled.a`
  width: 100%; max-width: 560px; display: block; text-decoration: none; color: ${PLATINUM} !important;
  background: linear-gradient(180deg, ${RAISED}, ${PANEL}); border: 1px solid ${line(0.14)}; border-radius: 22px;
  overflow: hidden; box-shadow: 0 40px 120px rgba(141, 15, 245, 0.25);
  animation: ${floaty} 6s ease-in-out infinite; ${still}
  &:hover { border-color: rgba(154, 72, 255, 0.5); }
`;
export const CardHead = styled.div`
  display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 22px 26px;
  > span:first-child { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 20px; }
  > span:last-child { font-size: 11px; letter-spacing: 0.14em; color: ${GOLD}; }
`;
export const CardStats = styled.div`
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid ${line(0.08)}; border-bottom: 1px solid ${line(0.08)};
  > div { padding: 18px 26px; display: flex; flex-direction: column; gap: 2px; }
  > div + div { border-left: 1px solid ${line(0.08)}; }
  small { font-size: 11px; color: ${line(0.6)}; }
  strong { ${serif}; font-size: 34px; line-height: 1.1; }
  @media (max-width: 520px) { > div { padding: 14px 16px; } strong { font-size: 26px; } }
`;
export const CardRows = styled.div`
  display: flex; flex-direction: column; font-size: 13.5px; padding: 8px 0;
`;
export const CardRow = styled.div<{ $active?: boolean }>`
  display: grid; grid-template-columns: 64px minmax(0, 1fr) auto; gap: 12px; padding: 11px 26px;
  transition: background 0.4s;
  background: ${p => (p.$active ? 'rgba(141, 15, 245, 0.16)' : 'transparent')};
  > span:first-child { color: ${line(0.6)}; }
  @media (max-width: 520px) { padding: 10px 16px; grid-template-columns: 52px minmax(0, 1fr) auto; font-size: 12.5px; }
`;
export const CardFoot = styled.div`
  display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 16px 26px;
  border-top: 1px solid ${line(0.08)}; font-size: 12.5px;
  > span:first-child { color: ${line(0.6)}; }
  > span:last-child { color: ${LILAC}; font-weight: 500; }
`;

/* ── just-in ticker ── */
export const Ticker = styled.div`
  display: flex; align-items: center; border-top: 1px solid ${line(0.07)}; background: ${SUNKEN};
  overflow: hidden; min-height: 56px;
`;
export const TickerLabel = styled.a`
  flex: none; align-self: stretch; display: flex; align-items: center; gap: 10px; padding: 0 24px;
  font-size: 11px; letter-spacing: 0.16em; color: ${TEAL} !important; text-decoration: none;
  background: ${SUNKEN}; position: relative; z-index: 1; border-right: 1px solid ${line(0.08)};
`;
export const TickerTrack = styled.div`
  flex: 1 1 auto; min-width: 0; overflow: hidden;
  &:hover > div { animation-play-state: paused; }
`;
export const TickerRun = styled.div<{ $seconds: number }>`
  display: flex; gap: 48px; width: max-content; font-size: 13.5px; white-space: nowrap; padding-left: 24px;
  animation: ${marquee} ${p => p.$seconds}s linear infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; overflow-x: auto; }
  a { display: inline-flex; gap: 10px; align-items: center; color: ${PLATINUM}; text-decoration: none; }
  a:hover span:last-child { text-decoration: underline; }
`;
export const TickerDot = styled.span<{ $color: string }>`
  width: 6px; height: 6px; border-radius: 50%; background: ${p => p.$color}; flex: none;
`;

/* ── problem carousel ── */
export const Typed = styled.div<{ $accent?: boolean }>`
  ${serif};
  font-size: 104px; line-height: 1.02; letter-spacing: -0.02em; max-width: 1180px;
  color: ${p => (p.$accent ? LILAC : PLATINUM)};
  min-height: 2.04em;
  @media (max-width: 760px) { font-size: 46px; }
`;
export const Caret = styled.span`
  color: ${LILAC}; font-weight: 300; animation: ${blink} 1s step-end infinite; ${still}
`;
export const Sub = styled.div`
  font-size: 18px; color: ${line(0.72)}; max-width: 640px; animation: ${fadeup} 0.6s ease-out both; ${still}
`;
export const Dots = styled.div`
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  > button.dot { background: transparent; border: 0; padding: 18px 0; cursor: pointer; width: 96px; }
  > button.pause {
    margin-left: 8px; background: transparent; color: ${line(0.7)}; border: 1px solid ${line(0.2)};
    border-radius: 999px; width: 44px; height: 44px; cursor: pointer; font: inherit; font-size: 13px;
  }
  @media (max-width: 520px) { > button.dot { width: 56px; } }
`;
export const DotBar = styled.span<{ $on: boolean }>`
  display: block; height: 3px; border-radius: 2px; background: ${p => (p.$on ? 'var(--starithm-veronica-dark)' : line(0.2))};
`;

/* ── what it does: bento ── */
export const Bento = styled.div`
  display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 20px;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;
export const Panel = styled.a<{ $span: number; $feature?: boolean; $minH?: number }>`
  grid-column: span ${p => p.$span};
  min-height: ${p => p.$minH ?? 260}px; box-sizing: border-box;
  text-decoration: none; color: ${PLATINUM} !important;
  border: 1px solid ${p => (p.$feature ? 'rgba(154, 72, 255, 0.4)' : line(0.12))};
  border-radius: 22px; padding: ${p => (p.$feature ? 40 : 36)}px;
  background: ${p => (p.$feature ? `linear-gradient(135deg, var(--accent-surface), ${PANEL})` : PANEL)};
  display: flex; flex-direction: column; justify-content: space-between; gap: 24px;
  &[href]:hover { border-color: rgba(154, 72, 255, 0.5); }
  @media (max-width: 760px) { grid-column: span 1; min-height: 0; padding: 28px; }
`;
export const PanelLabel = styled.div<{ $color: string }>`
  font-size: 12px; letter-spacing: 0.1em; color: ${p => p.$color}; display: flex; align-items: center; gap: 8px;
`;
export const PanelTitle = styled.div<{ $size?: number }>`
  ${serif}; font-size: ${p => p.$size ?? 28}px; line-height: 1.12;
  @media (max-width: 760px) { font-size: 26px; }
`;
export const Bubble = styled.div`
  align-self: flex-end; background: ${line(0.08)}; border-radius: 14px 14px 4px 14px; padding: 10px 16px; font-size: 14px;
`;

/* ── accuracy ── */
export const Stats = styled.div`
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;
  > div { border-top: 1px solid ${line(0.2)}; padding-top: 24px; display: flex; flex-direction: column; gap: 8px; }
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;
export const Big = styled.div`
  ${serif}; font-size: 120px; line-height: 0.95; letter-spacing: -0.03em;
  span { font-size: 0.5em; }
  @media (max-width: 760px) { font-size: 84px; }
`;
export const HeadRow = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap;
`;

/* ── how it works ── */
export const Steps = styled.ol`
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;
`;
export const StepItem = styled.li<{ $on: boolean }>`
  display: flex; flex-direction: column; gap: 10px; padding: 28px; min-height: 180px; box-sizing: border-box;
  border-radius: 18px; transition: all 0.5s;
  border: 1px solid ${p => (p.$on ? 'rgba(154, 72, 255, 0.7)' : line(0.12))};
  background: ${p => (p.$on ? 'rgba(141, 15, 245, 0.14)' : PANEL)};
  small { font-size: 12px; color: ${line(0.6)}; }
  strong { ${serif}; font-size: 30px; line-height: 1.1; }
  span { font-size: 13px; color: ${line(0.7)}; }
`;
export const Demo = styled.div`
  border: 1px solid ${line(0.14)}; border-radius: 22px; overflow: hidden; background: ${PANEL};
  video { display: block; width: 100%; height: auto; }
`;

/* ── join early ── */
export const SplitRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 72px; align-items: center;
  > div { flex: 1 1 480px; min-width: 0; }
  @media (max-width: 760px) { gap: 40px; }
`;
export const Providers = styled.div`
  display: flex; flex-direction: column; gap: 12px; max-width: 400px;
  button {
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    background: transparent; color: ${PLATINUM}; border: 1px solid ${line(0.28)}; border-radius: 12px;
    min-height: 56px; font: inherit; font-size: 15px; font-weight: 500; cursor: pointer;
  }
  button:first-child { background: ${PLATINUM}; color: ${BLACK}; border: 0; font-weight: 600; }
  button:disabled { opacity: 0.6; cursor: default; }
`;
export const ErrorNote = styled.div<{ $color: string }>`
  font-size: 13px; color: ${p => p.$color};
`;
export const FormCard = styled.div`
  width: 100%; max-width: 560px; margin: 0 auto; border: 1px solid ${line(0.14)}; border-radius: 22px;
  background: ${BLACK}; overflow: hidden; box-shadow: 0 40px 120px rgba(0, 0, 0, 0.5);
  animation: ${floaty} 6s ease-in-out infinite; ${still}
  > div:first-child {
    padding: 20px 26px; border-bottom: 1px solid ${line(0.08)}; font-size: 14px;
    display: flex; justify-content: space-between; gap: 12px;
    span:first-child { font-weight: 600; } span:last-child { color: ${line(0.6)}; }
  }
  > div:last-child { padding: 26px; display: flex; flex-direction: column; gap: 14px; }
`;
export const FormTitle = styled.div`${serif}; font-size: 26px;`;
export const FakeField = styled.div<{ $tall?: boolean }>`
  border: 1px solid ${line(0.14)}; border-radius: 10px; padding: 14px; font-size: 13px; color: ${line(0.6)};
  min-height: ${p => (p.$tall ? 80 : 0)}px; box-sizing: border-box;
`;
export const FieldRow = styled.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;
`;

/* ── closing ── */
export const Closing = styled.section`
  border-top: 1px solid ${line(0.07)};
  background: radial-gradient(900px 500px at 50% 40%, rgba(141, 15, 245, 0.14), rgba(14, 11, 22, 0) 70%);
  > div { padding-top: 96px; padding-bottom: 96px; display: flex; flex-direction: column; align-items: center; gap: 36px; text-align: center; }
`;
export const Contact = styled.div`
  margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 640px;
  > div:last-child { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
  ${GhostButton} { min-height: 48px; padding: 0 20px; font-size: 14px; }
`;

/* ── footer ── */
export const Footer = styled.footer`
  border-top: 1px solid ${line(0.07)};
  > div { padding-top: 48px; padding-bottom: 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 32px; font-size: 13px; }
`;
export const FooterCols = styled.div`
  display: flex; flex-wrap: wrap; gap: 48px;
  > div { display: flex; flex-direction: column; gap: 8px; }
  span { color: ${line(0.6)}; font-size: 12px; }
  a { color: ${line(0.8)}; text-decoration: none; }
  a:hover { color: ${PLATINUM}; }
`;
