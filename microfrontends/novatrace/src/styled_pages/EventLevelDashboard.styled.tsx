import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';

// Main container
export const EventLevelContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${({ theme }) => getThemeValue(theme, 'background', 'white')} 0%, 
    ${({ theme }) => getThemeValue(theme, 'background', 'white')} 50%, 
    ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}1A 100%
  );
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  user-select: none;
`;

// Header section
export const Header = styled.div`
  background-color: ${({ theme }) => getThemeValue(theme, 'card', 'white')}CC;
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 200;
  overflow: visible;
`;

export const HeaderContent = styled.div`
  padding: 0.3rem ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  @media (max-width: 640px) {
    padding: 0.3rem 0.75rem;
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
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
  background: linear-gradient(135deg, #770ff5 0%, #A239CA 100%);
  box-shadow: 0 8px 32px rgba(119, 15, 245, 0.3);
`;

export const LogoText = styled.span`
  color: white;
  font-weight: bold;
  font-size: 1.125rem;
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
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const EventCount = styled.div`
  text-align: right;
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
export const SearchSection = styled.div`
  padding: 0.5rem 1.5rem 0;
  z-index: 9999;
  overflow: visible;
  @media (max-width: 640px) {
    padding: 0.5rem 0.75rem 0;
  }
`;

export const SearchBarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
`;

export const SearchBarInput = styled.input`
  width: 100%;
  background: ${({ theme }) => getThemeValue(theme, 'background', '#0e0b16')};
  border: 1px solid #770ff5;
  border-radius: 0.875rem;
  padding: 0.6rem 3rem 0.6rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#e7dfdd')};
  outline: none;
  transition: border-color 0.15s;
  &::placeholder { color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')}; }
  &:focus { border-color: #a239ca; box-shadow: 0 0 0 2px rgba(119,15,245,0.2); }
`;

export const SearchBarSendButton = styled.button`
  position: absolute;
  right: 0.4rem;
  @keyframes spin { to { transform: rotate(360deg); } }
  background: #770ff5;
  border: none;
  border-radius: 0.5rem;
  width: 2rem;
  height: 2rem;
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
  border: 1px solid ${({ $active }) => $active ? 'transparent' : 'var(--border)'};
  background: ${({ $active }) => $active ? '#770ff5' : 'var(--card)'};
  color: ${({ $active }) => $active ? 'white' : 'var(--foreground)'};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  line-height: 1.4;
  &:hover { border-color: #770ff5; }
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
  background: ${({ $selected }) => $selected ? 'rgba(119, 15, 245, 0.15)' : 'transparent'};
  color: ${({ $selected }) => $selected ? '#770ff5' : 'var(--foreground)'};
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
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  @media (max-width: 640px) {
    height: 200px;
    flex-shrink: 0;
    padding: 0.5rem;
  }
`;

// Floating event panel
export const FloatingEventPanel = styled.div`
  position: absolute;
  top: 0;
  left: 1.5rem;
  bottom: 0;
  z-index: 50;
  pointer-events: all;
  display: flex;
  align-items: flex-start;
  padding: 1rem 0;
  overflow-y: auto;
  @media (max-width: 640px) {
    position: static;
    overflow-y: visible;
    padding: 0.75rem;
    flex: 1;
    align-items: stretch;
  }
`;

export const EventPanel = styled.div`
  width: 24rem;
  background-color: ${({ theme }) => getThemeValue(theme, 'card', 'white')}F2;
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')}80;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
  @media (max-width: 640px) {
    width: 100%;
    border-radius: 0.75rem;
    box-shadow: none;
  }
`;

export const EventPanelHeader = styled.div`
  padding: 0.5rem 0 0 0.5rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const EventPanelContent = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const EventPanelTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const EventPanelLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
`;

export const EventIconContainer = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #770ff5 0%, #A239CA 100%);
`;

export const EventTitle = styled.h3`
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.semibold', 600)};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
`;

export const EventSubtitle = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xs', '0.75rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const EventPanelBody = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
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
  background-color: ${({ theme }) => getThemeValue(theme, 'card', 'white')}99;
  backdrop-filter: blur(20px);
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')} ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
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
    background-color: ${({ theme }) => getThemeValue(theme, 'primary', '#770ff5')};
  }

  &:nth-child(3) {
    background-color: ${({ theme }) => getThemeValue(theme, 'secondary', '#A239CA')};
  }
`;
