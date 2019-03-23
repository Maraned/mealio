import Gun from 'gun';
import 'gun/sea';
import React, { createContext, useEffect, useContext } from 'react';
import { UserContext } from 'contexts/user';
import { useTranslation } from 'react-i18next';

var gun = Gun(`${process.env.BACKEND_URL}/gun`);

export const GunContext = createContext(gun);

export const GunProvider = props => {
  const { dispatch } = useContext(UserContext);

  const autoLogin = () => {
    const user = gun.user();

    user.recall({sessionStorage: true}, ack => {
      dispatch({ type: 'user', value: user })

      user.on(data => {
        console.log('new data', data)
        dispatch({ type: 'userProfile', value: data })
      })
    })
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

