import React from 'react';
import { Homepage } from '../../microfrontends/home/components/Homepage';

const HomeMicrofrontend: React.FC = () => {
  // Full-bleed: the homepage draws its own section backgrounds edge to edge.
  return (
    <div className="microfrontend-container" style={{ padding: 0 }}>
      <Homepage />
    </div>
  );
};

export default HomeMicrofrontend;
