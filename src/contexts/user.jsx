import React, { createContext, useContext, useReducer } from 'react';

const initialState = { user: null, userProfile: {} };

const userReducer = (state, action) => {
  switch (action.type) {
    case 'user':
      return { ...state, user: action.value };
    case 'userProfile':
      return { ...state, userProfile: action.value || {} }
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
