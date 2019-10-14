import React, { useContext, useReducer, createContext, useEffect } from 'react';

import scriptCache from 'utils/scriptCache';

const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
}


const initialState = [];

export const FacebookContext = createContext(initialState);

export const FacebookProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initFacebook = async () => {
    console.log('process.env.FACEBOOK_APP_ID', process.env.FACEBOOK_APP_ID)
    await scriptCache.loadSrc('https://connect.facebook.net/en_US/sdk.js');


    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '796444384148141',
        cookie: true,
        xfbml: true,
        version: 'v4.0'
      });
        
      window.FB.AppEvents.logPageView();   

      window.FB.getLoginStatus(function(response) {
        console.log('loginStatus', response)
    });
    };
  };

  useEffect(() => {
    initFacebook();    
  }, []);

  return (
    <FacebookContext.Provider value={{ state, dispatch }}>
      {props.children}
    </FacebookContext.Provider>
  ) 
};
