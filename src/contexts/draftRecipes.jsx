import React, { createContext, useReducer } from 'react'; 

const updateDraftRecipe = (recipes, updatedRecipe) => {
  const nonUpdatedRecipes = recipes.filter(recipe => {
    return updatedRecipe.id !== recipe.id;
  });

  return [...nonUpdatedRecipes, updatedRecipe];
}

const removeRecipeFromDrafts = (recipes, removedRecipe) => {
  return recipes.filter(recipe => {
    return removedRecipe.id !== recipe.id;
  });
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'added':
      return [...state, action.value];
    case 'updated':
      return updateDraftRecipe(state, action.value);
    case 'removed':
      return removeRecipeFromDrafts(state, action.value);
    case 'update':
      return action.value;
  }
};

const initialState = [];

export const DraftRecipesContext = createContext(initialState);

export const DraftRecipesProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DraftRecipesContext.Provider value={{ state, dispatch }}>
      {props.children}
    </DraftRecipesContext.Provider>
  ) 
};
