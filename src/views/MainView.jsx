import React, { useContext } from 'react';

import { LoggedInContext } from 'contexts/login';
import { EditableProvider } from 'contexts/editable';
import { RecipeProvider } from 'contexts/recipe';

import RecipeList from 'views/recipeList/RecipeList';
import CreateRecipe from 'views/createRecipe/CreateRecipe';

import './mainView.css';

const MainView = () => {
  const { state } = useContext(LoggedInContext);

  return (
    <div className="mainView">
      {state.loggedIn && (
        <>
          <RecipeList />

          <EditableProvider>
            <RecipeProvider>
              <CreateRecipe />
            </RecipeProvider>
          </EditableProvider>
        </>
      )}
    </div>
  )
}

export default MainView;
