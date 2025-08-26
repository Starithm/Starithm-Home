import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ThemeToggle } from '../shared/components/ThemeToggle';
import './App.css';

// Lazy load microfrontends
const HomeMicrofrontend = lazy(() => import('./microfrontends/HomeMicrofrontend'));
const NovaTraceMicrofrontend = lazy(() => import('./microfrontends/NovaTraceMicrofrontend'));

function App() {
  return (
    <div className="app">
      {/* Global Navigation */}
      <nav className="global-nav">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <img src="/logo_without_name.png" alt="Starithm" className="nav-logo" />
            <span className="nav-title text-starithm-electric-violet dark:text-starithm-platinum">Starithm</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/novatrace" className="nav-link">NovaTrace</Link>
            <ThemeToggle variant="icon" size="sm" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomeMicrofrontend />} />
            <Route path="/novatrace" element={<NovaTraceMicrofrontend />} />
            <Route path="/novatrace/status" element={<NovaTraceMicrofrontend />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/logo_without_name.png" alt="Starithm" className="footer-logo" />
            <span className="footer-title">Starithm</span>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2025 Starithm. All rights reserved.</p>
            <p>Astronomer's Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
