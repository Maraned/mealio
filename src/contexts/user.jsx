import React, { createContext, useContext, useReducer } from 'react';

const initialState = { };

const userReducer = (state, action) => {
  switch (action.type) {
    case 'user':
      return { ...state, ...action.value };
    case 'draftRecipes': 
      return { ...state, draftRecipes: action.value }
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
