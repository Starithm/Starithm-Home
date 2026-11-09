import React from 'react';
import StagePage from '../../microfrontends/voyager/src/pages/StagePage';

/* The concert stage for the Voyager 1 event: three full-screen scenes, kept apart from the public
 * /voyager-1 page and its countdown. Not linked from anywhere. */
const VoyagerStageMicrofrontend: React.FC = () => <StagePage />;

export default VoyagerStageMicrofrontend;
