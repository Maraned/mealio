import React, { useContext } from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { RouterContext } from 'contexts/router';
import Modal from 'components/modal/Modal';
import AlertBannerView from 'views/alertBanner/AlertBannerView';
import MainSideMenu from './mainSideMenu/MainSideMenu';
import Breadcrumbs from 'views/breadcrumbs/Breadcrumbs';

import ViewRoutes from './ViewRoutes';

import './mainView.css';

const MainView = () => {
  const { state: router } = useContext(RouterContext);
  // const { ActiveView } = router;

  return (
    <>
      <div className="mainView">
        <Router>
          
          <Breadcrumbs />

          <div className="mainView__content">
            <MainSideMenu />

            {/* {ActiveView && (
              <ActiveView />
            )} */}
            <ViewRoutes />

            <AlertBannerView />
          </div>
          
          <Modal />
        </Router>
      </div>
    </>
  )
}

export default MainView;
