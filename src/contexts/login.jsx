import React, { createContext, useReducer, useContext, useEffect } from 'react';

import { postRequest } from 'utils/request';
import { UserContext } from 'contexts/user';
import { access } from 'fs';

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

const autoLogin = async (dispatch, userDispatch) => {
  const refreshToken = localStorage.getItem('refreshToken');
  const email = localStorage.getItem('email');

  if (refreshToken) {
    const response = await postRequest('login/refresh', {
      refreshToken,
      email,
    });
    
    if (response && response.accessToken) {
      const { accessToken, user } = response;
      localStorage.setItem('accessToken', accessToken);
      dispatch({ type: 'login' });
      userDispatch({ type: 'user', value: user });
    }
  }
}

const initialState = { loggedIn: false }

export const LoggedInContext = createContext(initialState);

export function LoggedInProvider(props) {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { dispatch: userDispatch } = useContext(UserContext);

  useEffect(() => {
    autoLogin(dispatch, userDispatch);
  }, [])

  return (
    <LoggedInContext.Provider value={{ state, dispatch }}>
      {props.children}
    </LoggedInContext.Provider>
  );
}

