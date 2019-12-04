import React, { createContext, useReducer, useEffect } from 'react'; 

import Settings from 'views/settings/Settings';
import GroceryLists from 'views/groceryList/GroceryListsWrapper';

const modalView = view => ({
  ModalView: view
});


const pages = {
  closeModal: modalView(null),
  settings: modalView(Settings),
  groceryLists: modalView(GroceryLists)
}

const routerReducer = (state, action) => {
  if (action.type === 'closeModal') {
    return { ...state, ModalView: null };
  }

  return { ...state, ...pages[action.type], ModalData: action.value };
};

const initialState = { ModalView: null, breadcrumbs: [] };

export const RouterContext = createContext(initialState);

export const RouterProvider = props => {
  const [state, dispatch] = useReducer(routerReducer, initialState);

  return (
    <RouterContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RouterContext.Provider>
  );
};
