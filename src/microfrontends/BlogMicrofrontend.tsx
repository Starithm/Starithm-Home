import React from 'react';

const BlogMicrofrontend: React.FC = () => {
  return (
    <div className="microfrontend-container">
      <iframe
        src="http://localhost:5175"
        title="Blog Microfrontend"
        className="microfrontend-iframe"
        style={{
          width: '100%',
          height: 'calc(100vh - 120px)', // Adjust for nav and footer
          border: 'none',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default BlogMicrofrontend;
