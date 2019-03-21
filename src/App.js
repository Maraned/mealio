import React, { useContext } from 'react';
import './translations/i18n';

import Header from 'views/header/Header';
import { LoggedInProvider, LoggedInContext } from 'contexts/login';
import { GunProvider } from 'contexts/gun';
import { UserProvider } from 'contexts/user';
import { RouterProvider } from 'contexts/router';

import MainView from 'views/MainView';

import './App.css';
import './vars.css';

const App = () => {
  return (
    <LoggedInProvider>
      <GunProvider>
        <UserProvider>
          <RouterProvider>
            <Header />

            <MainView />
          </RouterProvider>
        </UserProvider>
      </GunProvider>
    </LoggedInProvider>
  )
}

export default App;
