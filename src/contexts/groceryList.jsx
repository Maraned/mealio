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

const popFind = (list, id) => {
  for (const [index, item] of list.entries()) {
    if (item.id === id) {
      return list.splice(index, 1);
    }
  }
}

const reducer = (state, action) => {
  const groceryListState = [...state];
  switch (action.type) {
    case 'add':
      return [ ...state, ...action.value ];
    case 'update':
      return action.value;
    case 'updateList':
      let updatedList = popFind(groceryListState, action.id)[0];
      updatedList = { ...updatedList, ...action.value };
      if (!action.silent) {
        putRequest(`groceryList/update/${updatedList.id}`, action.value);
      }
      return [...groceryListState, updatedList];
    case 'updateListItem':
      let list = popFind(groceryListState, action.id)[0];
      list.items[action.index] = action.value;      
      putRequest(`groceryList/update/${list.id}`, action.value);
      return [...groceryListState, list];
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
