import React, { createContext, useReducer } from 'react'; 

const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return action.value;
  }
};

const initialState = [];

export const DraftRecipesContext = createContext(initialState);

export const DraftRecipesProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DraftRecipesContext.Provider value={{ state, dispatch }}>
      {props.children}
    </DraftRecipesContext.Provider>
  ) 
};
