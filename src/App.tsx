import React, { Suspense, lazy, useEffect, useRef } from 'react';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { SignInButton, UserButton, useAuth } from '@clerk/react';
import '../shared/styles/globals.css';
import { getQueryClient } from '@shared/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { saveReturnUrl, consumeReturnUrl } from '@shared/lib/auth';

// Lazy load microfrontends
const HomeMicrofrontend = lazy(() => import('./microfrontends/HomeMicrofrontend'));
const NovaTraceMicrofrontend = lazy(() => import('./microfrontends/NovaTraceMicrofrontend'));
const BlogMicrofrontend = lazy(() => import('./microfrontends/BlogMicrofrontend'));

function App() {
  const location = useLocation();
  const isNovaTrace = location.pathname.startsWith('/novatrace');
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
      {/* Global Navigation — hidden on NovaTrace (it has its own header) */}
      {!isNovaTrace && (
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
              {isSignedIn && <UserButton afterSignOutUrl="/" />}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="main-content">
        <QueryClientProvider client={getQueryClient()}>
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomeMicrofrontend />} />
              <Route path="/novatrace/*" element={<NovaTraceMicrofrontend />} />
              <Route path="/blog/*" element={<BlogMicrofrontend />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
            </Routes>
          </Suspense>
        </QueryClientProvider>
      </main>

      {/* Footer — hidden on NovaTrace */}
      {!isNovaTrace && (
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
