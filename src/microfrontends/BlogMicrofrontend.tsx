import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlogList from '../../microfrontends/blog/src/pages/BlogList';
import BlogPost from '../../microfrontends/blog/src/pages/BlogPost';
import Roadmap from '../../microfrontends/blog/src/pages/Roadmap';
import NotFound from '../../microfrontends/blog/src/pages/NotFound';

const BlogMicrofrontend: React.FC = () => {
  return (
    <div className="microfrontend-container">
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/posts/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default BlogMicrofrontend;
