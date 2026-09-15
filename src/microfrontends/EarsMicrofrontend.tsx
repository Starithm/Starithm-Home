import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EarsPage from '../../microfrontends/ears/src/pages/EarsPage';

/* Ears to the Universe: music made daily from newly public JWST spectral cubes.
 * /ears-to-the-universe                  latest day, first track
 * /ears-to-the-universe/:date            that day, first track
 * /ears-to-the-universe/:date/:trackId   a specific track (shareable) */
const EarsMicrofrontend: React.FC = () => (
  <div className="microfrontend-container">
    <Routes>
      <Route path="/" element={<EarsPage />} />
      <Route path="/:date" element={<EarsPage />} />
      <Route path="/:date/:trackId" element={<EarsPage />} />
    </Routes>
  </div>
);

export default EarsMicrofrontend;
