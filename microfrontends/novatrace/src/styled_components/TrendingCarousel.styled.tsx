import styled, { keyframes } from "styled-components";
import { getThemeValue } from "@shared/utils/themeUtils";
import { Button } from "@shared/components/ui/button";

const borderFlow = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

export const CarouselContainer = styled.div`
  position: relative;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: ${({ theme }) => getThemeValue(theme, "shadows.lg", "0 10px 15px -3px rgba(0,0,0,0.1)")};
  height: 11rem; /* h-44 */
  padding: 2px; /* p-[2px] */
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 2px; /* border thickness */
    border-radius: 0.5rem; /* match rounded-lg */
    background: linear-gradient(90deg, #ffc332, #8D0FF5, #6B46C1, #ffc332);
    background-size: 200% 100%;
    animation: ${borderFlow} 3s linear infinite;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: 0;
  }
`;

export const CarouselInner = styled.div`
  position: relative;
  height: 100%;
  border-radius: 0.5rem;
  padding: var(--space-4);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  /* bg-gradient-to-r from-violet/10 via-veronica/10 to (light:white | dark:gray-800) */
  background-image: ${({ theme }) => {
    const violet = getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5');
    const veronica = getThemeValue(theme, 'starithmVeronica', '#A239CA');
    const name = getThemeValue(theme, 'name', 'light');
    const toColor = name === 'dark' ? '#1f2937' : '#ffffff'; /* gray-800 or white */
    return `linear-gradient(90deg, ${violet}1A, ${veronica}1A, ${toColor})`;
  }};
`;

export const Header = styled.div`
  margin-bottom: var(--space-3);
`;

export const HeaderTitle = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: ${({ theme }) => getThemeValue(theme, "foreground", "#0E0B16")};
`;

export const ClickableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 0.5rem;
  padding: var(--space-2);
  transition: background-color var(--transition-normal);

  &:hover {
    background-color: ${({ theme }) => {
      const name = getThemeValue(theme, 'name', 'light');
      return name === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(255,255,255,0.2)';
    }};
  }
`;

export const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

export const IconWrap = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')};
  display: flex;
  align-items: center;
`;

export const EventTitle = styled.h3`
  font-weight: var(--font-weight-semibold);
  color: ${({ theme }) => getThemeValue(theme, "foreground", "#0E0B16")};
`;

export const EventSubtitle = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, "mutedForeground", "#686868")};
`;

export const RowRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
`;

export const CountWrap = styled.div`
  text-align: right;
`;

export const CountLine = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--font-weight-medium);
  color: ${({ theme }) => getThemeValue(theme, "foreground", "#0E0B16")};
`;

export const CountNumber = styled.span`
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')};
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-2xl);
`;

export const CountLabel = styled.span`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const TimeText = styled.div`
  font-size: var(--font-size-xs);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const NavButtonLeft = styled.div`
  position: absolute;
  top: 50%;
  left: 0.5rem;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity var(--transition-normal);

  ${CarouselContainer}:hover & {
    opacity: 1;
  }
`;

export const NavButtonRight = styled(NavButtonLeft)`
  left: auto;
  right: 0.5rem;
`;

export const SmallIconButton = styled(Button)`
  height: 2rem; /* h-8 */
  width: 2rem;  /* w-8 */
  padding: 0;
`;

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--space-6);
  gap: 0.25rem;
`;

export const Dot = styled.div<{ active?: boolean }>`
  height: 0.25rem; /* h-1 */
  width: 2rem;    /* w-8 */
  border-radius: 9999px;
  transition: background-color var(--transition-normal);
  background-color: ${({ active, theme }) =>
    active
      ? getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')
      : getThemeValue(theme, 'muted', '#f3f4f6')};
`;

export const CenteredState = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;
