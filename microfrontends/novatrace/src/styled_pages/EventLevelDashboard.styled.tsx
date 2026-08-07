import styled from 'styled-components';

/* Mobile sheet height, in vh. Tall enough to reach the actions without
   scrolling on a typical phone, short enough to leave the globe usable. */
export const SHEET_HEIGHT_VH = 58;
import { getThemeValue } from '@shared/utils/themeUtils';

// Main container
/* The reference sits on near-black (#0a0a0f), not the app's violet-tinted
   #0E0B16 — the sphere's own glow is the only colour on the page. */
export const EventLevelContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0f;
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#E7DFDD')};
  user-select: none;
`;

// Header section
export const Header = styled.div`
  background-color: #0a0a0f;
  position: relative;
  z-index: 200;
  overflow: visible;
`;

export const HeaderContent = styled.div`
  padding: 14px 20px;
  @media (max-width: 640px) {
    padding: 0.3rem 0.75rem;
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};

  @media (max-width: 640px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
`;

export const LogoContainer = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8D0FF5 0%, #A239CA 100%);
  box-shadow: 0 8px 32px rgba(141, 15, 245, 0.3);
`;

export const LogoText = styled.span`
  color: white;
  font-weight: bold;
  font-size: 1.125rem;
`;

/* Starithm brand lock-up. The mark is used bare rather than inside LogoContainer's
   violet gradient — the arcs are the same purple and would disappear against it. */
export const BrandLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
`;

export const BrandMark = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  display: block;
`;

export const BrandWordmark = styled.span`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  @media (max-width: 640px) {
    display: none;
  }
`;

export const BrandDivider = styled.span`
  color: ${({ theme }) => getThemeValue(theme, 'border', '#d8d4e0')};
  @media (max-width: 640px) {
    display: none;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xl', '1.25rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.semibold', 600)};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  @media (max-width: 640px) {
    display: none;
  }
`;

export const HeaderRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 16px;
`;

/* Globe ⇄ List toggle. Both views share the same filters and selected event —
   this only swaps what fills the main region. */
export const ViewToggle = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border-radius: 999px;
  border: 1px solid rgba(231, 223, 221, 0.14);
  background: rgba(231, 223, 221, 0.04);
`;

export const ViewToggleOption = styled.button<{ $active: boolean }>`
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.3rem 0.85rem;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  background: ${p => (p.$active ? '#6B34B0' : 'transparent')};
  color: ${p => (p.$active ? '#E7DFDD' : 'rgba(231, 223, 221, 0.55)')};

  &:hover {
    color: #E7DFDD;
  }
`;

export const EventCount = styled.div`
  text-align: right;
  white-space: nowrap;
  @media (max-width: 640px) {
    display: none;
  }
`;

export const EventCountNumber = styled.div`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
`;

export const EventCountDate = styled.div`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xs', '0.75rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  @media (max-width: 640px) {
    display: none;
  }
`;

export const LiveDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background: linear-gradient(45deg, #FFB400, #FF9F43);
  box-shadow: 0 0 8px rgba(255, 180, 0, 0.6);

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const LiveText = styled.span`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

// Navigation section
export const Navigation = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')} ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
`;

// Search section
export const SearchSection = styled.div<{ $overlay?: boolean }>`
  /* Plain declarations first: a nested rule inside an interpolation was swallowing
     everything declared after it, which is why z-index never reached the class. */
  padding: ${p => (p.$overlay ? '0 20px' : '0 20px 10px')};
  position: ${p => (p.$overlay ? 'absolute' : 'static')};
  top: ${p => (p.$overlay ? '16px' : 'auto')};
  left: ${p => (p.$overlay ? '0' : 'auto')};
  right: ${p => (p.$overlay ? '0' : 'auto')};
  /* Interpolated rather than static: in this styled-components/stylis version a
     plain declaration sitting among interpolated ones gets dropped from the
     generated class — position/top applied, a literal z-index did not. */
  z-index: ${p => (p.$overlay ? '60' : '9999')};
  overflow: ${() => 'visible'};
  pointer-events: ${p => (p.$overlay ? 'none' : 'auto')};

  > * {
    pointer-events: auto;
  }

  @media (max-width: 640px) {
    padding: 0.5rem 0.75rem 0;
  }
`;

/* Inline in the header row, between the brand and the right-hand controls —
   the reference gives search a 620px lane rather than a full-width row of its
   own, which is what freed the vertical space for a much larger globe. */
export const SearchBarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  max-width: 620px;
  margin: 0 28px;

  @media (max-width: 900px) {
    margin: 0 12px;
  }
  @media (max-width: 640px) {
    order: 3;
    flex: 1 0 100%;
    max-width: none;
    margin: 10px 0 0;
  }
`;

export const SearchBarInput = styled.input`
  width: 100%;
  /* Muted, per the reference — a full-strength violet outline made the search
     bar the loudest thing on a page whose subject is the sphere. */
  background: rgba(107, 52, 176, 0.10);
  border: 1px solid rgba(141, 15, 245, 0.32);
  border-radius: 999px;
  padding: 0.6rem 3rem 0.6rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#e7dfdd')};
  outline: none;
  transition: border-color 0.15s;
  &::placeholder { color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')}; }
  &:focus { border-color: rgba(141, 15, 245, 0.6); }
`;

export const SearchBarSendButton = styled.button`
  position: absolute;
  right: 0.4rem;
  @keyframes spin { to { transform: rotate(360deg); } }
  background: #6B34B0;
  border: none;
  border-radius: 999px;
  width: 1.75rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  flex-shrink: 0;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

export const SearchErrorText = styled.span`
  font-size: 0.65rem;
  color: var(--destructive, #ef4444);
  padding: 0.15rem 0.25rem 0;
  display: block;
`;

// Filter chip pills row — no overflow so absolute dropdowns aren't clipped by scroll container
export const FilterPillsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0 0.625rem;
  flex-wrap: wrap;
`;

export const FilterPillWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const FilterPill = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => $active ? 'transparent' : 'rgba(231, 223, 221, 0.14)'};
  background: ${({ $active }) => $active ? '#6B34B0' : 'rgba(14, 11, 22, 0.6)'};
  color: ${({ $active }) => $active ? '#E7DFDD' : 'rgba(231, 223, 221, 0.8)'};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  line-height: 1.4;
  &:hover { border-color: ${({ $active }) => $active ? 'transparent' : 'rgba(231, 223, 221, 0.3)'}; }
`;

export const PillDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.875rem;
  padding: 0.4rem;
  min-width: 200px;
  z-index: 99999;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

export const PillDropdownItem = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.35rem 0.625rem;
  border-radius: 0.5rem;
  border: none;
  background: ${({ $selected }) => $selected ? 'rgba(141, 15, 245, 0.15)' : 'transparent'};
  color: ${({ $selected }) => $selected ? '#8D0FF5' : 'var(--foreground)'};
  font-size: 0.75rem;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  transition: background 0.1s;
  &:hover { background: var(--muted); }
`;

export const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const DateRangeSeparator = styled.span`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const CelestialSphereContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 0;
  background: radial-gradient(circle at 50% 45%, #140f22 0%, #0a0a0f 70%);

  /* The sheet now overlays rather than stacking underneath, so the sphere keeps a
     usable size instead of being squeezed into a 200px strip. */
  @media (max-width: 640px) {
    height: calc(100vh - 280px);
    min-height: 320px;
    flex-shrink: 0;
    padding: 0.5rem;
  }
`;

/* Floating event panel.
 *
 * Desktop: an overlay pinned to the left of the sphere.
 * Mobile:  a bottom sheet. Previously the panel became a static block *below* a
 *          200px globe, which pushed the sphere to an unusable size and buried
 *          the event. As a sheet it overlays instead, so the globe keeps its
 *          height and the sheet can be dragged between peek and full. */
export const FloatingEventPanel = styled.div`
  /* Bottom-anchored rather than full-height, per 2a — a floor-to-ceiling column
     covered the sphere's whole left third including the zoom controls. */
  position: absolute;
  left: 20px;
  bottom: 20px;
  width: 400px;
  max-height: min(560px, calc(100% - 40px));
  z-index: 50;
  pointer-events: all;
  display: flex;
  align-items: flex-end;
  overflow-y: auto;

  @media (max-width: 640px) {
    position: fixed;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
    z-index: 120;
    display: block;
    overflow: hidden;
    /* One fixed height, content scrolls inside it.
       The two-position (peek/full) sheet is deferred: neither max-height nor
       transform would take effect on this element — the inline value and React
       state were both correct, no competing rule existed, yet geometry never
       changed. Rather than ship a grab handle that does nothing, the sheet sits
       at one size that clears the fold and scrolls. See the note in the page. */
    height: ${SHEET_HEIGHT_VH}vh;
    max-height: none;
    border-radius: 14px 14px 0 0;
    box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.55);
    /* Clear the iOS home indicator. */
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;

/* Grab bar — the visible affordance that the sheet moves, and the drag target. */
export const SheetHandle = styled.button`
  display: none;

  @media (max-width: 640px) {
    display: block;
    width: 100%;
    background: none;
    border: 0;
    padding: 9px 0 5px;
    cursor: grab;
    touch-action: none;

    &::before {
      content: '';
      display: block;
      width: 38px;
      height: 4px;
      margin: 0 auto;
      border-radius: 999px;
      background: rgba(231, 223, 221, 0.28);
    }
  }
`;

export const EventPanel = styled.div`
  width: 100%;
  background-color: ${({ theme }) => getThemeValue(theme, 'card', 'white')}F2;
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')}80;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);

  @media (max-width: 640px) {
    width: 100%;
    height: 100%;
    border: 0;
    border-top: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')}80;
    border-radius: 14px 14px 0 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
`;

/* ── 2a selected-event card ──────────────────────────────────────────────
 * One meta line, then a 2×2 field grid. Replaces the old stacked "Timing" and
 * "Position" sections, which spent a lot of vertical space on four values. */

/* Card header row, per the reference: id · kind chip · significance. */
export const KindChip = styled.span<{ $color: string }>`
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 7px;
  border-radius: 4px;
  background: ${p => `${p.$color}28`};
  color: ${p => p.$color};
  white-space: nowrap;
`;

export const SigTag = styled.span<{ $color: string }>`
  margin-left: auto;
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  color: ${p => p.$color};
`;

export const CardMetaLine = styled.div`
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 11px;
  color: rgba(231, 223, 221, 0.55);
  margin-bottom: 8px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 18px;
  margin-bottom: 9px;
`;

export const CardField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

export const CardFieldLabel = styled.span`
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 10px;
  line-height: 1.4;
  color: rgba(231, 223, 221, 0.38);
`;

export const CardFieldValue = styled.span`
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  color: #E7DFDD;
  overflow-wrap: anywhere;
`;

/* The summary is model-generated and unreviewed; that has to stay legible
   wherever it appears. Same rule as the record page. */
export const AiBlock = styled.div`
  border-left: 2px solid var(--starithm-selective-yellow, #FFB400);
  padding-left: 10px;
  margin-bottom: 10px;
`;

export const AiLabel = styled.div`
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 9px;
  line-height: 1.4;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 180, 0, 0.75);
  margin-bottom: 3px;
`;

export const AiText = styled.div`
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #ffc332;
`;

/* Actions row: primary fills, pager sits beside it. */
export const CardActions = styled.div`
  display: flex;
  gap: 9px;
  align-items: center;
`;

/* Rendered as an <a> at the call site so it behaves like a link; the button
   styles below cover both element types. */
export const PrimaryAction = styled.button`
  flex: 1;
  display: block;
  text-decoration: none;
  text-align: center;
  padding: 9px;
  border: 0;
  border-radius: 8px;
  background: #6B34B0;
  color: #E7DFDD;
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #7c3ec9; }
`;

export const Pager = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid rgba(231, 223, 221, 0.14);
  color: rgba(231, 223, 221, 0.7);
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 12px;
  white-space: nowrap;

  button {
    background: none; border: 0; padding: 0 2px; cursor: pointer;
    color: inherit; font: inherit;
    &:disabled { opacity: 0.3; cursor: default; }
    &:hover:not(:disabled) { color: #E7DFDD; }
  }
`;

/* The destination, spelled out — this navigates rather than opening a modal. */
export const RecordHint = styled.div`
  margin-top: 6px;
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 10px;
  color: rgba(231, 223, 221, 0.33);
`;

export const SignInPrompt = styled.div`
  margin-top: 9px;
  padding-top: 9px;
  border-top: 1px solid rgba(231, 223, 221, 0.08);
  display: flex;
  align-items: center;
  gap: 10px;

  p {
    flex: 1;
    margin: 0;
    font-family: 'Google Sans Code', ui-monospace, monospace;
    font-size: 11px;
    line-height: 1.5;
    color: rgba(231, 223, 221, 0.5);
  }
`;

export const SignInAction = styled.button`
  padding: 8px 13px;
  border-radius: 7px;
  border: 1px solid rgba(107, 52, 176, 0.7);
  background: rgba(107, 52, 176, 0.18);
  color: #E7DFDD;
  font-family: 'Google Sans Code', ui-monospace, monospace;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  &:hover { background: rgba(107, 52, 176, 0.32); }
`;

export const EventPanelHeader = styled.div`
  padding: 0.5rem 0 0 0.5rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const EventPanelContent = styled.div`
  padding: 13px 14px 0;
`;

export const EventPanelTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const EventPanelLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
`;

export const EventIconContainer = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8D0FF5 0%, #A239CA 100%);
`;

export const EventTitle = styled.h3`
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.semibold', 600)};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
`;

export const EventSubtitle = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xs', '0.75rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

/* The children carry their own margins now, so the 1rem flex gap was stacking on
   top of them and making the card far taller than the reference. */
export const EventPanelBody = styled.div`
  padding: 8px 14px 13px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
`;

export const SectionIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const SectionTitle = styled.span`
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
`;

export const SectionContent = styled.div`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xs', '0.75rem')};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.25rem')};
`;

export const SectionRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SectionLabel = styled.span`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const SectionValue = styled.span`
  font-family: monospace;
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  padding-top: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

// Status bar
export const StatusBar = styled.div`
  background-color: #0a0a0f;
  border-top: 1px solid rgba(231, 223, 221, 0.1);
  padding: 9px 20px;

  /* Three wrapped lines of static text on a phone, sitting on top of the sheet's
     actions. None of it is interactive except one link that also lives in the
     nav, so it goes rather than fighting the sheet for space. */
  @media (max-width: 640px) {
    display: none;
  }
`;

export const StatusContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xs', '0.75rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const StatusLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  @media (max-width: 640px) {
    display: none;
  }
`;

export const StatusItem = styled.span``;

export const StatusSeparator = styled.span``;

export const StatusSelected = styled.span`
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
`;

export const StatusRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const ConnectionStatus = styled.span``;

export const StatusDots = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.25rem')};
`;

export const StatusDot = styled.div<{ delay?: string }>`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  animation-delay: ${({ delay }) => delay || '0s'};
  background-color: ${({ theme }) => getThemeValue(theme, 'accent', '#f3f4f6')};

  &:nth-child(2) {
    background-color: ${({ theme }) => getThemeValue(theme, 'primary', '#8D0FF5')};
  }

  &:nth-child(3) {
    background-color: ${({ theme }) => getThemeValue(theme, 'secondary', '#A239CA')};
  }
`;
