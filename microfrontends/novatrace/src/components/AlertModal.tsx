import React from "react";
import { Alert, TimelineItem } from "@shared/types";
import { Button } from "@shared/components/ui/button";
import { CardTitle } from "@shared/components/ui/card";
import { Badge } from "@shared/components/ui/badge";

import { X, FileText, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@shared/lib/config";
import { AlertDetails } from "./AlertDetails";
import { getTimeAgo } from "../utils/duration";
import {
  Overlay,
  ModalContainer,
  HeaderContainer,
  HeaderRow,
  TitleGroup,
  Subtitle,
  ContentWrapper,
  LeftPanel,
  TimelineCard,
  TimelineHeader,
  TimelineContent,
  TimelineInner,
  TimelineLine,
  TimelineList,
  TimelineItemRow,
  TimelineDot,
  TimelineEntry,
  TimelineEmpty,
  RightPanel,
} from "../styled_components/AlertModal.styled";


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

  // console.log("AlertModal render - isOpen:", isOpen, "alert:", alert?.alertKey);

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
      <Overlay onClick={onClose} />
      <ModalContainer>
        <HeaderContainer>
          <HeaderRow>
            <TitleGroup>
              <FileText size={20} />
              <span>Alert Details - {alert.event}</span>
            </TitleGroup>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </HeaderRow>
          <Subtitle>
            View detailed information and timeline for alert {alert.alertKey}
          </Subtitle>
        </HeaderContainer>
        <ContentWrapper>
          <LeftPanel>
            <TimelineCard>
              <TimelineHeader>
                <CardTitle>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={20} />
                    Alert Timeline
                  </span>
                </CardTitle>
              </TimelineHeader>
              <TimelineContent>
                <TimelineInner>
                  <TimelineLine />
                  <TimelineList>
                    {timeline.length > 0 ? (
                      timeline.map((timelineItem, index) => (
                        <TimelineItemRow key={index}>
                          <TimelineDot isCurrent={!!timelineItem.current} />
                          <TimelineEntry
                            selected={selectedTimelineAlert?.alertKey === timelineItem.alertKey}
                            onClick={() => {
                              setSelectedTimelineAlertId(timelineItem.id.toString());
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <Badge variant="outline" style={{ fontSize: '0.75rem' }}>
                                {timelineItem.alertKey}
                              </Badge>
                              {timelineItem.current && (
                                <Badge variant="secondary" style={{ fontSize: '0.75rem' }}>
                                  SELECTED
                                </Badge>
                              )}
                            </div>
                            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                              {timelineItem.summary}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                {formatDate(new Date(timelineItem.date))}
                              </p>
                              <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                {getTimeAgo(new Date(timelineItem.date))}
                              </p>
                            </div>
                          </TimelineEntry>
                        </TimelineItemRow>
                      ))
                    ) : (
                      <TimelineEmpty>No timeline data available</TimelineEmpty>
                    )}
                  </TimelineList>
                </TimelineInner>
              </TimelineContent>
            </TimelineCard>
          </LeftPanel>
          <RightPanel>
            <AlertDetails
              selectedAlert={selectedTimelineAlert}
              onOpenRawData={onOpenRawDataModal}
              showTimeline={false}
            />
          </RightPanel>
        </ContentWrapper>
      </ModalContainer>
    </>
  );
}
