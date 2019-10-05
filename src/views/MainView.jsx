import React, { useContext } from 'react';

import { RouterContext } from 'contexts/router';
import Modal from 'components/modal/Modal';
import AlertBannerView from 'views/alertBanner/AlertBannerView';
import MainSideMenu from './mainSideMenu/MainSideMenu';

import './mainView.css';

const MainView = () => {
  const { state: router } = useContext(RouterContext);
  const { ActiveView } = router;

  return (
    <div className="mainView">
      <MainSideMenu />

      {ActiveView && (
        <ActiveView />
      )}

      <Modal />

      <AlertBannerView />
    </div>
  )
}

export default MainView;
