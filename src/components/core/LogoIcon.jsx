import './logoIcon.css';

import React from 'react';
import cc from 'classcat';

import Fork from 'components/core/customIcons/fork';
import Knife from 'components/core/customIcons/knife';

export default function LogoIcon({ animate, pauseAnimation, animateOnce, size }) {
  return (
    <div className={cc(['logoIcon flex', { 
      'logoIcon--animate': animate,
      'logoIcon--animate--pause': pauseAnimation,
      'logoIcon--animateOnce': animateOnce,
    }])}>
      <Fork size={2} />
      <Knife size={2} />
    </div>
  );
}