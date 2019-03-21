import React, { createContext, useReducer } from 'react'; 

import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import Settings from 'views/settings/Settings';

const routerReducer = (state, action) => {
  switch (action.type) {
    case 'createRecipe':
      return { ...state, ActiveView: CreateRecipeView };
    case 'settings':
      return { ...state, ModalView: Settings };
    case 'closeModal':
      return { ...state, ModalView: null };
  }
};

const initialState = { ActiveView: CreateRecipeView, ModalView: null };

export const RouterContext = createContext(initialState);

export const RouterProvider = props => {
  const [state, dispatch] = useReducer(routerReducer, initialState);

  return (
    <RouterContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RouterContext.Provider>
  ) 
};
