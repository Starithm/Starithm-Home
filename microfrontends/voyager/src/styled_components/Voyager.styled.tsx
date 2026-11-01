import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

/* Voyager 1 · One light-day. Built to be projected: large type, dark ground, every live number
 * in the mono face so digits don't jitter while they tick. Colours come only from globals.css. */

const NARROW = '@media (max-width: 1099px)';
const PHONE = '@media (max-width: 640px)';

export const label = css`
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.75); }
`;

export const Page = styled.div`
  min-height: 100vh;
  color: var(--text-body);
  font-family: var(--font-mono);
  background:
    radial-gradient(80% 60% at 85% 0%, color-mix(in srgb, var(--accent-surface) 70%, transparent) 0%, transparent 65%),
    var(--background);

  /* cancel the shell's .microfrontend-container padding so the ground runs edge to edge */
  margin: -2rem;

  @media (max-width: 768px) {
    margin: 0;
  }
`;

export const Inner = styled.div`
  max-width: 1480px;
  margin: 0 auto;
  padding: 0 32px 48px;

  ${PHONE} {
    padding: 0 16px 32px;
  }
`;

/* ---- header ---- */

export const Header = styled.header`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 20px;
  padding: 20px 0 8px;
`;

export const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-body);
  text-decoration: none;

  &:hover span {
    color: var(--accent-text);
  }
`;

export const BrandLogo = styled.img`
  width: 24px;
  height: 24px;
`;

export const BrandName = styled.span`
  letter-spacing: 0.18em;
  color: var(--text-muted);
`;

export const Crumb = styled.span`
  font-size: 13px;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
`;

export const HeaderRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 18px;
  font-size: 12px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
`;

export const Pill = styled.button<{ $on?: boolean }>`
  padding: 6px 14px;
  border: 1px solid ${(p) => (p.$on ? 'var(--accent-border)' : 'var(--line-control)')};
  border-radius: 999px;
  background: ${(p) => (p.$on ? 'var(--accent-surface)' : 'transparent')};
  color: ${(p) => (p.$on ? 'var(--accent-text)' : 'var(--text-muted)')};
  font: inherit;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    border-color: var(--accent-border);
    color: var(--accent-text);
  }

  &:focus-visible {
    outline: 1px solid var(--accent-text);
    outline-offset: 2px;
  }
`;

/* ---- below the slide ---- */

/* The website half: starts a clear gap below the slide, so the slide stays one clean screen. */
export const Below = styled.div`
  padding-top: 12vh;
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

export const CraftFrame = styled.figure`
  position: relative;
  margin: 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--line-hairline);
  aspect-ratio: 16 / 10;
  background: var(--surface-sunken);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 38% 45%;
    display: block;
  }

  figcaption {
    position: absolute;
    left: 14px;
    bottom: 12px;
    font-size: 10.5px;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    text-shadow: 0 1px 6px var(--background);
  }
`;

/* ---- stat strip ---- */

export const Stats = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border: 1px solid var(--line-hairline);
  border-radius: 14px;
  background: var(--surface);
  overflow: hidden;

  ${NARROW} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${PHONE} {
    grid-template-columns: 1fr;
  }
`;

export const Stat = styled.div`
  padding: 20px 22px;
  border-right: 1px solid var(--line-hairline);
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  &:last-child {
    border-right: none;
  }

  ${NARROW} {
    border-bottom: 1px solid var(--line-hairline);
  }
`;

export const StatLabel = styled.div`
  ${label};
`;

export const StatValue = styled.div`
  font-size: clamp(20px, 1.9vw, 28px);
  font-variant-numeric: tabular-nums;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  small {
    font-size: 0.55em;
    color: var(--text-muted);
    margin-left: 4px;
  }
`;

export const StatNote = styled.div`
  font-size: 12px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
`;

/* ---- panels ---- */

export const Grid = styled.div<{ $cols?: string }>`
  display: grid;
  grid-template-columns: ${(p) => p.$cols ?? '1fr 1fr'};
  gap: 20px;
  margin-top: 20px;

  ${NARROW} {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  border: 1px solid var(--line-hairline);
  border-radius: 14px;
  background: var(--surface);
  padding: 22px 24px;
  min-width: 0;
`;

export const PanelHead = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-bottom: 16px;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  ${label};
  color: var(--text-secondary);
`;

export const Tag = styled.span<{ $tone?: 'live' | 'sim' | 'idle' }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid
    ${(p) => (p.$tone === 'live' ? 'var(--accent-border)' : p.$tone === 'sim' ? 'var(--starithm-golden-yellow)' : 'var(--line-control)')};
  color: ${(p) => (p.$tone === 'live' ? 'var(--accent-text)' : p.$tone === 'sim' ? 'var(--starithm-golden-yellow)' : 'var(--text-muted)')};

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    ${(p) =>
      p.$tone !== 'idle' &&
      css`
        animation: ${pulse} 1.6s ease-in-out infinite;
      `}
  }
`;

export const Prose = styled.p`
  margin: 0 0 12px;
  font-family: var(--font-prose);
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: var(--measure);

  strong {
    color: var(--foreground);
  }
`;

export const Fine = styled.p`
  margin: 12px 0 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--text-muted);
`;

/* ---- DSN ---- */

export const Stations = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  ${PHONE} {
    grid-template-columns: 1fr;
  }
`;

export const Station = styled.div<{ $active?: boolean }>`
  padding: 14px;
  border-radius: 10px;
  border: 1px solid ${(p) => (p.$active ? 'var(--accent-border)' : 'var(--line-hairline)')};
  background: ${(p) => (p.$active ? 'var(--accent-surface)' : 'var(--surface-sunken)')};

  h3 {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 500;
    color: ${(p) => (p.$active ? 'var(--accent-text)' : 'var(--text-body)')};
  }
`;

export const DishRow = styled.div<{ $voyager?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11.5px;
  line-height: 1.9;
  color: ${(p) => (p.$voyager ? 'var(--accent-text)' : 'var(--text-muted)')};

  span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const LinkReadout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 16px;
  border: 1px solid var(--line-hairline);
  border-radius: 10px;
  overflow: hidden;

  ${Stat} {
    padding: 12px 14px;
  }

  ${StatValue} {
    font-size: 22px;
  }

  ${PHONE} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

/* ---- music ---- */

export const Transport = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;

  select {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid var(--line-control);
    background: var(--surface-sunken);
    color: var(--text-body);
    font: inherit;
    font-size: 12px;
  }
`;

export const PlayButton = styled.button<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid var(--primary);
  background: ${(p) => (p.$on ? 'transparent' : 'var(--primary)')};
  color: ${(p) => (p.$on ? 'var(--accent-text)' : 'var(--foreground)')};
  font: inherit;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;

  &:focus-visible {
    outline: 1px solid var(--accent-text);
    outline-offset: 2px;
  }
`;

export const BitBudget = styled.div`
  margin-bottom: 14px;

  div:first-child {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 6px;
    font-variant-numeric: tabular-nums;
  }
`;

export const BitTrack = styled.div`
  display: grid;
  grid-template-columns: repeat(48, 1fr);
  gap: 2px;
  height: 10px;
`;

export const Bit = styled.span<{ $on: boolean }>`
  border-radius: 1px;
  background: ${(p) => (p.$on ? 'var(--accent-text)' : 'var(--line-hairline)')};
  transition: background 80ms linear;
`;

export const Roll = styled.svg`
  display: block;
  width: 100%;
  height: 170px;
  border-radius: 10px;
  background: var(--surface-sunken);
  border: 1px solid var(--line-hairline);
`;

/* ---- scale ---- */

export const ScaleWrap = styled.div`
  position: relative;
  padding: 64px 0 52px;
`;

export const ScaleLine = styled.div`
  position: relative;
  height: 2px;
  background: linear-gradient(90deg, var(--starithm-golden-yellow), var(--line-control) 25%, var(--line-control));
`;

export const Mark = styled.div<{ $left: number; $up?: boolean; $tone?: 'gold' | 'accent' }>`
  position: absolute;
  left: ${(p) => p.$left}%;
  top: 0;
  transform: translateX(-50%);

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: ${(p) => (p.$up ? '-14px' : '2px')};
    width: 1px;
    height: 12px;
    background: ${(p) => (p.$tone === 'gold' ? 'var(--starithm-golden-yellow)' : p.$tone === 'accent' ? 'var(--accent-text)' : 'var(--text-faint)')};
  }

  span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    ${(p) => (p.$up ? 'bottom: 16px;' : 'top: 18px;')}
    white-space: nowrap;
    font-size: 11px;
    line-height: 1.4;
    text-align: center;
    color: ${(p) => (p.$tone === 'gold' ? 'var(--starithm-golden-yellow)' : p.$tone === 'accent' ? 'var(--accent-text)' : 'var(--text-muted)')};
  }
`;

export const Dot = styled.div<{ $left: number }>`
  position: absolute;
  left: ${(p) => p.$left}%;
  top: -5px;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  border-radius: 50%;
  background: var(--accent-text);
  box-shadow: 0 0 0 4px var(--accent-surface), 0 0 24px var(--primary);
`;

/* ---- golden record ---- */

export const RecordFig = styled.figure`
  margin: 0 0 16px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--line-hairline);

  img {
    display: block;
    width: 100%;
  }
`;

export const KV = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 18px;
  margin: 0 0 14px;
  font-size: 14px;
  font-variant-numeric: tabular-nums;

  dt {
    ${label};
    align-self: center;
  }

  dd {
    margin: 0;
    color: var(--foreground);
  }
`;

export const Footer = styled.footer`
  margin-top: 36px;
  padding-top: 18px;
  border-top: 1px solid var(--line-hairline);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px 24px;
  font-size: 11px;
  line-height: 1.7;
  color: var(--text-faint);

  a {
    color: var(--text-muted);
  }
`;

export const TextButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 12px;
  color: var(--accent-text);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const NowPlaying = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
`;
