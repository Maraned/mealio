import React, { createContext, useReducer, useEffect } from 'react'; 
import { getRequest } from 'utils/request';

const updateIngredient = (ingredients, updatedIngredient) => {
  const nonUpdatedIngredients = ingredients.filter(ingredient => {
    return updatedIngredient.id !== ingredient.id;
  });

  return [...nonUpdatedIngredients, updatedIngredient];
};

const removeIngredient = (ingredients, removedIngredient) => {
  return ingredients.filter(ingredient => {
    return removedIngredient.id !== ingredient.id;
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'add':
      const { name, group } = action;
      if (name && group) {
        const newIngredient = { name, group };
        return [...state, newIngredient ];
      }
      break;
    case 'added':
      return [...state, action.value];
    case 'update':
      return action.value;
    case 'updated':
      return updateIngredient(state, action.value);
    case 'removed':
      return removeIngredient(state, action.value);
    default:
      return state;
  }
};

const initialState = [];

export const fetchAllIngredients = async () => {
  const allIngredients = await getRequest('ingredients');
  if (!allIngredients.error) {
    return allIngredients;
  }
  return null;
}

export const AllIngredientsContext = createContext(initialState);

export const AllIngredientsProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialFetch = async () => {
    const ingredients = await fetchAllIngredients();
    if (ingredients) {
      dispatch({ type: 'update', value: ingredients });
    }
  }

  useEffect(() => {
    initialFetch();
  }, []);

  return (
    <AllIngredientsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AllIngredientsContext.Provider>
  ) 
};

