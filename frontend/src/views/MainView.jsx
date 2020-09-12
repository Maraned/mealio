import './mainView.css';

import React from 'react';

import { useLocation } from 'react-router-dom';
import cc from 'classcat';

import AlertBannerView from 'views/alertBanner/AlertBannerView';
import MainSideMenu from './mainSideMenu/MainSideMenu';
import Breadcrumbs from 'views/breadcrumbs/Breadcrumbs';
import Logo from 'views/logo/Logo';

import ViewRoutes from './ViewRoutes';
import ModalRoutes from './ModalRoutes';

const MainContentView = () => {
  const location = useLocation();
  const modalIsOpen = location.state && location.state.modal;

  return (
    <div className={cc(['mainView__content', {
      'disablePointerEvents': modalIsOpen
    }])}>
      <MainSideMenu />

      <ViewRoutes />
      <ModalRoutes />

      <AlertBannerView />
    </div>
  );
}

const MainView = () => {
  return (
    <>
      <div className="mainView">
        <Logo />
        <Breadcrumbs />

        <MainContentView />
      </div>
    </>
  )
}

export default MainView;
