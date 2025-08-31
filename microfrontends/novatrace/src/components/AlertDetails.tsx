import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/types/Alert";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";

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
  Calendar,
  Link
} from "lucide-react";
import { getTimeAgo } from "../utils/duration";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";
import { Image, Maximize2, Telescope as TelescopeIcon } from "lucide-react";
import { Loading, ErrorComponentCompact } from "@shared/components";
import { FitsViewerModal } from "./FitsViewerModal";

interface AlertDetailsProps {
  selectedAlert?: Alert;
  showTimeline?: boolean;
  onOpenRawData?: (alert: Alert) => void;
  onOpenAlertModal?: (alert: Alert) => void;
  js9Loaded?: boolean;
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


export function AlertDetails({ selectedAlert, onOpenRawData, showTimeline = true, onOpenAlertModal, js9Loaded = false }: AlertDetailsProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isFitsModalOpen, setIsFitsModalOpen] = useState(false);
  const [selectedFitsUrl, setSelectedFitsUrl] = useState<string>('');
  const [apiError, setApiError] = useState<any>(null);

  // Fetch detailed alert information
  const { data: detailedAlert, isLoading: isLoadingDetails, error: detailsError } = useQuery({
    queryKey: ['alert-details', selectedAlert?.id],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.alertDetails(selectedAlert!.id.toString()));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!selectedAlert?.id,
  });

  // Handle API errors
  useEffect(() => {
    if (detailsError) {
      setApiError(detailsError);
    }
  }, [detailsError]);

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

  if (apiError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ErrorComponentCompact
          onRetry={() => {
            setApiError(null);
            // The query will automatically refetch
          }}
        />
      </div>
    );
  }

  if (isLoadingDetails) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loading title="Loading Alert Details" />
      </div>
    );
  }

  // Use detailed alert data if available, otherwise fall back to selectedAlert
  const alertData = detailedAlert || selectedAlert;
  
  const IconComponent = getEventIcon(alertData.data.basic_data.eventType);
  const measurements = alertData.data.measurements;
  const authors = alertData.data.authors;
  const telescopes = alertData.data.telescopes;
  const timeline = alertData.timeline || [];
  const allUrls = alertData.data.urls || [];
  
  // Separate image URLs, FITS files, and regular URLs
  const imageUrls = allUrls.filter(url => 
    /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url)
  );
  const fitsUrls = allUrls.filter(url => 
    /\.(fit|fits)$/i.test(url)
  );
  const regularUrls = allUrls.filter(url => 
    !/\.(jpg|jpeg|png|gif|bmp|webp|svg|fit|fits)$/i.test(url)
  );
  console.log({
    fitsUrls,
    imageUrls,
    regularUrls
  });

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-6">
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
              {onOpenRawData && (
              <Button
                variant="outline"
                size="lg"
                hasIcon={true}
                className="flex items-center space-x-2"
                onClick={() => onOpenRawData(alertData)}
              >
                <FileText className="h-4 w-4" />
                Raw Data
              </Button>
              )}
            </div>
          </div>
           {/* Event Information Section */}
           <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Event Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 rounded-lg mb-4">
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
            <Card className="border-1 border-[#ffc332] bg-gradient-to-r from-starithm-electric-violet/5 via-starithm-veronica/5 to-[#2f0240]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="rounded-lg mb-4">
                <p className="text-sm">{alertData.summary}</p>
                <p className="text-xs text-muted-foreground text-right italic mt-2">
                  This is an AI generated summary, it may be incorrect. Please verify information with original sources.
                </p>
              </CardContent>
            </Card>
          )}

         
          {timeline.length > 0 && showTimeline &&(
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Alert Timeline for {alertData.event}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="rounded-lg mb-4 bg-starithm-bg-black">
                <div className="relative">
                  {/* Vertical Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Fixed height scrollable container */}
                  <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {timeline.length > 0 ? 
                        (timeline.map((timelineItem, index) => (
                          <div key={index} className="relative flex items-start">
                            {/* Timeline Dot */}
                            <div className={`absolute left-3 w-3 h-3 rounded-full border-2 border-border ${
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
                              <div className="flex items-center justify-between mb-2 bg-starithm-bg-black">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs border-starithm-electric-violet text-starithm-electric-violet">
                                    {timelineItem.alertKey}
                                  </Badge>
                                  {timelineItem.current && (
                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                      SELECTED
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
                  
                  
                </div>
              </CardContent>
            </Card>
          )}
          {/* Measurements Section */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Astronomical Measurements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="rounded-lg mb-4">
              {Object.keys(measurements).length > 0 ? (
                <>
                <div className="grid grid-cols-2 gap-4">
                    {
                        Object.keys(measurements).map((key) => {
                            const value = measurements[key as keyof typeof measurements];
                            if (key === 'tables') {
                              return null;

                            }
                            if (value === null || value === undefined) {
                                return null;
                            }
                            if (Array.isArray(value) && typeof value[0] !== 'object') {
                                return (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">{key.replaceAll('_', ' ')}</label>
                                        <p className="text-sm">{value.join(', ').replaceAll('"', '')}</p>
                                    </div>
                                )
                            }
                            if (Array.isArray(value) && typeof value[0] === 'object') {
                                return (
                                  <div className="mt-4">
                                    <label className="text-sm font-medium text-muted-foreground mb-2">{key.replaceAll('_', ' ')}</label>
                                    <div className="border rounded-lg overflow-hidden">
                                      <div className="bg-muted/50 px-4 py-2 border-b">
                                        <h4 className="font-medium text-sm">{key.replaceAll('_', ' ')} Data</h4>
                                      </div>
                                      {Array.isArray(value) && value.length > 0 ? (
                                        <div className="overflow-x-auto mt-4">
                                          <table className="w-full text-sm">
                                            <thead className="bg-muted/30">
                                              <tr>
                                                {Object.keys(value[0]).map((column) => (
                                                  <th key={column} className="px-4 py-2 text-left font-medium text-muted-foreground border-b">
                                                    {column.replaceAll('_', ' ')}
                                                  </th>
                                                ))}
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {value.map((row, rowIndex) => (
                                                <tr key={rowIndex} className="border-b hover:bg-muted/20">
                                                  {Object.values(row).map((cell, cellIndex) => (
                                                    <td key={cellIndex} className="px-4 py-2 text-foreground">
                                                      {typeof cell === 'object' ? JSON.stringify(cell).replaceAll('"', '') : String(cell)}
                                                    </td>
                                                  ))}
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      ) : (
                                        <div className="p-4 text-sm text-muted-foreground">
                                          No data available
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                          }
                            if (typeof value === 'object') {
                              return Object.keys(value).map((vKey) => (
                                  <div key={vKey}>
                                      <label className="text-sm font-medium text-muted-foreground">{vKey.replaceAll('_', ' ')}</label>
                                      <p className="text-sm">{JSON.stringify(value[vKey]).replaceAll('"', '')}</p>
                                  </div>
                              ))
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
                {
                  measurements.tables?.length > 0 && (
                    <div className="mt-6">
                      <label className="text-sm font-medium text-muted-foreground mb-2">Tables</label>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 px-4 py-2 border-b">
                          <h4 className="font-medium text-sm">Data Table</h4>
                        </div>
                        {Array.isArray(measurements.tables) && measurements.tables.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-muted/30">
                                <tr>
                                  {Object.keys(measurements.tables[0]).map((column) => (
                                    <th key={column} className="px-4 py-2 text-left font-medium text-muted-foreground border-b">
                                      {column}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {measurements.tables.map((row, rowIndex) => (
                                  <tr key={rowIndex} className="border-b hover:bg-muted/20">
                                    {Object.values(row).map((cell, cellIndex) => (
                                      <td key={cellIndex} className="px-4 py-2 text-foreground">
                                        {String(cell)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-4 text-sm text-muted-foreground">
                            No data available
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
                {
                  measurements.misc_tables && (
                    <div className="mt-6">
                      <label className="text-sm font-medium text-muted-foreground mb-2">Miscellaneous Tables</label>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 px-4 py-2 border-b">
                          <h4 className="font-medium text-sm">Miscellaneous Data Table</h4>
                        </div>
                        {Array.isArray(measurements.misc_tables) && measurements.misc_tables.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-muted/30">
                                <tr>
                                  {Object.keys(measurements.misc_tables[0]).map((column) => (
                                    <th key={column} className="px-4 py-2 text-left font-medium text-muted-foreground border-b">
                                      {column}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {measurements.misc_tables.map((row, rowIndex) => (
                                  <tr key={rowIndex} className="border-b hover:bg-muted/20">
                                    {Object.values(row).map((cell, cellIndex) => (
                                      <td key={cellIndex} className="px-4 py-2 text-foreground">
                                        {String(cell)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-4 text-sm text-muted-foreground">
                            No data available
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No measurements detected in alert</p>
              )}
            </CardContent>
          </Card>

          {/* Participants Section */}
          {(authors.authors.length > 0 || authors.institutions.length > 0 || telescopes.telescopes.length > 0 || telescopes.observatories.length > 0) && (
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
                  {
                    Object.keys(authors).map((key) => {
                      return authors[key]?.length > 0 && (<div className="mb-3">
                        <label className="text-sm font-medium text-muted-foreground">{key.toLocaleUpperCase()}</label>
                        <div className="text-sm mt-1">
                          {authors[key].join(', ')}
                        </div>
                      </div>)
                    })
                  }
                  </div>
                  <div>
                  {
                    Object.keys(telescopes).map((key) => {
                      return telescopes[key]?.length > 0 && (<div className="mb-3">
                        <label className="text-sm font-medium text-muted-foreground">{key.toLocaleUpperCase()}</label>
                        <div className="text-sm mt-1">
                          {telescopes[key].join(', ')}
                        </div>
                      </div>)
                    })
                  }
                  {/* {authors.authors && authors.authors.length > 0 && (
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
                  )} */}
                </div>

                {/* <div>
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
                </div> */}
              </div>
            </CardContent>
          </Card>)}
          
          {/* Images Section */}
          {imageUrls.length > 0 && (
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Image className="h-5 w-5" />
                  <span>Images ({imageUrls.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4"> */}
                  {imageUrls.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        className="w-1/2 h-25 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => {
                          setSelectedImage(imageUrl);
                          setIsImageModalOpen(true);
                        }}
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(imageUrl);
                          setIsImageModalOpen(true);
                        }}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                {/* </div> */}
              </CardContent>
            </Card>
          )}
          
          {/* FITS Files Section */}
          {fitsUrls.length > 0 && (
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TelescopeIcon className="h-5 w-5" />
                  <span>FITS Files ({fitsUrls.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {fitsUrls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <TelescopeIcon className="h-4 w-4 text-starithm-electric-violet" />
                        <span className="text-sm font-mono text-gray-700">
                          {url.split('/').pop() || url}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFitsUrl(url);
                          setIsFitsModalOpen(true);
                        }}
                      >
                        <TelescopeIcon className="h-4 w-4 mr-2" />
                        View FITS
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Links Section */}
          {regularUrls.length > 0 && (
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link className="h-5 w-5" />
                  <span>Links</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {regularUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-starithm-link hover:underline"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Image Modal */}
          <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <DialogHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-semibold">Image Preview</DialogTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsImageModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogHeader>
              <div className="p-4">
                <img
                  src={selectedImage}
                  alt="Full size image"
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
          
          {/* FITS Viewer Modal */}
          <FitsViewerModal
            isOpen={isFitsModalOpen}
            onClose={() => setIsFitsModalOpen(false)}
            fitsUrl={selectedFitsUrl}
            title={`FITS Viewer - ${selectedFitsUrl.split('/').pop() || 'FITS File'}`}
            js9Loaded={js9Loaded}
          />
        </div>
      </div>
    </div>
  );
}
