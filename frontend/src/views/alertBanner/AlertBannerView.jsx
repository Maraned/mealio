import './alertBannerView.css';

import React, { useContext } from 'react';
import AlertBanner from './AlertBanner';

import { AlertBannerContext } from 'contexts/alertBanner';

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
  const { state: alertBanners, dispatch } = useContext(AlertBannerContext);

  const removeAfterDelay = id => () => {
    dispatch({ type: 'close' , value: id });
  }

  return (
    <div className="alertBannerView">
      <PoseGroup>
        {alertBanners && alertBanners.map((alertBanner, index) => alertBanner && (
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
