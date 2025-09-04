import React from 'react';
import { NotFound } from '@shared/components';

export function HomeNotFound() {
  return (
    <NotFound 
      title="Page Not Found"
      description="The page you're looking for doesn't exist."
      backLinkText="Back to Home"
      backLinkPath="/"
    />
  );
}
