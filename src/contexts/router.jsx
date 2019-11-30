import React, { createContext, useReducer, useEffect } from 'react'; 

import Settings from 'views/settings/Settings';

const modalView = view => ({
  ModalView: view
});


const pages = {
  closeModal: modalView(null),
  settings: modalView(Settings),
}

const routerReducer = (state, action) => {
  if (action.type === 'closeModal') {
    return { ...state, ModalView: null };
  }

  return { ...state, ...pages[action.type] };
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

  // console.log('state', state)

  // const historyHandler = event => {
  //   if (event.state.page !== state.page) {
  //     console.log('event', event)
  //     console.log('event.state', event.state)
  //     const pageData = getPageData({ type: event.state.page });
  //     console.log('browserclick pageData', pageData)
  //     // const pageDataFromUrl = getPageDataFromUrl(event.state.page);
  //     // console.log('browserclick pageDataFromUrl', pageDataFromUrl)
  //     dispatch({ type: 'urlChange', pageData });
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('popstate', historyHandler);

  //   const currentPath = window.location.pathname;
  //   const pageDataFromUrl = getPageDataFromUrl(currentPath);
  //   dispatch({ type: 'urlChange', pageData: pageDataFromUrl });

  //   return () => window.removeEventListener('popstate', historyHandler)
  // }, []);

  return (
    <RouterContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RouterContext.Provider>
  ) 
};
