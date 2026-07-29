import React, { Suspense, lazy, useEffect, useRef } from 'react';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { SignInButton, UserButton, useAuth, AuthenticateWithRedirectCallback } from '@clerk/react';
import '../shared/styles/globals.css';
import { getQueryClient } from '@shared/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { saveReturnUrl, consumeReturnUrl } from '@shared/lib/auth';
import { StarithmLoader } from '@shared/components/StarithmLoader';

// Lazy load microfrontends
const HomeMicrofrontend = lazy(() => import('./microfrontends/HomeMicrofrontend'));
const NovaTraceMicrofrontend = lazy(() => import('./microfrontends/NovaTraceMicrofrontend'));
const BlogMicrofrontend = lazy(() => import('./microfrontends/BlogMicrofrontend'));

function App() {
  const location = useLocation();
  const isNovaTrace = location.pathname.startsWith('/novatrace');
  // The homepage ships its own nav + footer (see microfrontends/home), so the
  // shell chrome is suppressed there the same way it is on NovaTrace.
  const isHome = location.pathname === '/';
  const hideShellChrome = isNovaTrace || isHome;
  const { isSignedIn } = useAuth();
  const prevSignedIn = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (prevSignedIn.current === false && isSignedIn === true) {
      const returnUrl = consumeReturnUrl();
      if (returnUrl) window.location.href = returnUrl;
    }
    prevSignedIn.current = isSignedIn;
  }, [isSignedIn]);

  return (
    <div className="app">
      {/* Global Navigation — hidden on NovaTrace and the homepage (both have their own) */}
      {!hideShellChrome && (
        <nav className="global-nav">
          <div className="nav-container">
            <Link to="/" className="nav-brand">
              <img src="/logo_without_name.png" alt="Starithm" className="nav-logo" />
              <span className="nav-title">Starithm</span>
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/novatrace/events" className="nav-link">NovaTrace</Link>
              {!isSignedIn && (
                <SignInButton mode="modal">
                  <button className="nav-link nav-signin-btn" onClick={saveReturnUrl}>Sign in</button>
                </SignInButton>
              )}
              {isSignedIn && <UserButton />}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="main-content">
        <QueryClientProvider client={getQueryClient()}>
          <Suspense
            fallback={
              /* Shown while a microfrontend chunk downloads — the first loading
                 state a visitor hits on a cold load. */
              <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StarithmLoader size={48} delay={0} />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomeMicrofrontend />} />
              <Route path="/novatrace/*" element={<NovaTraceMicrofrontend />} />
              <Route path="/blog/*" element={<BlogMicrofrontend />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              {/* Clerk lands here after a provider redirect (homepage OAuth buttons).
                  Without this route the handshake cannot complete. */}
              <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
            </Routes>
          </Suspense>
        </QueryClientProvider>
      </main>

      {/* Footer — hidden on NovaTrace and the homepage (both have their own) */}
      {!hideShellChrome && (
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-copyright">
              <p>&copy; 2025 Starithm. All rights reserved.</p>
              <p>Astronomer's Platform</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
