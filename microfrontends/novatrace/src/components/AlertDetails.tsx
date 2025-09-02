import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@shared/types";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";

import { API_ENDPOINTS } from "@shared/lib/config";
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
import {
  EmptyStateContainer,
  EmptyStateContent,
  EmptyStateIcon,
  AlertImagesSection,
  AlertImagesGrid,
  AlertImageItem,
  AlertImageElement,
  AlertImageExpandButton,
  EmptyStateTitle,
  EmptyStateDescription,
  AlertDetailsContainer,
  AlertDetailsContent,
  AlertDetailsInner,
  AlertHeader,
  AlertHeaderLeft,
  AlertHeaderRight,
  AlertIcon,
  AlertTitle,
  AlertSubtitle,
  AlertTitleSection,
  EventInfoGrid,
  EventInfoItem,
  EventInfoLabel,
  EventInfoValue,
  AlertCardSection,
  AlertCardTitle,
  AlertCardContent,
  AlertSummarySection,
  AlertSummaryContent,
  AlertSummaryText,
  AlertSummaryFooter,
  ParticipantsGrid,
  ParticipantColumn,
  ParticipantItem,
  ParticipantLabel,
  ParticipantValue,
  AlertFitsSection,
  AlertFitsFileName,
  AlertFitsContent,
  AlertFitsFileIcon,
  AlertFitsFileLeft,
  AlertFitsFileItem,
  LinksContainer,
  LinksContent,
  LinkItem,
  AlertCardHeader
} from "../styled_components";

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
      <AlertDetailsContainer>
        <EmptyStateContainer>
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <EmptyStateTitle>No Alert Selected</EmptyStateTitle>
          <EmptyStateDescription>Select an alert from the list to view details</EmptyStateDescription>
          <p className="text-sm">Select an alert from the list to view details</p>
          </EmptyStateContainer>
        </AlertDetailsContainer>
    );
  }

  if (apiError) {
    return (
        <AlertDetailsContainer>
        <ErrorComponentCompact
          onRetry={() => {
            setApiError(null);
            // The query will automatically refetch
          }}
        />
      </AlertDetailsContainer>
    );
  }

  if (isLoadingDetails) {
    return (
      <AlertDetailsContainer>
        <Loading title="Loading Alert Details" />
      </AlertDetailsContainer>
    );
  }

  // Use detailed alert data if available, otherwise fall back to selectedAlert
  const alertData = detailedAlert || selectedAlert;
  
  const IconComponent = getEventIcon(alertData.data.basic_data.eventType);
  const measurements = alertData.data.measurements;
  const authors = alertData.data.authors;
  const telescopes = alertData.data.telescopes;
  const allUrls: string[] = alertData.data.urls || [];
  
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
    <AlertDetailsContainer>
      <AlertDetailsContent>
        <AlertDetailsInner>
          {/* Header */}
          <AlertHeader>
            <AlertHeaderLeft>
              <AlertIcon>
                <IconComponent size={32} />
              </AlertIcon>
              <AlertTitleSection>
                <AlertTitle>
                  {alertData.event}
                </AlertTitle>
                <AlertSubtitle>
                  {alertData.alertKey} • {alertData.broker}
                </AlertSubtitle>
              </AlertTitleSection>
            </AlertHeaderLeft>
            <AlertHeaderRight>
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
                  onClick={() => onOpenRawData(alertData)}
                >
                  <FileText className="h-4 w-4" />
                  Raw Data
                    </Button>
              )}
            </AlertHeaderRight>
          </AlertHeader>
          {/* Event Information Section */}
          <AlertCardSection>
            <AlertCardHeader>
              <AlertCardTitle>
                <Calendar className="h-5 w-5" />
                <span>Event Information</span>
              </AlertCardTitle>
            </AlertCardHeader>
            <AlertCardContent>
              <EventInfoGrid>
                <EventInfoItem>
                  <EventInfoLabel>Detection Time</EventInfoLabel>
                  <EventInfoValue>{formatDate(alertData.date)}</EventInfoValue>
                </EventInfoItem>
                <EventInfoItem>
                  <EventInfoLabel>Event Type</EventInfoLabel>
                  <EventInfoValue>{alertData.data.basic_data.eventType || 'Unknown'}</EventInfoValue>
                </EventInfoItem>
              </EventInfoGrid>
              
            </AlertCardContent>
            </AlertCardSection>
            <AlertSummarySection>
              <AlertCardHeader>
                <AlertCardTitle>
                  <span>Summary</span>
                </AlertCardTitle>
              </AlertCardHeader>
              <AlertSummaryContent>
                <AlertSummaryText>{alertData.summary}</AlertSummaryText>
                <AlertSummaryFooter>
                  This is an AI generated summary, it may be incorrect. Please verify information with original sources.
                </AlertSummaryFooter>
              </AlertSummaryContent>
            </AlertSummarySection>
          {/* Summary Section */}
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
            <AlertCardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Participants</span>
              </CardTitle>
            </AlertCardHeader>
            <CardContent>
              <ParticipantsGrid>
                <ParticipantColumn>
                  <ParticipantItem>
                    <ParticipantLabel>Authors</ParticipantLabel>
                    <ParticipantValue>
                      {authors.authors.map((author, index) => (
                        <span key={index}>{author}{index < authors.authors.length - 1 ? ', ' : ''}</span>
                      ))}
                    </ParticipantValue>
                  </ParticipantItem>
                  <ParticipantItem>
                    <ParticipantLabel>Institutions</ParticipantLabel>
                    <ParticipantValue>
                      {authors.institutions.map((institution, index) => (
                        <span key={index}>{institution}{index < authors.institutions.length - 1 ? ', ' : ''}</span>
                      ))}
                    </ParticipantValue>
                  </ParticipantItem>
                </ParticipantColumn>
                <ParticipantColumn>
                  <ParticipantItem>
                    <ParticipantLabel>Telescopes</ParticipantLabel>
                    <ParticipantValue>
                      {telescopes.telescopes.map((telescope, index) => (
                        <span key={index}>{telescope}{index < telescopes.telescopes.length - 1 ? ', ' : ''}</span>
                      ))}
                    </ParticipantValue>
                  </ParticipantItem>
                  <ParticipantItem>
                    <ParticipantLabel>Observatories</ParticipantLabel>
                    <ParticipantValue>
                      {telescopes.observatories.map((observatory, index) => (
                        <span key={index}>{observatory}{index < telescopes.observatories.length - 1 ? ', ' : ''}</span>
                      ))}
                    </ParticipantValue>
                  </ParticipantItem>
                </ParticipantColumn>
              </ParticipantsGrid>
            </CardContent>
          </Card>)}
          
          {/* Images Section */}
          {imageUrls.length > 0 && (
            <AlertImagesSection>
              <CardHeader>
                <AlertCardTitle>
                  <Image className="h-5 w-5" />
                  <span>Images ({imageUrls.length})</span>
                </AlertCardTitle>
              </CardHeader>
              <CardContent>
                <AlertImagesGrid>
                  {imageUrls.map((imageUrl, index) => (
                    <AlertImageItem key={index}>
                      <AlertImageElement
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        onClick={() => {
                          setSelectedImage(imageUrl);
                          setIsImageModalOpen(true);
                        }}
                      />
                      <AlertImageExpandButton
                        onClick={() => {
                          setSelectedImage(imageUrl);
                          setIsImageModalOpen(true);
                        }}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </AlertImageExpandButton>
                    </AlertImageItem>
                  ))}
                </AlertImagesGrid>
              </CardContent>
            </AlertImagesSection>
          )}
          
          {/* FITS Files Section */}
          {fitsUrls.length > 0 && (
            <AlertFitsSection>
              <CardHeader>
                <AlertCardTitle>
                  <TelescopeIcon className="h-5 w-5" />
                  <span>FITS Files ({fitsUrls.length})</span>
                </AlertCardTitle>
              </CardHeader>
              <CardContent>
                <AlertFitsContent>
                  {fitsUrls.map((url, index) => (
                    <AlertFitsFileItem key={index}>
                      <AlertFitsFileLeft>
                        <AlertFitsFileIcon>
                          <TelescopeIcon className="h-4 w-4" />
                        </AlertFitsFileIcon>
                        <AlertFitsFileName>
                          {url.split('/').pop() || url}
                        </AlertFitsFileName>
                      </AlertFitsFileLeft>
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
                    </AlertFitsFileItem>
                  ))}
                </AlertFitsContent>
              </CardContent>
            </AlertFitsSection>
          )}
          
          {/* Links Section */}
          {regularUrls.length > 0 && (
            <LinksContainer>
              <AlertCardHeader>
                <AlertCardTitle>
                  <Link className="h-5 w-5" />
                  <span>Links</span>
                </AlertCardTitle>
              </AlertCardHeader>
              <AlertCardContent>
                <LinksContent>
                  {regularUrls.map((url, index) => (
                    <LinkItem
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {url}
                    </LinkItem>
                  ))}
                </LinksContent>
              </AlertCardContent>
            </LinksContainer>
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
        </AlertDetailsInner>
      </AlertDetailsContent>
    </AlertDetailsContainer>
  );
}
