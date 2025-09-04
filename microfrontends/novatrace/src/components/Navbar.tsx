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
    const target = '/novatrace/events';
    // If embedded in a host, ask parent to navigate
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', path: target }, '*');
    } else {
      // Fallback: navigate within microfrontend (works in standalone dev)
      window.location.href = `${target}`;
    }
  };

  const navigateToStatus = () => {
    // Navigate to the main app's status route
    const target = '/novatrace/status';
    // If embedded in a host, ask parent to navigate
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', path: target }, '*');
    } else {
      // Fallback: navigate within microfrontend (works in standalone dev)
      window.location.href = `${target}`;
    }
  };

  const navigateToHome = () => {
    // Navigate to the main app's home route
    const target = '/';
    // If embedded in a host, ask parent to navigate
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', path: target }, '*');
    } else {
      // Fallback: navigate within microfrontend (works in standalone dev)
      window.location.href = `${target}`;
    }
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
