import { TrendingCarousel } from "./TrendingCarousel";
import { Alert } from "@shared/types";
import {
  HeaderWrapper,
  Inner,
  TopRow,
  TitleWrap,
  Title,
  Subtitle,
  RightBox,
  StatusRow,
  StatusItem,
  Dot,
} from "../styled_components/DashboardHeader.styled";

interface DashboardHeaderProps {
  onAlertClick?: (alert: Alert) => void;
}

export function DashboardHeader({ onAlertClick }: DashboardHeaderProps) {
  return (
    <HeaderWrapper>
      <Inner>
        <TopRow>
          <TitleWrap>
            <Title>Event Intelligence Dashboard</Title>
            <Subtitle>
              Monitor and analyze astronomical events in real-time through GCN notices and ATel reports. Track gamma-ray bursts, optical transients, neutrino detections, and gravitational waves with comprehensive measurement data and confidence assessments.
            </Subtitle>
          </TitleWrap>
          <RightBox>
            <TrendingCarousel onAlertClick={onAlertClick} />
          </RightBox>
        </TopRow>
        <StatusRow>
          <StatusItem>
            <Dot color="#10b981" />
            <span>System Online</span>
          </StatusItem>
          <StatusItem>
            <Dot color="#770ff5" />
            <span>Live Data</span>
          </StatusItem>
        </StatusRow>
      </Inner>
    </HeaderWrapper>
  );
}
