import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InfraStatus from '../../microfrontends/novatrace/src/pages/InfraStatus';
import AlertsLevel from '../../microfrontends/novatrace/src/pages/AlertLevelDashboard';
import EventLevel from '../../microfrontends/novatrace/src/pages/EventLevelDashboard';
import PublicEventPage from '../../microfrontends/novatrace/src/pages/PublicEventPage';
import SearchPage from '../../microfrontends/novatrace/src/pages/SearchPage';
import CircularEventPage from '../../microfrontends/novatrace/src/pages/CircularEventPage';
import NotFound from '../../microfrontends/novatrace/src/pages/NotFound';

const NovaTraceMicrofrontend: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/novatrace' || location.pathname === '/novatrace/') {
      navigate('/novatrace/events', { replace: true });
    }
  }, [location.pathname]);

  const renderContent = () => {
    const eventsMatch = location.pathname.match(/^\/novatrace\/events\/(.+)$/);
    if (eventsMatch) return <PublicEventPage canonicalId={eventsMatch[1]} />;

    const circularsMatch = location.pathname.match(/^\/novatrace\/circulars\/(.+)$/);
    if (circularsMatch) return <CircularEventPage eventName={decodeURIComponent(circularsMatch[1])} />;

    switch (location.pathname) {
      case '/novatrace/infra/status':
      case '/novatrace/status': // old status page was unused — repointed to infra monitoring
        return <InfraStatus />;
      case '/novatrace/events':
        return <EventLevel />;
      case '/novatrace/alerts':
        return <AlertsLevel />;
      case '/novatrace/search':
        return <SearchPage />;
      default:
        return <NotFound />;
    }
  };

  const isEventPage = /^\/novatrace\/events\/.+$/.test(location.pathname);

  return (
    <div className="microfrontend-container" style={isEventPage ? { padding: 0 } : undefined}>
      {renderContent()}
    </div>
  );
};

export default NovaTraceMicrofrontend;
