import React, { useContext } from 'react';

import { RouterContext } from 'contexts/router';
import Modal from 'components/modal/Modal';
import AlertBannerView from 'views/alertBanner/AlertBannerView';
import MainSideMenu from './mainSideMenu/MainSideMenu';
import Breadcrumbs from 'views/breadcrumbs/Breadcrumbs';

import './mainView.css';

const MainView = () => {
  const { state: router } = useContext(RouterContext);
  const { ActiveView } = router;

  return (
    <>
      <div className="mainView">
        
        <Breadcrumbs />

        <div className="mainView__content">
          <MainSideMenu />

          {ActiveView && (
            <ActiveView />
          )}


          <AlertBannerView />
        </div>
        
        <Modal />
      </div>
    </>
  )
}

export default MainView;
