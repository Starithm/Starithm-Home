import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';
import { Card, CardContent } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';

export const SectionCard = styled(Card)``;
export const SectionContent = styled(CardContent)`
  padding: ${props => getThemeValue(props.theme, 'spacing.6', '1.5rem')};
`;

export const SectionTitle = styled.h3`
  font-size: ${props => getThemeValue(props.theme, 'fontSize.lg', '1.125rem')};
  font-weight: ${props => getThemeValue(props.theme, 'fontWeight.semibold', 600)};
  color: ${props => getThemeValue(props.theme, 'foreground', '#0E0B16')};
  margin-bottom: ${props => getThemeValue(props.theme, 'spacing.4', '1rem')};
`;

export const HealthList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => getThemeValue(props.theme, 'spacing.4', '1rem')};
`;

export const HealthRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HealthLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => getThemeValue(props.theme, 'spacing.3', '0.75rem')};
`;

export const HealthLabel = styled.span`
  font-size: ${props => getThemeValue(props.theme, 'fontSize.sm', '0.875rem')};
  color: ${props => getThemeValue(props.theme, 'mutedForeground', '#6b7280')};
  text-transform: capitalize;
`;

export const StatusBadge = styled(Badge)<{ bg: string; color: string }>`
  font-size: ${props => getThemeValue(props.theme, 'fontSize.xs', '0.75rem')};
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background-color: ${({ bg }) => bg};
  color: ${({ color }) => color};
`;

export const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => getThemeValue(props.theme, 'spacing.3', '0.75rem')};
`;

export const StepRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => getThemeValue(props.theme, 'spacing.3', '0.75rem')};
`;

export const StepText = styled.div`
  flex: 1;
`;

export const StepTitle = styled.p`
  font-size: ${props => getThemeValue(props.theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${props => getThemeValue(props.theme, 'fontWeight.medium', 500)};
  color: ${props => getThemeValue(props.theme, 'foreground', '#0E0B16')};
`;

export const StepSub = styled.p`
  font-size: ${props => getThemeValue(props.theme, 'fontSize.xs', '0.75rem')};
  color: ${props => getThemeValue(props.theme, 'mutedForeground', '#6b7280')};
`;

export const StatusDot = styled.div<{ bg: string }>`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ bg }) => bg};
  color: white;
`;

