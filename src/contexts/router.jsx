import React, { createContext, useReducer } from 'react'; 

import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import Settings from 'views/settings/Settings';
import MyRecipes from 'views/myRecipes/MyRecipesWrapper';
import RecipeList from 'views/recipeList/RecipeList';
import RecipeDetail from 'views/recipeDetail/RecipeDetailWrapper';
import GroceryLists from 'views/groceryList/GroceryListsWrapper';

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

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
    case 'alertBanner': 
      const banners = state.AlertBanners || [];
      return { ...state, AlertBanners: [...banners, { ...action.value, id: uuid() }] };
    case 'closeAlertBanner':
      let alertBanners = [...state.AlertBanners];
      for (let i = 0; i < state.AlertBanners.length; i++) {
        const banner = state.AlertBanners[i];
        if (banner.id === action.value) {
          alertBanners.splice(i, 1);
          break;
        }
      }
      return { ...state, AlertBanners: alertBanners };
      
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
