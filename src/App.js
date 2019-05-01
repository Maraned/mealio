import React from 'react';
import './translations/i18n';

import Header from 'views/header/Header';
import { LoggedInProvider } from 'contexts/login';
import { GunProvider } from 'contexts/gun';
import { UserProvider } from 'contexts/user';
import { RouterProvider } from 'contexts/router';
import { RecipeProvider } from 'contexts/recipe';
import { PendingRequestProvider } from 'contexts/pendingRequests';
import { AlertBannerProvider } from 'contexts/alertBanner';

import MainView from 'views/MainView';

import './App.css';
import './vars.css';

const App = () => {
  return (
    <PendingRequestProvider>
      <UserProvider>
        <GunProvider>
          <LoggedInProvider>
            <RouterProvider>
              <RecipeProvider>
                <AlertBannerProvider>
                  <Header />

                  <MainView />  
                </AlertBannerProvider>
              </RecipeProvider>
            </RouterProvider>
          </LoggedInProvider>
        </GunProvider>
      </UserProvider>
    </PendingRequestProvider>
  )
}

export default App;
