import React, { createContext, useReducer, useEffect, useState, useRef, useContext } from 'react'; 

import RecipeModel from 'models/recipeModel';
import { ArrayEqual } from 'utils/utils';
import { postRequest } from 'utils/request';
import { DraftRecipesContext } from 'contexts/draftRecipes';
import { PublishedRecipesContext } from 'contexts/publishedRecipes';

const isNumberBetweenLimits = (number, lowerLimit, upperLimit) => {
  const isNumber = !isNaN(number);
  const isWithinLowerLimit = number >= lowerLimit;
  const isWithinUpperLimit = number <= upperLimit;

  return isNumber && isWithinLowerLimit && isWithinUpperLimit;
};

const updateRecipe = async (newState, dispatch) => {
  const newSavedDate = new Date();

  const response = await postRequest('recipes/createUpdate', {
    recipe: { ...newState, lastUpdate: newSavedDate },
    id: newState.author.id,
  });

  const { status, draftId, recipe: { lastUpdate } } = response;
  if (status === 'created') {
    dispatch({ type: 'update', value: { id: draftId, lastUpdate } });
  }
}

const recipeReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'ingredients':
      newState = { ...state, ingredients: [...action.value] };
      break;
    case 'name': 
      newState = { ...state, name: action.value };
      break;
    case 'steps': 
      newState = { ...state,  steps: action.value };
      break;
    case 'description': 
      newState = { ...state, description: action.value };
      break;
    case 'images':
      newState = { ...state, images: action.value };
      break;
    case 'defaultPortions':
      newState = isNumberBetweenLimits(action.value, 1, 8) ? { ...state, defaultPortions: action.value } : state;
      break;
    case 'portions':
      newState = isNumberBetweenLimits(action.value, 1, 8) ? { ...state, portions: action.value } : state;
      break;
    case 'time':
      newState = { ...state, time: action.value };
      break;
    case 'id':
      newState = { ...state, id: action.value };
      break;
    case 'update':
      newState = { ...state, ...action.value };
      break;
    case 'draft':
      newState = { ...state, draft: action.value };
      break;
    case 'recipe':
      newState = { ...state, ...action.value };
      break;
    case 'reset':
      newState = { ...RecipeModel };
      break;
    case 'unset':
      break;
  }

  if (!newState.author && action.author) {
    newState.author = action.author;
  }

  return newState;
};

const initialState = {...RecipeModel};

export const RecipeContext = createContext(initialState);

export const RecipeProvider = props => {
  const { state: draftRecipes } = useContext(DraftRecipesContext);
  const { state: publishedRecipes } = useContext(PublishedRecipesContext);
  const initialRecipeState = props.recipe || initialState;
  const [state, dispatch] = useReducer(recipeReducer, initialRecipeState);
  const [previousState, setPreviousState] = useState({...initialRecipeState});
  const updateTimer = useRef(null);

  useEffect(() => {
    const { 
      ingredients, 
      name,
      images,
    } = state;
    const { 
      ingredients: prevIngredients,
      name: prevName,
      images: prevImages,
    } = previousState;

    const ingredientsChanged = !ArrayEqual(ingredients, prevIngredients);
    const nameChanged = name !== prevName;
    const imagesChanged = !ArrayEqual(images, prevImages);

    if (nameChanged || ingredientsChanged || imagesChanged) {
      clearTimeout(updateTimer.current);
      updateTimer.current = setTimeout(() => updateRecipe(state, dispatch), 5000);
      setPreviousState(state);
    }
  }, [state, previousState]);

  useEffect(() => {
    if (draftRecipes && publishedRecipes) {
      const recipe = [...draftRecipes, ...publishedRecipes].find(existingRecipe => {
        return existingRecipe.id === state.id
      });
      if (recipe) {
        dispatch({ type: 'update', value: recipe });
      }
    }
  }, [draftRecipes, publishedRecipes]);

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RecipeContext.Provider>
  ) 
};
