import React, { createContext, useReducer } from 'react'; 

import RecipeModel from 'models/recipeModel';

const isNumberBetweenLimits = (number, lowerLimit, upperLimit) => {
  const isNumber = !isNaN(number);
  const isWithinLowerLimit = number >= lowerLimit;
  const isWithinUpperLimit = number <= upperLimit;

  return isNumber && isWithinLowerLimit && isWithinUpperLimit;
}

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
    case 'images':
      return { ...state, images: action.value };
    case 'defaultPortions':
      return isNumberBetweenLimits(action.value, 1, 8) ? { ...state, defaultPortions: action.value } : state;
    case 'portions':
      return isNumberBetweenLimits(action.value, 1, 8) ? { ...state, portions: action.value } : state;
    case 'time':
      return { ...state, time: action.value };
    case 'id':
      return { ...state, id: action.value };
    case 'draft':
      return { ...state, draft: action.value };
    case 'recipe':
      return { ...state, ...action.value };
    case 'reset':
      return { ...RecipeModel };
    case 'unset':
      return false;
  }
};

const initialState = {...RecipeModel};

export const RecipeContext = createContext(initialState);

export const RecipeProvider = props => {
  const [state, dispatch] = useReducer(recipeReducer, props.recipe || initialState);

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RecipeContext.Provider>
  ) 
};
