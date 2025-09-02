import styled, { css } from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';
import { Card } from '@shared/components/ui/card';


export const AlertListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  backgroundColor: ${({ theme }) => {console.log("AlertListContainer", theme); return getThemeValue(theme, 'background', '#fff')}};
  width: 35%;
`;
export const AlertListHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  flex-shrink: 0;
`;

export const AlertListHeaderTitle = styled.h2`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.5rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.semibold', 600)};
  color: ${({ theme }) => {console.log("AlertListHeaderTitle", theme); return getThemeValue(theme, 'foreground', '#000')}};

`;

export const AlertListHeaderSubtitle = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#666')};
  marginTop: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

{/* <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1"></div> */}

export  const AlertListHeaderDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#666')};
  margin: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};

`;
export const AlertListDateText = styled.span`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#666')};
  marginLeft: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const AlertListEventDescriptionMidSize = styled.p`
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 600)};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#000')};
`;
export const AlertListEventDescriptionSmSize = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#666')};
`;
export const AlertListEventDescriptionContainer = styled.div`
  margin-left: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  display: flex;
  flex-direction: column;
`;

{/* <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-starithm-electric-violet" />
                        <span className="font-medium text-sm text-foreground">
                          {alert.alertKey}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {alert.broker}
                      </Badge>
                    </div> */}
export const SingleAlertContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin: ${({ theme }) => getThemeValue(theme, 'spacing.2', '1rem')};
`;
export const SingleAlertHeading = styled.div`
  display: flex;
    align-items: center;
    
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;
export const SingleAlertHeadingText = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 600)};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#000')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

{/* <Card
                  key={alert.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected 
                      ? "ring-2 ring-starithm-electric-violet bg-starithm-electric-violet/5" 
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => onSelectAlert(alert)}
                ></Card> */}
export const SingleAlertCard = styled(Card)<{ isSelected: boolean }>`
  margin: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.5rem')};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => getThemeValue(theme, 'shadows.md', '0 4px 6px -1px rgba(0, 0, 0, 0.1)')};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  ${({ isSelected, theme }) => isSelected && `
    box-shadow: ${({ theme }) => getThemeValue(theme, 'shadows.lg', '0 4px 6px -1px rgba(0, 0, 0, 0.1)')};
    border: 2px solid ${getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}FF;
    background-color: ${getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}0D;
  `}
  
  ${({ isSelected, theme }) => !isSelected && `
    &:hover {
      background-color: ${getThemeValue(theme, 'muted', '#f3f4f6')}80;
    }
  `}
`;

// Alerts list content area
export const AlertListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  flex-direction: row;
`;

export const AlertListInner = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.1', '1rem')};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.75rem')};
`;

export const AlertListEmptyState = styled.div`
  textAlign: center;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.8', '2rem')} 0;
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const AlertListEmptyIcon = styled.div`
    margin: 0 auto ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  opacity: 0.5;
`;

export const AlertListEmptyTitle = styled.p`
  marginBottom: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.25rem')};
`;

export const AlertListEmptySubtitle = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xs', '0.75rem')};
`;