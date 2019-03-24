import Gun from 'gun';
import 'gun/sea';
import 'gun/lib/unset.js';
import 'gun/lib/path.js';

import React, { createContext, useEffect, useContext } from 'react';
import { UserContext } from 'contexts/user';
import { PendingRequestContext } from 'contexts/pendingRequests';

const backendURL = process.env.BACKEND_URL || 'http://localhost:3001'
var gun = Gun(`${backendURL}/gun`);

export const GunContext = createContext(gun);

export const GunProvider = props => {
  const { dispatch } = useContext(UserContext);
  const { dispatch: pendingRequestDispatch } = useContext(PendingRequestContext);

  const autoLogin = () => {

    pendingRequestDispatch({ type: 'initialFetch', value: true });

    const user = gun.user();
    user.recall({ sessionStorage: true }, ack => {
      pendingRequestDispatch({ type: 'initialFetch', value: false });
      dispatch({ type: 'user', value: user })
      user.on(data => {
        dispatch({ type: 'userProfile', value: data })
      })
    })

    setTimeout(() => {
      pendingRequestDispatch({ type: 'initialFetch', value: false });
    }, 1000);
  }

  useEffect(() => {
    autoLogin();
  }, []);
  
  return (
    <GunContext.Provider value={gun}>
      {props.children}
    </GunContext.Provider>
  );
};

