import React from 'react';
import { useLocation } from 'react-router-dom';
import BlogList from '../../microfrontends/blog/src/pages/BlogList';
import Roadmap from '../../microfrontends/blog/src/pages/Roadmap';
import NotFound from '../../microfrontends/blog/src/pages/NotFound';

const BlogMicrofrontend: React.FC = () => {
  const location = useLocation();

  const renderContent = () => {
    if (location.pathname === '/blog/roadmap') {
      return <Roadmap />;
    } else if (location.pathname === '/blog') {
      return <BlogList />;
    } else {
      return <NotFound />;
    }
  };

  return (
    <div className="microfrontend-container">
      {renderContent()}
    </div>
  );
};

export default BlogMicrofrontend;
