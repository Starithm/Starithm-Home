import React from 'react';
import { useLocation } from 'react-router-dom';
import Status from '../../microfrontends/novatrace/src/pages/StatusDashboard';
import AlertsLevel from '../../microfrontends/novatrace/src/pages/AlertLevelDashboard';
import EventLevel from '../../microfrontends/novatrace/src/pages/EventLevelDashboard';
import PublicEventPage from '../../microfrontends/novatrace/src/pages/PublicEventPage';
import NotFound from '../../microfrontends/novatrace/src/pages/NotFound';

const NovaTraceMicrofrontend: React.FC = () => {
  const location = useLocation();

  const renderContent = () => {
    const eventsMatch = location.pathname.match(/^\/novatrace\/events\/(.+)$/);
    if (eventsMatch) return <PublicEventPage canonicalId={eventsMatch[1]} />;

    switch (location.pathname) {
      case '/novatrace/status':
        return <Status />;
      case '/novatrace/events':
        return <EventLevel />;
      case '/novatrace/alerts':
        return <AlertsLevel />;
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="microfrontend-container">
      {renderContent()}
    </div>
  );
};

export default NovaTraceMicrofrontend;
