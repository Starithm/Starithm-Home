import styled, { keyframes, css } from 'styled-components';

/* Homepage v2 — "Astronomy's memory layer".
 *
 * Colours come from the Starithm palette in shared/styles/globals.css. They are
 * referenced as CSS custom properties rather than hardcoded hexes so a palette
 * change propagates here for free.
 *
 * Display type is Newsreader (loaded in index.html); everything functional stays
 * on Google Sans Code, the product's face.
 */

const VIOLET = 'var(--starithm-electric-violet, #770ff5)';
const VIOLET_D = 'var(--starithm-electric-violet-dark, #9A48FF)';
const VERONICA_D = 'var(--starithm-veronica-dark, #C84BF7)';
const GOLD = 'var(--starithm-golden-yellow, #ffc332)';
const PLATINUM = 'var(--starithm-platinum, #E7DFDD)';
const BLACK = 'var(--starithm-rich-black, #0E0B16)';

/* Alpha variants of --starithm-platinum (231,223,221) for borders and muted text. */
const line = (a: number) => `rgba(231, 223, 221, ${a})`;

const pulse = keyframes`
  0%, 100% { opacity: .35; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.35); }
`;

const serif = css`
  font-family: Newsreader, Georgia, serif;
  font-weight: 400;
`;

export const Page = styled.div`
  background: ${BLACK};
  color: ${PLATINUM};
  min-height: 100vh;
  overflow-x: hidden;
  img, svg { max-width: 100%; }
`;

export const Shell = styled.div`
  max-width: min(100%, 1280px);
  margin: 0 auto;
`;

export const Section = styled.section<{ $flush?: boolean }>`
  padding: clamp(48px, 7vw, 70px) clamp(20px, 4vw, 44px);
  border-bottom: ${p => (p.$flush ? 'none' : `1px solid ${line(0.1)}`)};
`;

export const Eyebrow = styled.div<{ $accent?: boolean }>`
  font-size: 11px;
  letter-spacing: 0.2em;
  color: ${p => (p.$accent ? GOLD : line(0.4))};
  margin-bottom: ${p => (p.$accent ? '0' : '34px')};
  ${p => p.$accent && 'max-width: 200px;'}
`;

/* ── nav ─────────────────────────────────────────────────────────────── */

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px clamp(20px, 4vw, 44px);
  @media (max-width: 480px) { gap: 12px; }
`;

export const Brand = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
  flex-shrink: 0;
  img { width: 34px; height: 34px; display: block; }
  span { font-weight: 700; font-size: 14px; letter-spacing: 0.16em; }
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 26px);
  flex-wrap: wrap;
  font-size: 12px;
  color: ${line(0.62)};
  a { color: inherit; text-decoration: none; }
  a:hover { color: ${PLATINUM}; }
  /* Once the links wrap under the brand they own the full row, so spread them
     edge to edge rather than leaving a gap on the right. */
  @media (max-width: 620px) {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }
`;

export const NavSignIn = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: 0;
  background: ${line(0.08)};
  color: ${PLATINUM};
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  &:hover { background: ${line(0.14)}; }
`;

/* ── hero ────────────────────────────────────────────────────────────── */

export const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
  gap: clamp(32px, 4vw, 52px);
  padding: clamp(40px, 6vw, 64px) clamp(20px, 4vw, 44px) clamp(48px, 7vw, 72px);
  align-items: center;
`;

export const HeroKicker = styled.div`
  font-size: 11px;
  letter-spacing: 0.2em;
  color: ${VIOLET_D};
  margin-bottom: 28px;
`;

export const HeroTitle = styled.h1`
  ${serif};
  margin: 0 0 26px;
  font-size: clamp(38px, 6.4vw, 66px);
  line-height: 1.02;
  font-weight: 300;
  letter-spacing: -0.02em;
  em { color: ${VERONICA_D}; font-style: italic; }
`;

export const HeroLede = styled.p`
  margin: 0;
  max-width: 46ch;
  font-size: 14px;
  line-height: 1.8;
  color: ${line(0.66)};
`;

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 32px;
`;

export const PrimaryCta = styled.a`
  padding: 14px 24px;
  border-radius: 24px;
  background: ${VIOLET_D};
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  &:hover { background: ${VERONICA_D}; }
`;

/* Secondary to PrimaryCta — same geometry, outline instead of fill, so the pair
   reads as one primary action plus an alternative rather than two competing CTAs. */
export const SecondaryCta = styled.button`
  padding: 14px 24px;
  border-radius: 24px;
  border: 1px solid ${line(0.25)};
  background: transparent;
  color: ${PLATINUM};
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  &:hover { border-color: ${line(0.5)}; background: ${line(0.05)}; }
`;

export const TextLink = styled.a`
  color: ${VERONICA_D};
  font-size: 12.5px;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

export const CtaNote = styled.span`
  font-size: 11.5px;
  color: ${line(0.42)};
`;

/* ── hero event card ─────────────────────────────────────────────────── */

const drift = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-16px); }
`;

export const EventCard = styled.div`
  border: 1px solid ${line(0.14)};
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, #151022, #0d0a15);
  animation: ${drift} 6s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const EventHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 18px 20px;
  border-bottom: 1px solid ${line(0.1)};
`;

export const EventId = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

export const Significance = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10.5px;
  color: ${GOLD};
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${GOLD};
    animation: ${pulse} 1.8s ease-in-out infinite;
    @media (prefers-reduced-motion: reduce) { animation: none; }
  }
`;

export const EventBlurb = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid ${line(0.1)};
  font-size: 12.5px;
  line-height: 1.7;
  color: ${line(0.62)};
`;

export const Timeline = styled.div`
  padding: 6px 0 4px;
`;

export const TimelineRow = styled.div<{ $highlight?: boolean }>`
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 11px 20px;
  font-size: 11.5px;
  /* The extracted row is tinted to mark the moment a measurement is pulled out. */
  background: ${p => (p.$highlight ? 'rgba(119, 15, 245, 0.1)' : 'transparent')};
  > span:first-child { color: ${line(0.4)}; }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 2px;
    > span:first-child { opacity: 0.55; }
  }
`;

export const Tag = styled.span<{ $color: string }>`
  color: ${p => p.$color};
`;

export const EventFoot = styled.div`
  padding: 14px 20px;
  border-top: 1px solid ${line(0.1)};
  font-size: 10.5px;
  color: ${line(0.35)};
`;

/* ── problem / feature blocks ────────────────────────────────────────── */

/* 1px gaps over a tinted background render as hairline rules between cells,
   so the block reads as one bordered table rather than three floating items. */
export const ProblemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 1px;
  background: ${line(0.1)};
  border: 1px solid ${line(0.1)};
`;

export const ProblemItem = styled.div`
  background: ${BLACK};
  padding: 24px;
  strong { display: block; font-size: 12.5px; font-weight: 600; margin-bottom: 9px; }
  div { font-size: 12px; line-height: 1.7; color: ${line(0.55)}; }
`;

export const ProblemKicker = styled.p`
  margin: 26px 0 0;
  font-size: 14px;
  em { color: ${VIOLET_D}; font-style: normal; }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 26px);
  max-width: min(100%, 880px);
  margin: 0 auto;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

export const FeatureCard = styled.div`
  border: 1px solid ${line(0.12)};
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 230px;
`;

export const FeatureTitle = styled.div`
  ${serif};
  font-size: 24px;
  line-height: 1.2;
  margin-bottom: 12px;
`;

export const FeatureBody = styled.div`
  font-size: 12.5px;
  line-height: 1.8;
  color: ${line(0.6)};
`;

/* ── pipeline ────────────────────────────────────────────────────────── */

const travel = keyframes`
  from { left: -8%; }
  to   { left: 104%; }
`;

/* A lit segment sweeping the rail above the pipeline — reads as data moving
   through the steps. */
export const StepRail = styled.div`
  position: relative;
  height: 2px;
  background: ${line(0.12)};
  margin: 0 5% 28px;
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -3px;
    width: 68px;
    height: 8px;
    border-radius: 8px;
    background: linear-gradient(90deg, transparent, ${VIOLET_D}, transparent);
    animation: ${travel} 4.2s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) { &::after { animation: none; left: 45%; } }
`;

export const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr));
  gap: clamp(12px, 1.5vw, 18px);
`;

export const Step = styled.div<{ $accent?: boolean }>`
  border: 1px solid ${p => (p.$accent ? 'rgba(154, 72, 255, 0.4)' : line(0.12))};
  border-radius: 12px;
  padding: 22px;
  background: ${p =>
    p.$accent ? 'linear-gradient(150deg, rgba(119, 15, 245, 0.2), #120e1e)' : '#120e1e'};
`;

export const StepNo = styled.div<{ $accent?: boolean }>`
  font-size: 10px;
  color: ${p => (p.$accent ? VERONICA_D : VIOLET_D)};
  margin-bottom: 14px;
  letter-spacing: 0.1em;
`;

export const StepName = styled.div`
  font-size: 14.5px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const StepBody = styled.div<{ $accent?: boolean }>`
  font-size: 12px;
  line-height: 1.65;
  color: ${p => (p.$accent ? line(0.62) : line(0.55))};
`;

export const SectionHeading = styled.h2<{ $left?: boolean }>`
  ${serif};
  margin: ${p => (p.$left ? '0 0 30px' : '0 auto 16px')};
  max-width: 26ch;
  font-size: clamp(29px, 4.6vw, 42px);
  font-weight: 600;
  line-height: 1.12;
`;

/* Heading left, link right, sharing a baseline — wraps to two lines on narrow screens. */
export const ShotHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

export const Shot = styled.div`
  margin-top: 30px;
  border: 1px solid ${line(0.14)};
  border-radius: 14px;
  overflow: hidden;
  /* The video carries the screenshot as its poster, so both render identically
     and the swap is invisible if the clip is missing or cannot play. */
  img, video { display: block; width: 100%; height: auto; }
`;

/* ── sign in ─────────────────────────────────────────────────────────── */

export const SignInSection = styled.section`
  padding: clamp(48px, 8vw, 80px) clamp(20px, 4vw, 44px);
  background: #0b0813;
  text-align: center;
  border-bottom: 1px solid ${line(0.1)};
`;

export const SignInLede = styled.p`
  margin: 0 auto 34px;
  max-width: 56ch;
  font-size: 13.5px;
  line-height: 1.8;
  color: ${line(0.62)};
`;

export const ProviderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
  gap: 10px;
  max-width: min(100%, 520px);
  margin: 0 auto;
`;

export const ProviderButton = styled.button`
  padding: 14px 20px;
  border: 1px solid ${line(0.22)};
  border-radius: 10px;
  background: transparent;
  color: ${PLATINUM};
  font: inherit;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  &:hover:not(:disabled) { border-color: ${line(0.45)}; background: ${line(0.04)}; }
  &:disabled { opacity: 0.55; cursor: default; }
  svg { flex-shrink: 0; }
`;

export const SignInNote = styled.div`
  margin-top: 16px;
  font-size: 11.5px;
  color: ${line(0.4)};
`;

export const SignInError = styled.div`
  margin-top: 14px;
  font-size: 11.5px;
  color: #FF6B6B;
`;

/* ── disclosure + footer ─────────────────────────────────────────────── */

export const DisclosureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: clamp(18px, 3vw, 32px);
`;

export const Disclosure = styled.div`
  font-size: 12.5px;
  line-height: 1.85;
  color: ${line(0.6)};
  max-width: 82ch;
`;

export const FooterBar = styled.footer`
  padding: clamp(32px, 5vw, 44px);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  flex-wrap: wrap;
  font-size: 11.5px;
  color: ${line(0.45)};
`;

export const FooterCols = styled.div`
  display: flex;
  gap: clamp(24px, 4vw, 48px);
  flex-wrap: wrap;
`;

export const FooterCol = styled.div`
  display: grid;
  gap: 8px;
  align-content: start;
  span:first-child { color: ${PLATINUM}; }
  a, button {
    color: inherit;
    text-decoration: none;
    background: none;
    border: 0;
    padding: 0;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  a:hover, button:hover { color: ${PLATINUM}; }
`;

export const FooterMark = styled.div`
  div:first-child { letter-spacing: 0.16em; color: ${PLATINUM}; margin-bottom: 6px; }
`;
