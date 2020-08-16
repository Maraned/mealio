import React, { createContext, useReducer } from 'react'; 

const updateItem = (items, updatedItem) => {
  const nonUpdatedItems = items.filter(item => {
    return updatedItem.id !== item.id;
  });

  return [...nonUpdatedItems, updatedItem];
};

const removeItem = (items, removedItem) => {
  return items.filter(item => {
    return removedItem.id !== item.id;
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'added':
      return [...state, action.value];
    case 'update':
      return action.value;
    case 'set':
      return action.value;
    case 'updated':
      return updateItem(state, action.value);
    case 'removed':
      return removeItem(state, action.value);
    default:
      return state;
  }
};

const initialState = [];

export const IngredientGroupsContext = createContext(initialState);

export const IngredientGroupsProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <IngredientGroupsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </IngredientGroupsContext.Provider>
  ) 
};

