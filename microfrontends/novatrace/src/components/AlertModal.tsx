import React from "react";
import { Alert, TimelineItem } from "@shared/types";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Badge } from "@shared/components/ui/badge";

import { X, FileText, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@shared/lib/config";
import { AlertDetails } from "./AlertDetails";
import { getTimeAgo } from "../utils/duration";


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


export function AlertModal({ alert, isOpen, onClose, onOpenRawDataModal }: AlertModalProps) {
  const [selectedTimelineAlertId, setSelectedTimelineAlertId] = useState<string | undefined>();
  const [alertDataMap, setAlertDataMap] = useState<Map<string, Alert>>(new Map());

  console.log("AlertModal render - isOpen:", isOpen, "alert:", alert?.alertKey);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[9998] bg-background/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-[50%] left-[50%] z-[9999] w-full max-w-7xl h-[90vh] bg-background text-foreground border border-border rounded-lg p-6 transform -translate-x-1/2 -translate-y-1/2 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span className="text-lg font-semibold">Alert Details - {alert.event}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            View detailed information and timeline for alert {alert.alertKey}
          </p>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Timeline on Left */}
          <div className="w-1/3 border-r border-border flex flex-col min-h-0">
            <Card className="h-full rounded-none border-0 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Alert Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-600 scrollbar-thumb-transparent">
                <div className="relative p-4">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                  <div className="space-y-4">
                    {timeline.length > 0 ? (
                      timeline.map((timelineItem, index) => (
                        <div key={index} className="relative flex items-start">
                          <div className={`absolute left-3 w-3 h-3 rounded-full border-2 border-white ${
                            timelineItem.current ? 'bg-primary' : 'bg-muted'
                          }`}></div>
                          <div
                            className={`ml-8 flex-1 bg-muted/50 rounded-lg p-3 transition-colors cursor-pointer hover:bg-muted ${
                              selectedTimelineAlert?.alertKey === timelineItem.alertKey ? 'bg-primary/5 border border-primary' : ''
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
                                <Badge variant="secondary" className="text-xs">
                                  SELECTED
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-foreground mb-2 line-clamp-2">
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
              </CardContent>
            </Card>
          </div>

          {/* AlertDetails on Right */}
          <div className="w-2/3 flex flex-col min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-600 scrollbar-thumb-transparent">
            <AlertDetails
              selectedAlert={selectedTimelineAlert}
              onOpenRawData={onOpenRawDataModal}
              showTimeline={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
