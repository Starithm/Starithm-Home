import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';

export const NavWrapper = styled.nav`
  background-color: ${({ theme }) => `${getThemeValue(theme, 'background', '#ffffff')}F2`};
  backdrop-filter: blur(8px);
`;

export const NavInner = styled.div`
  display: flex;
  height: 3.5rem; /* h-14 */
  align-items: center;
  padding-left: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  padding-right: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  position: relative;
`;

export const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

/* Starithm mark, used bare — the violet box this replaced was the same purple as the
   logo's arcs, which would have swallowed them. */
export const BrandLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
`;

export const LogoBox = styled.img`
  width: 2rem; /* w-8 */
  height: 2rem; /* h-8 */
  display: block;
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BrandTitle = styled.span`
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.semibold', 600)};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const BrandSubtitle = styled.span`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xs', '0.75rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const RightActions = styled.div`
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  @media (max-width: 768px) {
    display: none;
  }
`;

export const HamburgerBtn = styled.button`
  display: none;
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  padding: 0.35rem;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  &:hover { background: rgba(119, 15, 245, 0.1); }
  @media (max-width: 768px) {
    display: flex;
  }
`;

export const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
`;

export const DrawerDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0.75rem 0;
`;

export const DrawerSignInRow = styled.div`
  padding: 0 1rem;
`;

