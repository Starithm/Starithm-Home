import React from "react";
import { Button } from "@shared/components/ui/button";
import { Activity, Home } from "lucide-react";
import { useLocation } from "wouter";
import {
  NavWrapper,
  NavInner,
  LeftGroup,
  Brand,
  LogoBox,
  BrandText,
  BrandTitle,
  BrandSubtitle,
  RightActions,
} from "../styled_components/Navbar.styled";

export function Navbar() {
  const [, setLocation] = useLocation();

  const navigateToEvents = () => {
    // Navigate to the main app's events route
    window.parent.postMessage({ type: 'navigate', path: '/novatrace/events' }, '*');
  };

  const navigateToStatus = () => {
    // Navigate to the main app's status route
    window.parent.postMessage({ type: 'navigate', path: '/novatrace/status' }, '*');
  };

  const navigateToHome = () => {
    // Navigate to the main app's home route
    window.parent.postMessage({ type: 'navigate', path: '/' }, '*');
  };

  return (
    <NavWrapper>
      <NavInner>
        <LeftGroup>
          <Brand>
            <LogoBox>N</LogoBox>
            <BrandText>
              <BrandTitle>NovaTrace</BrandTitle>
              <BrandSubtitle>Powered by Starithm Tech</BrandSubtitle>
            </BrandText>
          </Brand>
        </LeftGroup>

        <RightActions>
          <Button 
            variant="outline" 
            size="lg"
            hasIcon={true}
            onClick={navigateToEvents}
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Event Level Dashboard</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            hasIcon={true}
            onClick={navigateToStatus}
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Check Status</span>
          </Button>
          <Button 
            variant="outline"
            size="lg" 
            hasIcon={true}
            onClick={navigateToHome}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Button>
        </RightActions>
      </NavInner>
    </NavWrapper>
  );
}
