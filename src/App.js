import React, { useContext } from 'react';
import './translations/i18n';

import Header from 'views/header/Header';
import { LoggedInProvider, LoggedInContext } from 'contexts/login';
import { GunProvider } from 'contexts/gun';

import MainView from 'views/MainView';

import './App.css';
import './vars.css';

const App = () => {
  return (
    <LoggedInProvider>
      <GunProvider>
        <Header />

        <MainView />
      </GunProvider>
    </LoggedInProvider>
  )
}

export default App;
