import React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/types/Alert";
import { API_ENDPOINTS } from "../../lib/config";
import { getTimeAgo } from "../../utils/duration";
import { ErrorComponentCompact } from "@shared/components";

interface TrendingAlert {
  event: string;
  alertCount: number;
  latestAlert: string;
  latestAlertKey: string;
  latestAlertId: string;
}

interface TrendingCarouselProps {
  onAlertClick?: (alert: Alert) => void;
}

const getEventIcon = (eventType: string) => {
  if (eventType.toLowerCase().includes('grb')) return Zap;
  if (eventType.toLowerCase().includes('gw')) return TrendingUp;
  if (eventType.toLowerCase().includes('sn')) return Star;
  return TrendingUp;
};

export function TrendingCarousel({ onAlertClick }: TrendingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [apiError, setApiError] = useState<any>(null);

  // Fetch trending alerts from API
  const { data: trendingAlerts = [], isLoading, error: trendingError } = useQuery<TrendingAlert[]>({
    queryKey: ['/api/alerts/trending'],
    queryFn: () => fetch(`${API_ENDPOINTS.alerts}/trending`).then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    }),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Handle API errors
  useEffect(() => {
    if (trendingError) {
      setApiError(trendingError);
    }
  }, [trendingError]);

  useEffect(() => {
    if (trendingAlerts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % trendingAlerts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [trendingAlerts.length]);

  const nextSlide = () => {
    if (trendingAlerts.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % trendingAlerts.length);
    }
  };

  const prevSlide = () => {
    if (trendingAlerts.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + trendingAlerts.length) % trendingAlerts.length);
    }
  };

  const currentEvent = trendingAlerts[currentIndex];
  const IconComponent = currentEvent ? getEventIcon(currentEvent.event) : TrendingUp;

  return (
    <div className="group relative rounded-lg shadow-lg h-44 p-[2px] overflow-hidden">
  <style>{`
    @keyframes borderFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    .animated-border::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: 2px; /* border thickness */
      border-radius: 0.5rem; /* match rounded-lg */
      background: linear-gradient(90deg, #ffc332, #8D0FF5, #6B46C1, #ffc332);
      background-size: 200% 100%;
      animation: borderFlow 3s linear infinite;
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
      z-index: 0;
    }
  `}</style>

  <div className="animated-border absolute inset-0"></div>
  <div className="relative h-full rounded-lg bg-gradient-to-r from-starithm-electric-violet/10 via-starithm-veronica/10 to-[#FFFDF9] p-4 z-10 flex flex-col justify-center">
              <div className="mb-3">
          <h2 className="text-lg font-semibold text-foreground">Trending!</h2>
        </div>
        {apiError ? (
          <div className="flex items-center justify-center h-full">
            <ErrorComponentCompact
              onRetry={() => {
                setApiError(null);
                // The query will automatically refetch
              }}
            />
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">Loading trending alerts...</div>
          </div>
        ) : currentEvent ? (
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-white/20 rounded-lg p-2 transition-colors"
            onClick={async () => {
              if (onAlertClick) {
                try {
                  // Fetch the alert details using the latestAlertKey
                  const response = await await fetch(API_ENDPOINTS.alertDetails(currentEvent.latestAlertId.toString()));
                  if (response.ok) {
                    const data = await response.json();
                    onAlertClick(data);
                  }
                } catch (error) {
                  console.error('Failed to fetch alert details:', error);
                }
              }
            }}
          >
            <div className="flex items-center space-x-3">
              <IconComponent className="h-5 w-5 text-starithm-electric-violet" />
              <div>
                <h3 className="font-semibold text-foreground">{currentEvent.event}</h3>
                <p className="text-sm text-muted-foreground">{currentEvent.latestAlertKey}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-medium text-foreground flex items-center space-x-2">
                  <h1 className="text-starithm-electric-violet font-bold text-2xl">{currentEvent.alertCount}</h1>
                  <span className="text-muted-foreground text-sm">Alerts</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Latest: {getTimeAgo(new Date(currentEvent.latestAlert))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(currentEvent.latestAlert).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">No trending alerts available</div>
          </div>
        )}
      
      <div className="absolute top-1/2 -translate-y-1/2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {trendingAlerts.length > 0 && (
        <div className="flex justify-center mt-6 space-x-1">
          {trendingAlerts.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-8 rounded-full transition-colors ${
                index === currentIndex 
                  ? "bg-starithm-electric-violet" 
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      )}
        </div>
      </div>
    //</div>
  );
}
