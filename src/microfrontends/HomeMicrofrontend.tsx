import React, { useEffect, useRef } from 'react';

const HomeMicrofrontend: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // For now, we'll use iframe approach
    // In production, you might want to use Module Federation or other microfrontend patterns
  }, []);

  const getHomeRoute = () => {
    if (import.meta.env.PROD) {
      // Production: Use relative URLs
      return '/home/';
    } else {
      // Development: Use localhost URLs
      return 'http://localhost:5173';
    }
  };

  return (
    <div className="microfrontend-container">
      <iframe
        ref={iframeRef}
        src={getHomeRoute()}
        title="Starithm Home"
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

export default HomeMicrofrontend;
