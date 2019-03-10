import React, { createContext, useReducer } from 'react'; 

import RecipeModel from 'models/recipeModel';

const recipeReducer = (state, action) => {
  switch (action.type) {
    case 'ingredients':
      return { ...state, ingredients: action.value };
    case 'name': 
      return { ...state, name: action.value };
    case 'steps': 
      return { ...state,  steps: action.value };
    case 'description': 
      return { ...state, description: action.value };
    default:
      return;
  }
};

const initialState = {...RecipeModel};

export const RecipeContext = createContext(initialState);

export const RecipeProvider = props => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RecipeContext.Provider>
  ) 
};
