import React, { createContext, useReducer } from 'react'; 

import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import Settings from 'views/settings/Settings';
import MyRecipes from 'views/myRecipes/MyRecipesWrapper';
import RecipeList from 'views/recipeList/RecipeList';
import RecipeDetail from 'views/recipeDetail/RecipeDetailWrapper';
import GroceryLists from 'views/groceryList/GroceryListsWrapper';

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
    case 'recipeDetail':
      return { ...state, ActiveView: RecipeDetail };
    case 'groceryLists':
      return { ...state, ModalView: GroceryLists, ModalData: action.value };      
  }
};

const initialState = { ActiveView: RecipeList, ModalView: null };

export const RouterContext = createContext(initialState);

export const RouterProvider = props => {
  const [state, dispatch] = useReducer(routerReducer, initialState);

  return (
    <RouterContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RouterContext.Provider>
  ) 
};
