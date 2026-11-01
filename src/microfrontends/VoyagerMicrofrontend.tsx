import React from 'react';
import VoyagerPage from '../../microfrontends/voyager/src/pages/VoyagerPage';

/* Voyager 1 at one light-day from Earth (19 Nov 2026): live distance, DSN contact and the
 * downlink as music. Built with Space Art Lab for the event screen. */
const VoyagerMicrofrontend: React.FC = () => (
  <div className="microfrontend-container">
    <VoyagerPage />
  </div>
);

export default VoyagerMicrofrontend;
