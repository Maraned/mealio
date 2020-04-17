import React, { createContext, useReducer } from 'react'; 

const updateDraftRecipe = (recipes, updatedRecipe) => {
  const nonUpdatedRecipes = recipes.filter(recipe => {
    return updatedRecipe.id !== recipe.id;
  });

  return [...nonUpdatedRecipes, updatedRecipe];
};

const removeRecipeFromDrafts = (recipes, removedRecipe) => {
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
}

const reducer = (state, action) => {
  let recipes = state;
  switch (action.type) {
    case 'added':
      recipes = [...state, action.value];
      break;
    case 'updated':
      recipes = updateDraftRecipe(state, action.value);
      break;
    case 'removed':
      recipes = removeRecipeFromDrafts(state, action.value);
      break;
    case 'update':
      recipes = action.value;
      break;
    case 'set':
      recipes = action.value;
      break;
    default:
      return state;
  }

  return recipes.sort(recipeOrder);
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
