import React, { createContext, useReducer } from 'react'; 

const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return action.value;
  }
};

const initialState = [];

export const PublishedRecipesContext = createContext(initialState);

export const PublishedRecipesProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PublishedRecipesContext.Provider value={{ state, dispatch }}>
      {props.children}
    </PublishedRecipesContext.Provider>
  ) 
};
