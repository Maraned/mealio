import React, { createContext, useEffect, useReducer, useContext } from 'react';
import { PublishedRecipesContext } from 'contexts/publishedRecipes';

const filterOnRecipesThatContainIngredients = (recipes, ingredientFilters) => {
  if (!recipes) {
    return [];
  }
  return recipes.filter(recipe => {
    const recipeIngredientIds = recipe.ingredients.map(ingredient => ingredient.id);
    const recipeIngredientGroupIngredientIds = recipe.ingredientGroups?.map(ingredientGroup => {
      return ingredientGroup.ingredients.map(ingredient => ingredient.id);
    }).flat();
    const allRecipeIngredientIds = [...recipeIngredientIds, ...recipeIngredientGroupIngredientIds];

    return ingredientFilters.every(ingredientFilter => {
      return allRecipeIngredientIds.includes(ingredientFilter.id);
    })
  })
};

const filterOnRecipesWithMaxAmountOfIngredients = (recipes, maxIngredientsAmount) => {
  return recipes.filter(recipe => {
    const recipeIngredientsCount = recipe.ingredients.length;
    if (recipeIngredientsCount > maxIngredientsAmount) {
      return false;
    }
    const recipeIngredientGroupIngredientsCount = recipe.ingredientGroups?.map(ingredientGroup => {
      return ingredientGroup.ingredients.map(ingredient => ingredient.id);
    }).flat().length;

    const allIngredientsCount = recipeIngredientsCount + recipeIngredientGroupIngredientsCount;
    return allIngredientsCount <= maxIngredientsAmount;
  });
};

const filterOnRecipesWithinMaxCookingTime = (recipes, maxCookingTime) => {
  return recipes.filter(recipe => {
    return parseInt(recipe.time, 10) <= parseInt(maxCookingTime, 10);
  });
};

const applyFiltering = (recipeFilter) => {
  const {
    allRecipes,
    ingredientFilters,
    maxIngredientsAmount,
    maxCookingTime
  } = recipeFilter;

  console.log('applyFiltering', recipeFilter)

  let filteredRecipes = allRecipes;
  if (ingredientFilters) {
    filteredRecipes = filterOnRecipesThatContainIngredients(
      allRecipes,
      ingredientFilters,
    );
    console.log('filteredRecipes after ingredients', filteredRecipes)
  }
  if (maxIngredientsAmount) {
    filteredRecipes = filterOnRecipesWithMaxAmountOfIngredients(
      filteredRecipes,
      maxIngredientsAmount
    );
    console.log('filteredRecipes after maxIngredientsAmount', filteredRecipes)
  }
  if (maxCookingTime) {
    filteredRecipes = filterOnRecipesWithinMaxCookingTime(
      filteredRecipes,
      maxCookingTime
    );
    console.log('filteredRecipes after maxCookingTime', filteredRecipes)
  }
  return filteredRecipes;
}

const reducer = (state, action) => {
  let filteredRecipes = [];

  let newState = state;

  switch (action.type) {
    case 'updateMaxIngredientsAmount':
      localStorage.setItem('maxIngredientsAmount', action.value);
      newState = { ...state, maxIngredientsAmount: action.value };
      break;
    case 'updateMaxCookingTime':
      localStorage.setItem('maxCookingTime', action.value);
      newState = { ...state, maxCookingTime: action.value };
      break;
    case 'updateIngredientFilters':
      localStorage.setItem('ingredientFilters', JSON.stringify(action.value));
      newState = { ...state, ingredientFilters: action.value };
      break;
    case 'update':
      newState = { ...state, ...action.value };
      break;
    case 'updateAllRecipes':
      newState = { ...state, allRecipes: action.recipes };
      break;
    default:
      return state;
  }
  filteredRecipes = applyFiltering(newState);
  console.log('filteredRecipes after', filteredRecipes)
  return { ...newState, filteredRecipes};
}

const initialState = {
  ingredientFilters: [],
  filteredRecipes: [],
  allRecipes: [],
  maxIngredientsAmount: null,
  maxCookingTime: null,
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
    const maxIngredientsAmountFromLocalStorage = localStorage.getItem('maxIngredientsAmount');
    const maxCookingTimeFromLocalStorage = localStorage.getItem('maxCookingTime');


    updatedInitialState.ingredientFilters = ingredientFiltersFromLocalStorage;
    updatedInitialState.maxIngredientsAmount = maxIngredientsAmountFromLocalStorage
      && parseInt(maxIngredientsAmountFromLocalStorage, 10);
    updatedInitialState.maxCookingTime= maxCookingTimeFromLocalStorage
      && parseInt(maxCookingTimeFromLocalStorage, 10);

    recipeFilterDispatch({ type: 'update', value: updatedInitialState });
  }, []);

  return (
    <RecipeFilterContext.Provider value={{ recipeFilters, recipeFilterDispatch }}>
      {props.children}
    </RecipeFilterContext.Provider>
  )
};
