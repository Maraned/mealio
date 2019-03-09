import React, { useContext } from 'react';
import Login from 'views/login/Login';

import { removeTokens } from 'utils/token';

import { LoggedInContext } from 'contexts/login';

import './header.css';

const Header = () => {
  const { state, dispatch } = useContext(LoggedInContext);

  console.log('loggedIn', state.loggedIn)

  const logout = () => {
    removeTokens();
    dispatch({ type: 'logout' });
  }

  return (
    <header className="header">
      {!state.loggedIn ? (
        <Login />
      ) : (
        <button onClick={logout}>Logout</button>
      )}

    </header>
  )
}

export default Header;
