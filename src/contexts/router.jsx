import React, { createContext, useReducer } from 'react'; 

import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import Settings from 'views/settings/Settings';
import MyRecipes from 'views/myRecipes/MyRecipesWrapper';
import RecipeList from 'views/recipeList/RecipeList';

const routerReducer = (state, action) => {
  switch (action.type) {
    case 'createRecipe':
      return { ...state, ActiveView: CreateRecipeView };
    case 'settings':
      return { ...state, ModalView: Settings };
    case 'myRecipes':
      return { ...state, ActiveView: MyRecipes };
    case 'closeModal':
      return { ...state, ModalView: null };
    case 'recipeList':
      return { ...state, ActiveView: RecipeList };
  }
};

const initialState = { ActiveView: MyRecipes, ModalView: null };

export const RouterContext = createContext(initialState);

export const RouterProvider = props => {
  const [state, dispatch] = useReducer(routerReducer, initialState);

  return (
    <RouterContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RouterContext.Provider>
  ) 
};
