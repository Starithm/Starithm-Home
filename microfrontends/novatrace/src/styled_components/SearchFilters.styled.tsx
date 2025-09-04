import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';

export const FiltersContainer = styled.div`
  background-color: ${({ theme }) => getThemeValue(theme, 'background', '#ffffff')};
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  border-radius: 0.5rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const HeaderTitle = styled.span`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};

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
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
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
