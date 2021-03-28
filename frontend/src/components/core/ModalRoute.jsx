import { useLocation, Link } from "react-router-dom";
import React from 'react';

const ModalRoute = ({ pathname, state, children }) => {
  const location = useLocation();

  return (
    <Link to={{
      pathname,
      state: { modal: true, ...state, previousLocation: location }
    }}>
      {children}
    </Link>
  );
};

export default ModalRoute;
