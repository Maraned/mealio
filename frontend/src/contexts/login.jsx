import React, { createContext, useReducer, useContext, useEffect } from 'react';

import { postRequest } from 'utils/request';
import { UserContext } from 'contexts/user';
import { PendingRequestContext } from 'contexts/pendingRequests';

const loginReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { ...state, loggedIn: true };
    case "logout":
      return { ...state, loggedIn: false };
    default:
      return state;
  }
};

const autoLogin = async (dispatch, userDispatch, pendingRequest) => {
  const refreshToken = localStorage.getItem('refreshToken');
  const email = localStorage.getItem('email');

  if (refreshToken) {
    try {
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
    } catch (err) {
      if (err.statusCode === 401 || err.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUserValue');
        localStorage.removeItem('refreshToken');
      }
    }
  }
  pendingRequest({ type: 'initialLoginFetch', value: false });
}

const initialState = { loggedIn: false }

export const LoggedInContext = createContext(initialState);

export function LoggedInProvider(props) {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { dispatch: userDispatch } = useContext(UserContext);
  const { dispatch: pendingRequest } = useContext(PendingRequestContext);

  useEffect(() => {
    autoLogin(dispatch, userDispatch, pendingRequest);
    // eslint-disable-next-line 
  }, [])

  return (
    <LoggedInContext.Provider value={{ state, dispatch }}>
      {props.children}
    </LoggedInContext.Provider>
  );
}

