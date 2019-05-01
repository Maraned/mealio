import React, { createContext, useReducer } from 'react'; 

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'add': 
      const banners = state || [];
      return [...banners, { ...action.value, id: uuid() }];
    case 'close':
      let alertBanners = [...state];
      for (let i = 0; i < state.length; i++) {
        const banner = state[i];
        if (banner.id === action.value) {
          alertBanners.splice(i, 1);
          break;
        }
      }
      return [...alertBanners];
  }
}


const initialState = [];

export const AlertBannerContext = createContext(initialState);

export const AlertBannerProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AlertBannerContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AlertBannerContext.Provider>
  ) 
};
