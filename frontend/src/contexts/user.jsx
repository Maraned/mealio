import React, { createContext, useReducer } from 'react';

const initialState = { };

const getStateDiff = (prevState, newState) => {
  const diff = [];
  const omittedAttributes = ['publishedRecipes', 'draftRecipes'];
  for (const key of Object.keys(newState)) {
    if (omittedAttributes.includes(key)) {
      continue;
    }

    if (Array.isArray(newState[key])) {
      if (newState[key].length !== prevState[key].length) {
        diff.push(key);
      }
    } else {
      if (newState[key] !== prevState[key]) {
        diff.push(key);
      }
    }
  }
  return diff;
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'user':
      return { ...state, ...action.value };
    case 'draftRecipes':
      return { ...state, draftRecipes: action.value };
    case 'updated':
      const stateDiff = getStateDiff(state, action.value)
      if (stateDiff.length) {
        return { ...state, ...action.value };
      } else {
        return state;
      }
    default:
      return state;
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
