import React from 'react';
import { Homepage } from '../../microfrontends/home/components/Homepage';

const HomeMicrofrontend: React.FC = () => {
  return (
    <div className="microfrontend-container">
      <Homepage />
    </div>
  );
};

export default HomeMicrofrontend;
