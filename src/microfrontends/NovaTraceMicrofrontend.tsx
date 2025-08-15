import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const NovaTraceMicrofrontend: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const location = useLocation();

  useEffect(() => {
    // For now, we'll use iframe approach
    // In production, you might want to use Module Federation or other microfrontend patterns
  }, []);

  // Determine the correct route for NovaTrace microfrontend
  const getNovaTraceRoute = () => {
    if (import.meta.env.PROD) {
      // Production: Use relative URLs
      if (location.pathname === '/novatrace/status') {
        return '/novatrace/status';
      }
      return '/novatrace/';
    } else {
      // Development: Use localhost URLs
      if (location.pathname === '/novatrace/status') {
        return 'http://localhost:5174/status';
      }
      return 'http://localhost:5174/';
    }
  };

  return (
    <div className="microfrontend-container">
      <iframe
        ref={iframeRef}
        src={getNovaTraceRoute()}
        title="NovaTrace"
        className="microfrontend-iframe"
        style={{
          width: '100%',
          height: 'calc(100vh - 64px)', // Subtract nav height only
          border: 'none',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};

export default NovaTraceMicrofrontend;
