import React, { createContext, useEffect, useReducer, useContext } from 'react';
import { PublishedRecipesContext } from 'contexts/publishedRecipes';

const filterOnRecipesThatContainIngredients = (recipes, ingredientFilters) => {
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

const sortByName = (recipes, sortDirection) => {
  return recipes.sort((a, b) => {
    if (sortDirection === 'asc') {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }
    if (a.name > b.name) return -1;
    if (a.name < b.name) return 1;
    return 0;
  });
};

const sortByScore = (recipes, sortDirection) => {
  return recipes.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.collectionCount < b.collectionCount;
    }
    return a.collectionCount > b.collectionCount;
  })
};

const sortByPublishedDate = (recipes, sortDirection) => {
  return recipes.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.publishedDate < b.publishedDate
    }
    return a.publishedDate > b.publishedDate
  });
};

const getIngredientsFromFilteredRecipes = (recipes) => {
  const ingredientOptions = recipes.map(recipe => {
    const recipeIngredientOptions = recipe.ingredients.map(ingredient => ({
      id: ingredient.id,
      name: ingredient.name,
    }));

    const recipeIngredientGroupIngredientOptions = recipe.ingredientGroups?.map(ingredientGroup => {
      return ingredientGroup.ingredients.map(ingredient => ({
        id: ingredient.id,
        name: ingredient.name,
      }));
    }).flat();

    const allRecipeIngredientOptions = [
      ...recipeIngredientOptions,
      ...recipeIngredientGroupIngredientOptions
    ];
    return allRecipeIngredientOptions;
  }).flat();

  const allIngredientOptions = [];
  for (const option of ingredientOptions) {
    const existingIngredient = allIngredientOptions.find(existingOption => {
      return existingOption.id === option.id;
    });
    if (!existingIngredient) {
      allIngredientOptions.push(option);
    }
  }

  return allIngredientOptions;
}

const applyFiltering = (recipeFilter) => {
  const {
    allRecipes,
    ingredientFilters,
    maxIngredientsAmount,
    maxCookingTime,
    sortBy,
    sortDirection,
  } = recipeFilter;

  let filteredRecipes = allRecipes;
  if (ingredientFilters) {
    filteredRecipes = filterOnRecipesThatContainIngredients(
      allRecipes,
      ingredientFilters,
    );
  }
  if (maxIngredientsAmount) {
    filteredRecipes = filterOnRecipesWithMaxAmountOfIngredients(
      filteredRecipes,
      maxIngredientsAmount
    );
  }
  if (maxCookingTime) {
    filteredRecipes = filterOnRecipesWithinMaxCookingTime(
      filteredRecipes,
      maxCookingTime
    );
  }

  if (sortBy) {
    switch (sortBy) {
      case 'name':
        filteredRecipes = sortByName(filteredRecipes, sortDirection);
        break;
      case 'score':
        filteredRecipes = sortByScore(filteredRecipes, sortDirection);
        break;
      case 'publishedDate':
        filteredRecipes = sortByPublishedDate(filteredRecipes, sortDirection);
        break;
      default:
        break;
    }
  }

  const allIngredientOptions = getIngredientsFromFilteredRecipes(filteredRecipes);
  return [filteredRecipes, allIngredientOptions];
};

const initialState = {
  ingredientFilters: [],
  allIngredientOptions: [],
  filteredRecipes: [],
  allRecipes: [],
  maxIngredientsAmount: null,
  maxCookingTime: null,
  sortBy: 'name',
  sortDirection: 'asc',
};

const reducer = (state, action) => {
  let filteredRecipes = [];
  let allIngredientOptions = [];

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
    case 'updateSortBy':
      localStorage.setItem('sortBy', action.value);
      newState = { ...state, sortBy: action.value };
      break;
    case 'updateSortDirection':
      localStorage.setItem('sortDirection', action.value);
      newState = { ...state, sortDirection: action.value };
      break;
    case 'update':
      newState = { ...state, ...action.value };
      break;
    case 'updateAllRecipes':
      newState = { ...state, allRecipes: action.recipes };
      break;
    case 'reset':
      localStorage.removeItem('maxIngredientsAmount');
      localStorage.removeItem('maxCookingTime');
      localStorage.removeItem('ingredientFilters');
      localStorage.removeItem('sortBy');
      localStorage.removeItem('sortDirection');
      newState = { ...initialState, allRecipes: state.allRecipes };
      break;
    default:
      return state;
  }
  [filteredRecipes, allIngredientOptions] = applyFiltering(newState);
  return { ...newState, filteredRecipes, allIngredientOptions };
}

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
    const sortByFromLocalStorage = localStorage.getItem('sortBy');
    const sortDirectionFromLocalStorage = localStorage.getItem('sortDirection');

    updatedInitialState.ingredientFilters = ingredientFiltersFromLocalStorage;
    updatedInitialState.maxIngredientsAmount = maxIngredientsAmountFromLocalStorage
      && parseInt(maxIngredientsAmountFromLocalStorage, 10);
    updatedInitialState.maxCookingTime= maxCookingTimeFromLocalStorage
      && parseInt(maxCookingTimeFromLocalStorage, 10);

    updatedInitialState.sortBy = sortByFromLocalStorage || 'name';
    updatedInitialState.sortDirection = sortDirectionFromLocalStorage || 'asc';

    recipeFilterDispatch({ type: 'update', value: updatedInitialState });
  }, []);

  return (
    <RecipeFilterContext.Provider value={{ recipeFilters, recipeFilterDispatch }}>
      {props.children}
    </RecipeFilterContext.Provider>
  );
};
