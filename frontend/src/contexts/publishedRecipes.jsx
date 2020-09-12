import React, { createContext, useReducer } from 'react';

const updatePublishedRecipe = (recipes, updatedRecipe) => {
  const nonUpdatedRecipes = recipes.filter(recipe => {
    return updatedRecipe.id !== recipe.id;
  });

  return [...nonUpdatedRecipes, updatedRecipe];
};

const removeRecipeFromPublishedRecipes = (recipes, removedRecipe) => {
  return recipes.filter(recipe => {
    return removedRecipe.id !== recipe.id;
  });
};

const recipeOrder = (a, b) => {
  const aDate = new Date(a.lastUpdate).getTime();
  const bDate = new Date(b.lastUpdate).getTime();

  if (aDate < bDate) return 1;
  if (aDate > bDate) return -1;
  return 0;
};


const reducer = (state, action) => {
  let recipes = state;
  switch (action.type) {
    case 'added':
      recipes = [...state, action.value];
      break;
    case 'updated':
      recipes = updatePublishedRecipe(state, action.value);
      break;
    case 'removed':
      recipes = removeRecipeFromPublishedRecipes(state, action.value);
      break;
    case 'set':
      recipes = action.value;
      break;
    default:
      return state;
  }

  const sortedRecipes = recipes.sort(recipeOrder);
  return sortedRecipes;
};

const initialState = [];

export const PublishedRecipesContext = createContext(initialState);

export const PublishedRecipesProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PublishedRecipesContext.Provider value={{ state, dispatch }}>
      {props.children}
    </PublishedRecipesContext.Provider>
  )
};
