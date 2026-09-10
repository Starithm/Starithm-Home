import React, { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import InfraStatus from '../../microfrontends/novatrace/src/pages/InfraStatus';
import AlertsLevel from '../../microfrontends/novatrace/src/pages/AlertLevelDashboard';
import EventLevel from '../../microfrontends/novatrace/src/pages/EventLevelDashboard';
import EventRecordPage from '../../microfrontends/novatrace/src/pages/EventRecordPage';
import SearchPage from '../../microfrontends/novatrace/src/pages/SearchPage';
import CircularEventPage from '../../microfrontends/novatrace/src/pages/CircularEventPage';
import CircularArchive from '../../microfrontends/novatrace/src/pages/CircularArchive';
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
    if (eventsMatch) return <EventRecordPage canonicalId={eventsMatch[1]} />;

    const circularsMatch = location.pathname.match(/^\/novatrace\/circulars\/(.+)$/);
    if (circularsMatch) return <CircularEventPage eventName={decodeURIComponent(circularsMatch[1])} />;

    switch (location.pathname) {
      case '/novatrace/infra/status':
      case '/novatrace/status': // old status page was unused — repointed to infra monitoring
        return <InfraStatus />;
      case '/novatrace/events':
        return <EventLevel />;
      case '/novatrace/circular-archive':
        return <CircularArchive />;
      // /alerts was never an alerts page — it is an archive of GCN circulars. Redirect so
      // existing links and indexed URLs keep working.
      case '/novatrace/alerts':
        return <Navigate to="/novatrace/circular-archive" replace />;
      // Legacy dashboard kept reachable: it is still the only surface exposing the JS9
      // FITS viewer, which the archive popup does not yet wire up.
      case '/novatrace/alerts-legacy':
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
