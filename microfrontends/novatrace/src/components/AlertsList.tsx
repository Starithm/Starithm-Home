import React from "react";
import { Alert } from "@shared/types"; 
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import { Clock, MapPin, Zap, Star, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { getTimeAgo } from "../utils/duration";
import { Loading } from "@shared/components";
import { 
  AlertListEventDescriptionContainer, AlertListEventDescriptionMidSize,
  AlertListEventDescriptionSmSize, AlertListHeaderContainer,
  AlertListHeaderDate, AlertListHeaderSubtitle, AlertListHeaderTitle,
  SingleAlertCard, SingleAlertContainer, SingleAlertHeading,
  SingleAlertHeadingText, AlertListContent, AlertListInner, AlertListEmptyState,
  AlertListEmptyIcon, AlertListEmptyTitle, AlertListEmptySubtitle, 
  AlertListDateText, AlertListContainer
} from "../styled_components/AlertList.styled";

interface AlertsListProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  selectedAlert?: Alert;
  isSearchMode: boolean;
  total?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  isLoading?: boolean;
}

const getEventIcon = (eventType: string) => {
  switch (eventType?.toLowerCase()) {
    case 'gamma-ray burst':
    case 'grb':
      return Zap;
    case 'supernova':
    case 'sn':
      return Star;
    default:
      return TrendingUp;
  }
};

export function AlertsList({ 
  alerts, 
  onSelectAlert, 
  selectedAlert, 
  isSearchMode,
  total,
  currentPage = 1,
  onPageChange,
  pageSize = 20,
  isLoading = false
}: AlertsListProps) {
  console.log("alerts", alerts);
  
  const totalPages = total ? Math.ceil(total / pageSize) : 1;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total || alerts.length);

  return (
    <AlertListContainer>
      <AlertListHeaderContainer>
        <AlertListHeaderTitle>{isSearchMode ? "Search Results" : "Recent Alerts"}</AlertListHeaderTitle>
        <AlertListHeaderSubtitle>{isSearchMode && total ? (
            `Showing ${startIndex}-${endIndex} of ${total} alerts`
          ) : (
            `Last ${alerts.length} alerts`
          )}
        </AlertListHeaderSubtitle>
      </AlertListHeaderContainer>
      
      <AlertListContent>  
        <AlertListInner>
          {isLoading ? (
            <Loading title="Loading Alerts" />
          ) : alerts.length === 0 ? (
            <AlertListEmptyState>
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <AlertListEmptyTitle>No alerts available</AlertListEmptyTitle>
              <AlertListEmptySubtitle>Alerts will appear here as they are processed</AlertListEmptySubtitle>
            </AlertListEmptyState>
          ) : (
            alerts.map((alert) => {
              const IconComponent = getEventIcon(alert.data.basic_data.eventType);
              const isSelected = selectedAlert?.id === alert.id;
              
              return (
                <SingleAlertCard
                  key={alert.id}
                  isSelected={isSelected}
                  onClick={() => onSelectAlert(alert)}
                >
                  <CardContent className="p-4">
                    <SingleAlertContainer>
                      <SingleAlertHeading>
                        <IconComponent className="h-4 w-4 text-starithm-electric-violet" />
                        <SingleAlertHeadingText>
                          {alert.alertKey}
                        </SingleAlertHeadingText>
                      </SingleAlertHeading>
                      <Badge variant="outline" className="text-xs">
                        {alert.broker}
                      </Badge>
                    </SingleAlertContainer>
                   < AlertListEventDescriptionContainer> 
                    <AlertListEventDescriptionMidSize>  
                        {alert.event}
                        </AlertListEventDescriptionMidSize>
                      <AlertListEventDescriptionSmSize>
                        {alert.data.basic_data.eventType || 'Unknown Type'}
                      </AlertListEventDescriptionSmSize>
                    </AlertListEventDescriptionContainer>    
                    <AlertListHeaderDate>
                      <Clock className="h-3 w-3" />
                      <AlertListDateText>{getTimeAgo(new Date(alert.date))}</AlertListDateText>
                    </AlertListHeaderDate>
                  </CardContent>
                </SingleAlertCard>
              );
            })
          )}
        </AlertListInner>
      </AlertListContent>

      {/* Pagination Controls */}
      {isSearchMode && total && totalPages > 1 && (
        <div className="p-4 border-t flex-shrink-0">
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
        </div>
      )}
    </AlertListContainer>
  );
}
