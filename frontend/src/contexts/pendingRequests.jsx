import React, { createContext, useReducer } from 'react';

const pendingRequestReducer = (state, action) => {
  switch (action.type) {
    case "initialFetch":
      return { ...state, initialFetch: action.value };
    case "initialLoginFetch":
      return { ...state, initialLoginFetch: action.value };
    case 'pendingRecipeFetch':
      return { ...state, pendingRecipeFetch: action.value };
    default:
      return state;
  }
};

const initialState = { initialLoginFetch: true }

export const PendingRequestContext = createContext(initialState);

export function PendingRequestProvider(props) {
  const [state, dispatch] = useReducer(pendingRequestReducer, initialState);
  return (
    <PendingRequestContext.Provider value={{ state, dispatch }}>
      {props.children}
    </PendingRequestContext.Provider>
  );
}

