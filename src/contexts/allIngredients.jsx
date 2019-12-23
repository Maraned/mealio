import React, { createContext, useReducer, useEffect } from 'react'; 
import { getRequest } from 'utils/request';

const reducer = (state, action) => {
    switch (action.type) {
    case 'add':
      const { name, group } = action;
      if (name && group) {
        const newIngredient = { name, group };
        return [...state, newIngredient ];
      }
    case 'update':
      return action.value;
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

