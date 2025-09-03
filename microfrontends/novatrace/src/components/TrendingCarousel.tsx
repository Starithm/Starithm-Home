import React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, Zap, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@shared/types";
import { API_ENDPOINTS } from "../../../../shared/lib/config";
import { getTimeAgo } from "../utils/duration";
import { ErrorComponentCompact } from "@shared/components";
import {
  CarouselContainer,
  CarouselInner,
  Header,
  HeaderTitle,
  ClickableRow,
  RowLeft,
  IconWrap,
  EventTitle,
  EventSubtitle,
  RowRight,
  CountWrap,
  CountLine,
  CountNumber,
  CountLabel,
  TimeText,
  NavButtonLeft,
  NavButtonRight,
  SmallIconButton,
  Dots,
  Dot,
  CenteredState,
} from "../styled_components/TrendingCarousel.styled";

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
    <CarouselContainer>
      <CarouselInner>
        <Header>
          <HeaderTitle>Trending!</HeaderTitle>
        </Header>
        {apiError ? (
          <CenteredState>
            <ErrorComponentCompact
              onRetry={() => {
                setApiError(null);
              }}
            />
          </CenteredState>
        ) : isLoading ? (
          <CenteredState>Loading trending alerts...</CenteredState>
        ) : currentEvent ? (
          <ClickableRow
            onClick={async () => {
              if (onAlertClick) {
                try {
                  const response = await fetch(
                    API_ENDPOINTS.alertDetails(currentEvent.latestAlertId.toString())
                  );
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
            <RowLeft>
              <IconWrap>
                <IconComponent size={20} />
              </IconWrap>
              <div>
                <EventTitle>{currentEvent.event}</EventTitle>
                <EventSubtitle>{currentEvent.latestAlertKey}</EventSubtitle>
              </div>
            </RowLeft>
            <RowRight>
              <CountWrap>
                <CountLine>
                  <CountNumber>{currentEvent.alertCount}</CountNumber>
                  <CountLabel>Alerts</CountLabel>
                </CountLine>
                <TimeText>
                  Latest: {getTimeAgo(new Date(currentEvent.latestAlert))}
                </TimeText>
                <TimeText>
                  {new Date(currentEvent.latestAlert).toLocaleDateString()}
                </TimeText>
              </CountWrap>
            </RowRight>
          </ClickableRow>
        ) : (
          <CenteredState>No trending alerts available</CenteredState>
        )}

        <NavButtonLeft>
          <SmallIconButton variant="ghost" size="sm" onClick={prevSlide}>
            <ChevronLeft size={16} />
          </SmallIconButton>
        </NavButtonLeft>
        <NavButtonRight>
          <SmallIconButton variant="ghost" size="sm" onClick={nextSlide}>
            <ChevronRight size={16} />
          </SmallIconButton>
        </NavButtonRight>

        {trendingAlerts.length > 0 && (
          <Dots>
            {trendingAlerts.map((_, index) => (
              <Dot key={index} active={index === currentIndex} />
            ))}
          </Dots>
        )}
      </CarouselInner>
    </CarouselContainer>
  );
}
