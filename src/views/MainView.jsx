import React, { useContext } from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import Modal from 'components/modal/Modal';
import AlertBannerView from 'views/alertBanner/AlertBannerView';
import MainSideMenu from './mainSideMenu/MainSideMenu';
import Breadcrumbs from 'views/breadcrumbs/Breadcrumbs';
import Logo from 'views/logo/Logo';

import ViewRoutes from './ViewRoutes';

import './mainView.css';

const MainView = () => {
  return (
    <>
      <div className="mainView">
        <Router>
          
          {/* <div className="mainView__topContent"> */}
            <Logo />
          {/* </div> */}
            <Breadcrumbs />

          <div className="mainView__content">
            <MainSideMenu />

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
