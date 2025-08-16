import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <FileText className="h-24 w-24 text-starithm-electric-violet/30 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-starithm-rich-black mb-4">Page Not Found</h1>
          <p className="text-starithm-rich-black/70 text-lg mb-8">
            The article you're looking for doesn't exist.
          </p>
        </div>
        
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 bg-starithm-electric-violet text-white px-6 py-3 rounded-lg hover:bg-starithm-electric-violet/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blog</span>
        </Link>
      </div>
    </div>
  );
}
