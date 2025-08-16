import React from "react";
import { Alert, TimelineItem } from "@/types/Alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, FileText, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { AlertDetails } from "./AlertDetails";


interface AlertModalProps {
  alert?: Alert;
  isOpen: boolean;
  onClose: () => void;
  onOpenRawDataModal: (alert: Alert) => void;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }).format(new Date(date));
};

const getTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInHours > 0) {
    return `${diffInHours}h ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}m ago`;
  } else {
    return '< 1h ago';
  }
};

export function AlertModal({ alert, isOpen, onClose, onOpenRawDataModal }: AlertModalProps) {
  const [selectedTimelineAlertId, setSelectedTimelineAlertId] = useState<string | undefined>();
  const [alertDataMap, setAlertDataMap] = useState<Map<string, Alert>>(new Map());

  // Set initial alert ID when alert changes
  useEffect(() => {
    if (alert?.id) {
      setSelectedTimelineAlertId(alert.id.toString());
    }
  }, [alert?.id]);

  // Fetch detailed alert data for the selected timeline alert
  const { data: detailedAlert, isLoading } = useQuery({
    queryKey: ['alert-details', selectedTimelineAlertId],
    queryFn: async () => {
      if (!selectedTimelineAlertId) return null;
      const response = await fetch(API_ENDPOINTS.alertDetails(selectedTimelineAlertId));
      if (!response.ok) {
        throw new Error('Failed to fetch alert details');
      }
      return response.json();
    },
    enabled: !!selectedTimelineAlertId,
  });

  // Update alert data map when new data is fetched
  useEffect(() => {
    if (detailedAlert && selectedTimelineAlertId) {
      setAlertDataMap(prev => {
        const newMap = new Map(prev);
        newMap.set(selectedTimelineAlertId, detailedAlert);
        return newMap;
      });
    }
  }, [detailedAlert, selectedTimelineAlertId]);

  // Get the current selected alert from the map or use the detailed alert
  const selectedTimelineAlert = selectedTimelineAlertId ? 
    (alertDataMap.get(selectedTimelineAlertId) || detailedAlert) : 
    alert;

  const timeline: TimelineItem[] = alert?.timeline || [];

  if (!alert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose} showCloseButton={false}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden" showCloseButton={false}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Alert Details - {alert.event}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Timeline on Left */}
          <div className="w-1/3 border-r border-gray-200">
            <Card className="h-full rounded-none border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Alert Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="relative p-4">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-4">
                      {timeline.length > 0 ? (
                        timeline.map((timelineItem, index) => (
                          <div key={index} className="relative flex items-start">
                            <div className={`absolute left-3 w-3 h-3 rounded-full border-2 border-white ${
                              timelineItem.current ? 'bg-starithm-electric-violet' : 'bg-gray-300'
                            }`}></div>
                            <div
                              className={`ml-8 flex-1 bg-gray-50 rounded-lg p-3 transition-colors cursor-pointer hover:bg-gray-100 ${
                                selectedTimelineAlert?.alertKey === timelineItem.alertKey ? 'bg-starithm-electric-violet/5 border border-starithm-electric-violet' : ''
                              }`}
                              onClick={() => {
                                console.log("Clicked timeline item:", timelineItem.alertKey, "ID:", timelineItem.id);
                                setSelectedTimelineAlertId(timelineItem.id.toString());
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {timelineItem.alertKey}
                                </Badge>
                                {timelineItem.current && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    CURRENT
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                                {timelineItem.summary}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(new Date(timelineItem.date))}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getTimeAgo(new Date(timelineItem.date))}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground ml-8">No timeline data available</div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* AlertDetails on Right */}
          <div className="w-2/3">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <AlertDetails
              selectedAlert={selectedTimelineAlert}
              onOpenRawData={onOpenRawDataModal}
              showTimeline={false}
            />
          </ScrollArea>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
