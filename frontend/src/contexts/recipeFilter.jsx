import React, { createContext, useEffect, useReducer, useContext } from 'react';
import { PublishedRecipesContext } from 'contexts/publishedRecipes';
import { isEmpty } from 'utils/utils';
import { IngredientGroupsContext } from './ingredientGroups';


const filterOnRecipesThatContainIngredients = (recipes, ingredientFilters) => {
  console.log('filterOnRecipesThatContainIngredients', recipes)
  if (!recipes) {
    return [];
  }
  return recipes.filter(recipe => {
    const recipeIngredientIds = recipe.ingredients.map(ingredient => ingredient.id);
    const recipeIngredientGroupIngredientIds = recipe.ingredientGroups.map(ingredientGroup => {
      return ingredientGroup.ingredients.map(ingredient => ingredient.id);
    }).flat();
    const allRecipeIngredientIds = [...recipeIngredientIds, ...recipeIngredientGroupIngredientIds];

    return ingredientFilters.every(ingredientFilter => {
      return allRecipeIngredientIds.includes(ingredientFilter.id);
    })
  })
}

const applyFiltering = (recipes, ingredientFilters) => {
  let filteredRecipes = filterOnRecipesThatContainIngredients(
    recipes,
    ingredientFilters
  );
  return filteredRecipes;
}

const reducer = (state, action) => {
  let { ingredientFilters, allRecipes } = state;
  let filteredRecipes = [];

  switch (action.type) {
    case 'updateIngredientFilters':
      filteredRecipes = applyFiltering(allRecipes, action.value);
      localStorage.setItem('ingredientFilters', JSON.stringify(action.value));
      return { ...state, ingredientFilters: action.value, filteredRecipes };
    case 'update':
      const newState = { ...state, ...action.value };
      filteredRecipes = applyFiltering(newState.allRecipes, newState.ingredientFilters);
      return { ...newState, filteredRecipes };
    case 'updateAllRecipes':
      filteredRecipes = applyFiltering(action.recipes, ingredientFilters);
      return { ...state, filteredRecipes, allRecipes: action.recipes };
    default:
      return state;
  }
}

const initialState = {
  ingredientFilters: [],
  filteredRecipes: [],
  allRecipes: [],
};

export const RecipeFilterContext = createContext(initialState);


export const RecipeFilterProvider = props => {
  const [recipeFilters, recipeFilterDispatch] = useReducer(reducer, initialState);
  const { state: publishedRecipes } = useContext(PublishedRecipesContext);

  useEffect(() => {
    if (publishedRecipes) {
      recipeFilterDispatch({ type: 'updateAllRecipes', recipes: publishedRecipes });
    }
  }, [publishedRecipes]);

  useEffect(() => {
    const updatedInitialState = {};

    const ingredientFiltersFromLocalStorage = JSON.parse(
      localStorage.getItem('ingredientFilters') || '[]'
    );
    updatedInitialState.ingredientFilters = ingredientFiltersFromLocalStorage;

    recipeFilterDispatch({ type: 'update', value: updatedInitialState });
  }, []);

  return (
    <RecipeFilterContext.Provider value={{ recipeFilters, recipeFilterDispatch }}>
      {props.children}
    </RecipeFilterContext.Provider>
  )
};
