import React from 'react';
import './translations/i18n';

import Header from 'views/header/Header';
import { LoggedInProvider } from 'contexts/login';
import { GunProvider } from 'contexts/gun';
import { UserProvider } from 'contexts/user';
import { RouterProvider } from 'contexts/router';

import MainView from 'views/MainView';

import './App.css';
import './vars.css';

const App = () => {
  return (
    <UserProvider>
      <GunProvider>
        <LoggedInProvider>
          <RouterProvider>
            <Header />

            <MainView />
          </RouterProvider>
        </LoggedInProvider>
      </GunProvider>
    </UserProvider>
  )
}

export default App;
