import React, { useEffect, useRef } from 'react';

const NovaTraceMicrofrontend: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // For now, we'll use iframe approach
    // In production, you might want to use Module Federation or other microfrontend patterns
  }, []);

  return (
    <div className="microfrontend-container">
      <iframe
        ref={iframeRef}
        src="http://localhost:5174/status"
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
