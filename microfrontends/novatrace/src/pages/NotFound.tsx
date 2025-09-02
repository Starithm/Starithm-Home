import React from 'react';
import { NotFound } from '@shared/components';

export default function NovaTraceNotFound() {
  return (
    <NotFound 
      title="404 Page Not Found"
      description="Did you forget to add the page to the router?"
      backLinkText="Go Back"
      backLinkPath="/"
      icon={<div className="text-red-500">⚠️</div>}
    />
  );
}
