import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/types/Alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_ENDPOINTS } from "@/lib/config";
import {
  Clock,
  MapPin,
  Zap,
  Star,
  TrendingUp,
  FileText,
  ExternalLink,
  Users,
  Telescope,
  BarChart3,
  Calendar
} from "lucide-react";

interface AlertDetailsProps {
  selectedAlert?: Alert;
  showTimeline?: boolean;
  onOpenRawData: (alert: Alert) => void;
  onOpenAlertModal?: (alert: Alert) => void;
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

export function AlertDetails({ selectedAlert, onOpenRawData, showTimeline = true, onOpenAlertModal }: AlertDetailsProps) {
  if (!selectedAlert) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Alert Selected</h3>
          <p className="text-sm">Select an alert from the list to view details</p>
        </div>
      </div>
    );
  }

  // Fetch detailed alert information
  const { data: detailedAlert, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['alert-details', selectedAlert.id],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.alertDetails(selectedAlert.id.toString()));
      if (!response.ok) {
        throw new Error('Failed to fetch alert details');
      }
      return response.json();
    },
    enabled: !!selectedAlert.id,
  });

  // Use detailed alert data if available, otherwise fall back to selectedAlert
  const alertData = detailedAlert || selectedAlert;
  
  const IconComponent = getEventIcon(alertData.data.basic_data.eventType);
  const measurements = alertData.data.measurements;
  const authors = alertData.data.authors;
  const telescopes = alertData.data.telescopes;
  const timeline = alertData.timeline || [];

  return (
    <div className="flex-1 p-6">
      <ScrollArea className="h-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className="h-8 w-8 text-starithm-electric-violet" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {alertData.event}
                </h1>
                <p className="text-muted-foreground">
                  {alertData.alertKey} • {alertData.broker}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isLoadingDetails && (
                <Badge variant="secondary" className="text-xs">
                  Loading...
                </Badge>
              )}
              <Badge variant="outline">
                {(alertData.confidenceLevel * 100).toFixed(0)}% Confidence
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenRawData(alertData)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Raw Data
              </Button>
            </div>
          </div>
           {/* Event Information Section */}
           <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Event Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Detection Time</label>
                  <p className="text-sm">{formatDate(alertData.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Event Type</label>
                  <p className="text-sm">{alertData.data.basic_data.eventType || 'Unknown'}</p>
                </div>
              </div>
              {/* {alertData.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alertData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )} */}
            </CardContent>
          </Card>
          {/* Summary Section */}
          {alertData.summary && (
            <Card className="border-2 border-[#ffc332] bg-gradient-to-r from-starithm-electric-violet/5 via-starithm-veronica/5 to-[#FFFDF9]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{alertData.summary}</p>
                <p className="text-xs text-muted-foreground text-right italic mt-2">
                  This is an AI generated summary, it may be incorrect. Please verify information with original sources.
                </p>
              </CardContent>
            </Card>
          )}

         
          {timeline.length > 0 && showTimeline &&(
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Alert Timeline for {alertData.event}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Vertical Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-4">
                    {timeline.length > 0 ? (
                      timeline.map((timelineItem, index) => (
                        <div key={index} className="relative flex items-start">
                          {/* Timeline Dot */}
                          <div className={`absolute left-3 w-3 h-3 rounded-full border-2 border-white ${
                            timelineItem.current 
                              ? 'bg-starithm-electric-violet' 
                              : 'bg-gray-300'
                          }`}></div>
                          
                          {/* Alert Card */}
                          <div 
                            className="ml-8 flex-1 bg-gray-50 rounded-lg p-3 transition-colors cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              if (onOpenAlertModal) {
                                // Open AlertModal with the timeline alert
                                onOpenAlertModal({
                                  ...alertData,
                                  alertKey: timelineItem.alertKey,
                                  date: new Date(timelineItem.date),
                                  summary: timelineItem.summary
                                });
                              }
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs border-starithm-electric-violet text-starithm-electric-violet">
                                  {timelineItem.alertKey}
                                </Badge>
                                {timelineItem.current && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    CURRENT
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  timelineItem.current ? 'bg-green-500' : 'bg-orange-500'
                                }`}></div>
                                <span className="text-xs text-muted-foreground">
                                  {timelineItem.current ? '94%' : '76%'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {getTimeAgo(new Date(timelineItem.date))}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-700 mb-2">
                              {timelineItem.summary}
                            </p>
                            
                            <p className="text-xs text-muted-foreground">
                              {formatDate(new Date(timelineItem.date))}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground ml-8">
                        No timeline data available for this event
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Measurements Section */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Astronomical Measurements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(measurements).length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                    {
                        Object.keys(measurements).map((key) => {
                            const value = measurements[key as keyof typeof measurements];
                            if (value === null || value === undefined) {
                                return null;
                            }
                            if (typeof value === 'object') {
                                return Object.keys(value).map((vKey) => (
                                    <div key={vKey}>
                                        <label className="text-sm font-medium text-muted-foreground">{vKey.replaceAll('_', ' ')}</label>
                                        <p className="text-sm">{JSON.stringify(value[vKey]).replaceAll('"', '')}</p>
                                    </div>
                                ))
                            } 
                            if (Array.isArray(value) && value[0] !== 'object') {
                                return (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">{key.replaceAll('_', ' ')}</label>
                                        <p className="text-sm">{value.join(', ').replaceAll('"', '')}</p>
                                    </div>
                                )
                            }
                            if (Array.isArray(value) && value[0] === 'object') {
                                return value.map(v => {
                                    return Object.keys(v).map((vKey) => (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">{key.replaceAll('_', ' ')}</label>
                                        <p className="text-sm">{JSON.stringify(v[vKey]).replaceAll('"', '')}</p>
                                    </div>
                                    ))
                                })
                                
                            }
                            return (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{key.replaceAll('_', ' ')}</label>
                                    <p className="text-sm">{String(measurements[key as keyof typeof measurements])}</p>
                                </div>
                            )
                        }).flat()
                    }
                  {/* {measurements.redshift && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Redshift</label>
                      <p className="text-sm">{String(measurements.redshift)}</p>
                    </div>
                  )}
                  {measurements.distance && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Distance</label>
                      <p className="text-sm">{String(measurements.distance)}</p>
                    </div>
                  )}
                  {measurements.magnitude && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Magnitude</label>
                      <p className="text-sm">{String(measurements.magnitude)}</p>
                    </div>
                  )}
                  {measurements.duration && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Duration</label>
                      <p className="text-sm">{String(measurements.duration)}</p>
                    </div>
                  )}
                  {measurements.fluence && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fluence</label>
                      <p className="text-sm">{String(measurements.fluence)}</p>
                    </div>
                  )}
                  {measurements.energy && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Energy</label>
                      <p className="text-sm">{String(measurements.energy)}</p>
                    </div>
                  )} */}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No measurements detected in alert</p>
              )}
            </CardContent>
          </Card>

          {/* Participants Section */}
          {authors.authors.length > 0 || authors.institutions.length > 0 && (
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Participants</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  {authors.authors && authors.authors.length > 0 && (
                    <div className="mb-3">
                      <label className="text-sm font-medium text-muted-foreground">Authors</label>
                      <div className="text-sm mt-1">
                        {authors.authors.slice(0, 5).join(', ')}
                        {authors.authors.length > 5 && ` +${authors.authors.length - 5} more`}
                      </div>
                    </div>
                  )}
                  {authors.institutions && authors.institutions.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Institutions</label>
                      <div className="text-sm mt-1">
                        {authors.institutions.slice(0, 3).join(', ')}
                        {authors.institutions.length > 3 && ` +${authors.institutions.length - 3} more`}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {telescopes.telescopes && telescopes.telescopes.length > 0 && (
                    <div className="mb-3">
                      <label className="text-sm font-medium text-muted-foreground">Telescopes</label>
                      <div className="text-sm mt-1">
                        {telescopes.telescopes.slice(0, 3).join(', ')}
                        {telescopes.telescopes.length > 3 && ` +${telescopes.telescopes.length - 3} more`}
                      </div>
                    </div>
                  )}
                  {telescopes.observatories && telescopes.observatories.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Observatories</label>
                      <div className="text-sm mt-1">
                        {telescopes.observatories.slice(0, 3).join(', ')}
                        {telescopes.observatories.length > 3 && ` +${telescopes.observatories.length - 3} more`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>)}

          
        </div>
      </ScrollArea>
    </div>
  );
}
