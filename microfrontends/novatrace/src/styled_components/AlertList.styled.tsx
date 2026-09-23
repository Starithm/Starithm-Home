import styled, { css } from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';
import { Card } from '@shared/components/ui/card';


export const AlertListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  backgroundColor: ${({ theme }) => {return getThemeValue(theme, 'background', '#fff')}};
  width: 35%;
`;
export const AlertListHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  flex-shrink: 0;
`;

export const AlertListHeaderTitle = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: ${({ theme }) => {return getThemeValue(theme, 'foreground', '#000')}};

`;

export const AlertListHeaderSubtitle = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#666')};
  marginTop: var(--space-2);
`;

export  const AlertListHeaderDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#666')};
  margin: var(--space-2);

`;
export const AlertListDateText = styled.span`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#666')};
  marginLeft: var(--space-2);
`;

export const AlertListEventDescriptionMidSize = styled.p`
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#000')};
`;
export const AlertListEventDescriptionSmSize = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#666')};
`;
export const AlertListEventDescriptionContainer = styled.div`
  margin-left: var(--space-2);
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
  margin: var(--space-2);
`;
export const SingleAlertHeading = styled.div`
  display: flex;
    align-items: center;
    
  gap: var(--space-2);
`;
export const SingleAlertHeadingText = styled.p`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#000')};
  margin-bottom: var(--space-2);
`;

export const SingleAlertCard = styled(Card)<{ isSelected: boolean }>`
  margin: var(--space-1);
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
    border: 2px solid ${getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')}FF;
    background-color: ${getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')}0D;
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
  overflow-x: hidden;
  flex-direction: row;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}60 transparent;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}50;
    border-radius: 9999px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}90;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

export const AlertListInner = styled.div`
  padding: var(--space-1);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

export const AlertListEmptyState = styled.div`
  textAlign: center;
  padding: var(--space-8) 0;
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const AlertListEmptyIcon = styled.div`
    margin: 0 auto var(--space-2);
  opacity: 0.5;
`;

export const AlertListEmptyTitle = styled.p`
  marginBottom: var(--space-1);
`;

export const AlertListEmptySubtitle = styled.p`
  font-size: var(--font-size-xs);
`;

{/* <div className="p-4 border-t flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div> */}
export const AlertListPaginationWrapper = styled.div`
  padding: var(--space-4);
  border-top: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  flex-shrink: 0;
`;
export const AlertListPaginationSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    font-size: var(--font-size-sm);
    color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
    justify-content: flex-start;
  }
`;
export const AlertListPaginationText = styled.p`
  font-size: var(--font-size-xs);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  justify-content: flex-start;
`;
export const AlertListPaginationNavSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
`;

export const AlertListPaginationNavSectionSeparator = styled.span`
  width: 1px;
  height: 24px;
  background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')};
  margin: 0 8px;
  vertical-align: middle;
`;