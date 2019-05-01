import React, { createContext, useReducer } from 'react'; 

import { putRequest, deleteRequest } from 'utils/request';

const sortByCreatedAt = (a, b) => {
  if (a.createdAt > b.createdAt) {
    return -1;
  } else if (a.createdAt < b.createdAt) {
    return 1;
  } else {
    return 0;
  }
}

const reducer = (state, action) => {
  const groceryListState = [...state];
  switch (action.type) {
    case 'add':
      return [ ...state, ...action.value ];
    case 'update':
      return action.value;
    case 'updateListIndex':
      groceryListState[action.index] = action.value;
      if (!action.silent) {
        putRequest(`groceryList/update/${groceryListState[action.index].id}`, groceryListState[action.index]);
      }
      return groceryListState;
    case 'updateListItem':
      groceryListState[action.listIndex].items[action.index] = action.value;
      putRequest(`groceryList/update/${groceryListState[action.listIndex].id}`, groceryListState[action.index]);
      return groceryListState;
    case 'remove':
      groceryListState.splice(action.index, 1);
      deleteRequest(`groceryList/${action.listId}`, {
        userId: action.userId
      });
      return groceryListState;
      
  }
};

const initialState = [];

export const GroceryListContext = createContext(initialState);

export const GroceryListProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GroceryListContext.Provider value={{ state: state.sort(sortByCreatedAt), dispatch }}>
      {props.children}
    </GroceryListContext.Provider>
  ) 
};
