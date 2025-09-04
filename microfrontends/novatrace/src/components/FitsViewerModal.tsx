import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@shared/components/ui/dialog";
import { Button } from "@shared/components/ui/button";
import { X, Download, RotateCw, ZoomIn, ZoomOut, ExternalLink, FileText } from "lucide-react";
import {
  StyledDialogContent,
  StyledDialogHeader,
  HeaderRow,
  StyledDialogTitle,
  HeaderActions,
  Body,
  CenteredSection,
  RoundIcon,
  Heading,
  SubText,
  VerticalActions,
  JS9Outer,
  JS9Panel,
  JS9Container,
  JS9HelperText,
  JS9HelperSub,
} from "../styled_components/FitsViewerModal.styled";

interface FitsViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fitsUrl: string;
  title?: string;
  js9Loaded?: boolean;
}

declare global {
  interface Window {
    JS9: any;
    fabric: any;
    astro: any;
  }
}

export function FitsViewerModal({ isOpen, onClose, fitsUrl, title = "FITS Viewer", js9Loaded = false }: FitsViewerModalProps) {
  const js9ContainerRef = useRef<HTMLDivElement>(null);
  const js9InstanceRef = useRef<any>(null);
  const [fitsType, setFitsType] = useState<'HEALPix' | 'Image2D' | 'Unknown' | 'Loading'>('Loading');
  const [showJS9, setShowJS9] = useState(false);

  useEffect(() => {
    if (isOpen) {
      classifyFITS();
    }
  }, [isOpen, fitsUrl]);

  useEffect(() => {
    // Initialize JS9 when modal opens and JS9 is loaded
    if (isOpen && js9Loaded && js9ContainerRef.current && window.JS9 && showJS9) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        initializeJS9();
      }, 100);
    }
  }, [isOpen, fitsUrl, js9Loaded, showJS9]);

  const classifyFITS = async () => {
    setFitsType('Loading');
    setShowJS9(false);
    
    try {
      // Load fitsjs if not already loaded
      if (!window.astro) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/fitsjs/dist/fits.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load fitsjs'));
          document.head.appendChild(script);
        });
      }

      const response = await fetch(fitsUrl);
      const arrayBuffer = await response.arrayBuffer();
      const fits = new window.astro.FITS(arrayBuffer);

      const hdr = fits.getHDU(0).header.cards.reduce((acc: any, card: any) => {
        acc[card.keyword] = card.value;
        return acc;
      }, {});

      // HEALPix cues
      if ((hdr['PIXTYPE'] || '').toUpperCase() === 'HEALPIX') {
        setFitsType('HEALPix');
        return;
      }
      if (hdr['NSIDE'] !== undefined) {
        setFitsType('HEALPix');
        return;
      }
      if (hdr['NAXIS'] == 1) {
        setFitsType('HEALPix');
        return;
      }
      if ((hdr['CTYPE1']||'').includes('HPX') || (hdr['CTYPE2']||'').includes('HPX')) {
        setFitsType('HEALPix');
        return;
      }

      // 2D image cues
      if (hdr['NAXIS'] == 2 && hdr['NAXIS1'] && hdr['NAXIS2']) {
        setFitsType('Image2D');
        return;
      }

      setFitsType('Unknown');
    } catch (error) {
      console.error('Failed to classify FITS file:', error);
      setFitsType('Unknown');
    }
  };

  const initializeJS9 = () => {
    if (!js9ContainerRef.current || !window.JS9) return;

    try {
      // Clear previous instance
      if (js9InstanceRef.current) {
        window.JS9.CloseDisplay(js9InstanceRef.current);
      }

      // Create new JS9 display
      const display = window.JS9.CreateDisplay(js9ContainerRef.current, {
        width: 600,
        height: 600,
        backgroundColor: 'black',
        colormap: 'viridis',
        scale: 'linear'
      });

      js9InstanceRef.current = display;

      // Load the FITS file
      window.JS9.LoadFITS(fitsUrl, display, {
        onload: () => {
          console.log('FITS file loaded successfully');
        },
        onerror: (error: any) => {
          console.error('Error loading FITS file:', error);
        }
      });
    } catch (error) {
      console.error('Error initializing JS9:', error);
    }
  };

  const handleZoomIn = () => {
    if (js9InstanceRef.current) {
      window.JS9.SetZoom(js9InstanceRef.current, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (js9InstanceRef.current) {
      window.JS9.SetZoom(js9InstanceRef.current, 0.7);
    }
  };

  const handleReset = () => {
    if (js9InstanceRef.current) {
      window.JS9.SetZoom(js9InstanceRef.current, 1);
      window.JS9.SetPan(js9InstanceRef.current, 0, 0);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fitsUrl;
    link.download = fitsUrl.split('/').pop() || 'fits-file.fits';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <StyledDialogContent>
        <StyledDialogHeader>
          <HeaderRow>
            <StyledDialogTitle>
              <span>🔭</span>
              <span>{title}</span>
            </StyledDialogTitle>
            <HeaderActions>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                title="Reset View"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                title="Download FITS"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </HeaderActions>
          </HeaderRow>
        </StyledDialogHeader>
        
        <Body>
          <div className="flex flex-col items-center">
            {fitsType === 'Loading' && (
              <CenteredSection>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-starithm-electric-violet mx-auto mb-4"></div>
                <SubText>Analyzing FITS file...</SubText>
              </CenteredSection>
            )}

            {fitsType === 'HEALPix' && (
              <CenteredSection>
                <RoundIcon bg="#FEF3C7">
                  <span className="text-2xl">🌌</span>
                </RoundIcon>
                <Heading>HEALPix FITS File</Heading>
                <SubText>
                  This is a HEALPix format FITS file, which JS9 doesn't support. HEALPix files contain 
                  spherical coordinate data rather than 2D images.
                </SubText>
                <VerticalActions>
                  <Button
                    variant="outline"
                    onClick={() => window.open(fitsUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Download FITS File</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowJS9(true);
                      setFitsType('Image2D'); // Force JS9 view for testing
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Try JS9 Anyway</span>
                  </Button>
                </VerticalActions>
              </CenteredSection>
            )}

            {fitsType === 'Image2D' && !showJS9 && (
              <CenteredSection>
                <RoundIcon bg="#D1FAE5">
                  <span className="text-2xl">🖼️</span>
                </RoundIcon>
                <Heading>2D Image FITS File</Heading>
                <SubText>
                  This appears to be a 2D image FITS file that should work with JS9.
                </SubText>
                <VerticalActions>
                  <Button
                    onClick={() => setShowJS9(true)}
                    className="bg-starithm-electric-violet hover:bg-starithm-electric-violet/90"
                  >
                    <span>🔭 Open in JS9 Viewer</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(fitsUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Download FITS File</span>
                  </Button>
                </VerticalActions>
              </CenteredSection>
            )}

            {fitsType === 'Unknown' && (
              <CenteredSection>
                <RoundIcon bg="#F3F4F6">
                  <span className="text-2xl">❓</span>
                </RoundIcon>
                <Heading>Unknown FITS Format</Heading>
                <SubText>
                  Unable to determine the format of this FITS file.
                </SubText>
                <VerticalActions>
                  <Button
                    variant="outline"
                    onClick={() => setShowJS9(true)}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Try JS9 Viewer</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(fitsUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Download FITS File</span>
                  </Button>
                </VerticalActions>
              </CenteredSection>
            )}

            {showJS9 && (
              <JS9Outer>
                <JS9Panel>
                  <div className="flex flex-col items-center">
                    <JS9Container ref={js9ContainerRef}>
                      {!js9Loaded && (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p>Loading JS9 FITS Viewer...</p>
                          </div>
                        </div>
                      )}
                    </JS9Container>
                    <JS9HelperText>
                      <p>🔭 Interactive FITS Image Viewer</p>
                      <JS9HelperSub>
                        Use mouse to pan, scroll to zoom, and buttons above for controls
                      </JS9HelperSub>
                    </JS9HelperText>
                  </div>
                </JS9Panel>
              </JS9Outer>
            )}
          </div>
        </Body>
      </StyledDialogContent>
    </Dialog>
  );
}
