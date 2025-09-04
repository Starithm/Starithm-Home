import React from 'react';
import { NotFound } from '@shared/components';

export default function BlogNotFound() {
  return (
    <NotFound 
      title="Page Not Found"
      description="The article you're looking for doesn't exist."
      backLinkText="Back to Blog"
      backLinkPath="/"
    />
  );
}
