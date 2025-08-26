import React from "react";
import { Alert } from "@/types/Alert";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import { ScrollArea } from "@shared/components/ui/scroll-area";
import { Clock, MapPin, Zap, Star, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { getTimeAgo } from "../utils/duration";
import { Loading } from "@shared/components";

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
    <div className="w-1/3 bg-muted/30 flex flex-col h-full">
      <div className="p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground">{isSearchMode ? "Search Results" : "Recent Alerts"}</h2>
        <p className="text-sm text-muted-foreground">
          {isSearchMode && total ? (
            `Showing ${startIndex}-${endIndex} of ${total} alerts`
          ) : (
            `Last ${alerts.length} alerts`
          )}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {isLoading ? (
            <Loading title="Loading Alerts" className="py-8" />
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No alerts available</p>
              <p className="text-xs">Alerts will appear here as they are processed</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const IconComponent = getEventIcon(alert.data.basic_data.eventType);
              const isSelected = selectedAlert?.id === alert.id;
              
              return (
                <Card
                  key={alert.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected 
                      ? "ring-2 ring-starithm-electric-violet bg-starithm-electric-violet/5" 
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => onSelectAlert(alert)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-starithm-electric-violet" />
                        <span className="font-medium text-sm text-foreground">
                          {alert.alertKey}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {alert.broker}
                      </Badge>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {alert.event}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.data.basic_data.eventType || 'Unknown Type'}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{getTimeAgo(new Date(alert.date))}</span>
                        </div>
                      </div>
                      
                    </div>
                    
                    {/* {alert.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {alert.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {alert.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{alert.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )} */}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

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
    </div>
  );
}
