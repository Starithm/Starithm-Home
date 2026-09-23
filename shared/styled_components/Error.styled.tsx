import styled from 'styled-components';
import { getThemeValue } from '../utils/themeUtils';

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: var(--space-8);
  text-align: center;
  margin-bottom: var(--space-5);
`;

export const ErrorIconCircle = styled.div`
  width: 5rem; /* 20 */
  height: 5rem;
  background-color: rgba(248, 113, 113, 0); /* red-400/15 */
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-6);
`;

export const ErrorTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: ${p => getThemeValue(p.theme, 'fontWeight.semibold', 600)};
  color: ${p => getThemeValue(p.theme, 'foreground', '#0E0B16')};
  margin-bottom: var(--space-3);
`;

export const ErrorMessage = styled.p`
  color: ${p => getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
  margin-bottom: var(--space-6);
  max-width: 28rem; /* md */
`;

export const ErrorTip = styled.div`
  font-size: var(--font-size-sm);
  color: ${p => getThemeValue(p.theme, 'mutedForeground', '#6b7280')};
  margin-bottom: var(--space-6);
`;

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: ${p => `${getThemeValue(p.theme, 'spacing.2', '0.5rem')} ${getThemeValue(p.theme, 'spacing.4', '1rem')}`};
  background-color: ${p => getThemeValue(p.theme, 'starithmElectricVioletDark', '#9A48FF')};
  color: white;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-normal);
  &:hover { background-color: ${p => `${getThemeValue(p.theme, 'starithmElectricVioletDark', '#9A48FF')}E6`}; }
`;

export const ErrorCompactContainer = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-4);
  background-color: rgba(243, 146, 146, 0.1); /* red-400/10 */
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 0.5rem;
`;

export const ErrorCompactIcon = styled.div`
  margin-right: var(--space-3);
  color: #dc2626; /* red-600 */
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

export const ErrorCompactTitle = styled.h4`
  font-size: var(--font-size-xs);
  font-weight: ${p => getThemeValue(p.theme, 'fontWeight.medium', 500)};
  color: ${p => getThemeValue(p.theme, 'foreground', '#0E0B16')};
  margin-bottom: var(--space-1);
`;

export const ErrorCompactHelp = styled.p`
  font-size: var(--font-size-xs);
  color: ${p => getThemeValue(p.theme, 'foreground', '#0E0B16')};
`;

export const RetryButtonCompact = styled.button`
  margin-left: var(--space-3);
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: ${p => `${getThemeValue(p.theme, 'spacing.1', '0.25rem')} ${getThemeValue(p.theme, 'spacing.3', '0.75rem')}`};
  background-color: ${p => getThemeValue(p.theme, 'starithmElectricVioletDark', '#9A48FF')};
  color: white;
  font-size: var(--font-size-xs);
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-normal);
  &:hover { background-color: ${p => getThemeValue(p.theme, 'starithmVeronica', '#9A48FF')}E6; }
`;

