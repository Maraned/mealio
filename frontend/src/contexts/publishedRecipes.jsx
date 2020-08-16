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

const reducer = (state, action) => {
  switch (action.type) {
    case 'added':
      return [...state, action.value];
    case 'updated':
      return updatePublishedRecipe(state, action.value);
    case 'removed':
      return removeRecipeFromPublishedRecipes(state, action.value);
    case 'set':
      return action.value;
    default:
      return state;
  }
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
