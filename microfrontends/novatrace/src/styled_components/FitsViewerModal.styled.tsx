import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';
import { DialogContent, DialogHeader, DialogTitle } from '@shared/components/ui/dialog';

export const StyledDialogContent = styled(DialogContent)`
  max-width: 72rem; /* max-w-6xl */
  max-height: 90vh;
  padding: 0;
`;

export const StyledDialogHeader = styled(DialogHeader)`
  padding: ${props => getThemeValue(props.theme, 'spacing.4', '1rem')};
  border-bottom: 1px solid ${props => getThemeValue(props.theme, 'border', '#e5e7eb')};
  background-color: ${props => getThemeValue(props.theme, 'muted', '#f3f4f6')};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  align-items: center;
  gap: ${props => getThemeValue(props.theme, 'spacing.2', '0.5rem')};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => getThemeValue(props.theme, 'spacing.2', '0.5rem')};
`;

export const Body = styled.div`
  padding: ${props => getThemeValue(props.theme, 'spacing.6', '1.5rem')};
  background-color: ${props => getThemeValue(props.theme, 'card', '#ffffff')};
`;

export const CenteredSection = styled.div`
  text-align: center;
  padding: ${props => getThemeValue(props.theme, 'spacing.8', '2rem')};
  max-width: 28rem; /* max-w-md */
  margin: 0 auto;
`;

export const RoundIcon = styled.div<{ bg?: string }>`
  width: 4rem; /* w-16 */
  height: 4rem; /* h-16 */
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => getThemeValue(props.theme, 'spacing.4', '1rem')};
  background-color: ${({ bg }) => bg || '#f3f4f6'};
`;

export const Heading = styled.h3`
  font-size: ${props => getThemeValue(props.theme, 'fontSize.lg', '1.125rem')};
  font-weight: ${props => getThemeValue(props.theme, 'fontWeight.semibold', 600)};
  color: ${props => getThemeValue(props.theme, 'foreground', '#0E0B16')};
  margin-bottom: ${props => getThemeValue(props.theme, 'spacing.2', '0.5rem')};
`;

export const SubText = styled.p`
  color: ${props => getThemeValue(props.theme, 'mutedForeground', '#6b7280')};
  margin-bottom: ${props => getThemeValue(props.theme, 'spacing.6', '1.5rem')};
`;

export const VerticalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => getThemeValue(props.theme, 'spacing.3', '0.75rem')};
`;

export const JS9Outer = styled.div`
  width: 100%;
`;

export const JS9Panel = styled.div`
  background-color: #000;
  padding: ${props => getThemeValue(props.theme, 'spacing.4', '1rem')};
  border-radius: 0.5rem;
`;

export const JS9Container = styled.div`
  border: 1px solid ${props => getThemeValue(props.theme, 'border', '#4b5563')};
  border-radius: 0.5rem;
  overflow: hidden;
  width: 600px;
  height: 600px;
`;

export const JS9HelperText = styled.div`
  margin-top: ${props => getThemeValue(props.theme, 'spacing.4', '1rem')};
  color: #fff;
  text-align: center;
  font-size: ${props => getThemeValue(props.theme, 'fontSize.sm', '0.875rem')};
  opacity: 0.95;
`;

export const JS9HelperSub = styled.p`
  color: #9ca3af; /* gray-400 */
  font-size: ${props => getThemeValue(props.theme, 'fontSize.xs', '0.75rem')};
  margin-top: ${props => getThemeValue(props.theme, 'spacing.1', '0.25rem')};
`;

