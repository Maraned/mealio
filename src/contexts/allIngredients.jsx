import React, { createContext, useReducer } from 'react'; 

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

export const AllIngredientsContext = createContext(initialState);

export const AllIngredientsProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AllIngredientsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AllIngredientsContext.Provider>
  ) 
};

