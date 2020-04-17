import React, { createContext, useReducer } from 'react';

const initialState = { };

const userReducer = (state, action) => {
  switch (action.type) {
    case 'user':
      return { ...state, ...action.value };
    case 'draftRecipes': 
      return { ...state, draftRecipes: action.value }
    default:
      return state;
  }
};

export const UserContext = createContext(initialState);

export const UserProvider = props => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {props.children}
    </UserContext.Provider>
  )
}
