import React, { createContext, useReducer } from 'react'; 

const editableReducer = (state, action) => {
  switch (action.type) {
    case "edit":
      return { ...state, editable: true };
    case "view":
      return { ...state, editable: false };
    default:
      return;
  }
};

const initialState = { editable: false };

export const EditableContext = createContext(initialState);

export const EditableProvider = props => {
  const [state, dispatch] = useReducer(editableReducer, { editable: props.editable } || initialState);

  return (
    <EditableContext.Provider value={{ state, dispatch }}>
      {props.children}
    </EditableContext.Provider>
  ) 
};
