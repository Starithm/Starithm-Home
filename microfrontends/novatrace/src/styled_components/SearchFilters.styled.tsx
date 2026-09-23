import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';

export const FiltersContainer = styled.div`
  background-color: ${({ theme }) => getThemeValue(theme, 'background', '#ffffff')};
  padding: var(--space-4);
  border-radius: 0.5rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const HeaderTitle = styled.span`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

export const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);

  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.md', '768px')}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (min-width: ${({ theme }) => getThemeValue(theme, 'breakpoints.lg', '1024px')}) {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

export const IconLeft = styled.div`
  position: absolute;
  left: 0.75rem; /* left-3 */
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  display: flex;
  align-items: center;
  pointer-events: none; /* allow clicks to reach the input */
`;
