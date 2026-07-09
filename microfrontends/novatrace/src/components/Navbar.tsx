import React from "react";
import { Button } from "@shared/components/ui/button";
import { Activity, Home, Search } from "lucide-react";
import { useLocation } from "wouter";
import { SignInButton, UserButton, useAuth } from "@clerk/react";
import { saveReturnUrl } from '@shared/lib/auth';
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
  const { isSignedIn } = useAuth();

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

  const navigateToSearch = () => {
    const target = '/novatrace/search';
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', path: target }, '*');
    } else {
      window.location.href = target;
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
            onClick={navigateToSearch}
            className="flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
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
          {!isSignedIn ? (
            <SignInButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : '/'}>
              <button onClick={saveReturnUrl} style={{ padding: '0.4rem 1rem', borderRadius: 6, border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.1)', color: 'rgba(167,139,250,0.9)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 500 }}>
                Sign in
              </button>
            </SignInButton>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </RightActions>
      </NavInner>
    </NavWrapper>
  );
}
