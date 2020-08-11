import React, { createContext, useReducer } from 'react';

import Settings from 'views/settings/Settings';
import GroceryLists from 'views/groceryList/GroceryListsWrapper';
import NewIngredient from 'components/ingredientList/NewIngredientWrapper';

const modalView = view => ({
  ModalView: view
});


const pages = {
  closeModal: modalView(null),
  settings: modalView(Settings),
  groceryLists: modalView(GroceryLists),
  newIngredient: modalView(NewIngredient),
}

const routerReducer = (state, action) => {
  console.log('routerReducer', {state, action })
  if (action.type === 'closeModal') {
    return { ...state, ModalView: null };
  }

  return {
    ...state,
    ...pages[action.type],
    ModalSize: action.size,
    ModalData: { ...action.value },
  };
};

const initialState = { ModalView: null, breadcrumbs: [] };

export const RouterContext = createContext(initialState);

export const RouterProvider = props => {
  const [state, dispatch] = useReducer(routerReducer, initialState);

  console.log('routerProvider', { state })

  return (
    <RouterContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RouterContext.Provider>
  );
};
