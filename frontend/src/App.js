import React from 'react';
import './translations/i18n';

import { LoggedInProvider } from 'contexts/login';
import { UserProvider } from 'contexts/user';
import { RouterProvider } from 'contexts/router';
import { RecipeProvider } from 'contexts/recipe';
import { PendingRequestProvider } from 'contexts/pendingRequests';
import { AlertBannerProvider } from 'contexts/alertBanner';
import { AllIngredientsProvider } from 'contexts/allIngredients';
import { FacebookProvider } from 'thirdParty/facebook/facebookProvider';
import { WebSocketProvider } from 'contexts/webSocket';
import { DraftRecipesProvider } from 'contexts/draftRecipes';
import { PublishedRecipesProvider } from 'contexts/publishedRecipes';
import { IngredientGroupsProvider } from 'contexts/ingredientGroups';

import MainView from 'views/MainView';

import './App.css';
import './vars.css';
import './icons.css';

const App = () => {
  return (
    <FacebookProvider>
      <PendingRequestProvider>
        <UserProvider>
          <RouterProvider>
            <LoggedInProvider>
              <RecipeProvider>
                <DraftRecipesProvider>
                  <PublishedRecipesProvider>
                    <AlertBannerProvider>
                      <IngredientGroupsProvider>
                        <AllIngredientsProvider>
                          <WebSocketProvider>
                            <MainView />
                          </WebSocketProvider>
                        </AllIngredientsProvider>
                      </IngredientGroupsProvider>
                    </AlertBannerProvider>
                  </PublishedRecipesProvider>
                </DraftRecipesProvider>
              </RecipeProvider>
            </LoggedInProvider>
          </RouterProvider>
        </UserProvider>
      </PendingRequestProvider>
    </FacebookProvider>
  )
}

export default App;
