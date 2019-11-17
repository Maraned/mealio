import React from 'react';
import './translations/i18n';

import { LoggedInProvider } from 'contexts/login';
import { UserProvider } from 'contexts/user';
import { RouterProvider } from 'contexts/router';
import { RecipeProvider } from 'contexts/recipe';
import { PendingRequestProvider } from 'contexts/pendingRequests';
import { AlertBannerProvider } from 'contexts/alertBanner';
import { FacebookProvider } from 'thirdParty/facebook/facebookProvider';

import MainView from 'views/MainView';

import './App.css';
import './vars.css';

const App = () => {
  return (
    <FacebookProvider>
      <PendingRequestProvider>
        <UserProvider>
          <LoggedInProvider>
            <RouterProvider>
              <RecipeProvider>
                <AlertBannerProvider>
                  <MainView />  
                </AlertBannerProvider>
              </RecipeProvider>
            </RouterProvider>
          </LoggedInProvider>
        </UserProvider>
      </PendingRequestProvider>
    </FacebookProvider>
  )
}

export default App;
