import React, { createContext, useReducer } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

export const RouterProvider = props => {
  return (
    <Router>
      {props.children}
    </Router>
  );
};
