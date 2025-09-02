import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@shared/components/ui/button';

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
        
        <Button asChild>
          <Link 
            to="/"
            className="inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
