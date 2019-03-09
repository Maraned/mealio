import React, { createContext, useReducer } from 'react';

const loginReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { ...state, loggedIn: true };
    case "logout":
      return { ...state, loggedIn: false };
    default:
      return;
  }
};

const initialState = { loggedIn: !!localStorage.getItem('accessToken') }

export const LoggedInContext = createContext(initialState);

export function LoggedInProvider(props) {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  return (
    <LoggedInContext.Provider value={{ state, dispatch }}>
      {props.children}
    </LoggedInContext.Provider>
  );
}

