import React, { useContext } from 'react';

import { RouterContext } from 'contexts/router';
import Modal from 'components/modal/Modal';
import AlertBannerView from 'views/alertBanner/AlertBannerView';

import './mainView.css';

const MainView = () => {
  const { state: router } = useContext(RouterContext);
  const { ActiveView } = router;

  return (
    <div className="mainView">
      {ActiveView && (
        <ActiveView />
      )}

      <Modal />

      <AlertBannerView />
    </div>
  )
}

export default MainView;
