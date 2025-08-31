import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NovaTraceMicrofrontend: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for navigation messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'navigate') {
        navigate(event.data.path);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  // Determine the correct route for NovaTrace microfrontend
  const getNovaTraceRoute = () => {
    if (import.meta.env.PROD) {
      // Production: Use relative URLs
      if (location.pathname === '/novatrace/status') {
        return '/novatrace/status';  // This will be rewritten to /novatrace/index.html by Vercel
      }
      if (location.pathname === '/novatrace/events') {
        return '/novatrace/events';  // This will be rewritten to /novatrace/index.html by Vercel
      }
      return '/novatrace/';  // This will be rewritten to /novatrace/index.html by Vercel
    } else {
      // Development: Use localhost URLs
      if (location.pathname === '/novatrace/status') {
        return 'http://localhost:5174/status';
      }
      if (location.pathname === '/novatrace/events') {
        return 'http://localhost:5174/events';
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
