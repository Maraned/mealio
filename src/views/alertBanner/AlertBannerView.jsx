import React, { useState, useEffect, useContext } from 'react';
import AlertBanner from './AlertBanner';

import './alertBannerView.css';

import { RouterContext } from 'contexts/router';


import posed, { PoseGroup } from 'react-pose';
const AlertBannerPose = posed.div({
  enter: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -20,
    opacity: 0,
  }
});

const AlertBannerView = () => {
  const { state: router, dispatch } = useContext(RouterContext);
  const { AlertBanners } = router;

  const removeAfterDelay = id => () => {
    dispatch({ type: 'closeAlertBanner' , value: id });
  }

  return (
    <div className="alertBannerView">
      <PoseGroup>
        {AlertBanners && AlertBanners.map((alertBanner, index) => alertBanner && (
          <AlertBannerPose key={alertBanner.id}>
            <AlertBanner 
              text={alertBanner.text}
              type={alertBanner.type}
              delay={alertBanner.delay} 
              onRemove={removeAfterDelay(alertBanner.id)}
            />
          </AlertBannerPose>
        ))}
      </PoseGroup>
    </div>
  );
};

export default AlertBannerView;
