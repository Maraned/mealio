import React, { useContext } from 'react';
import Login from 'views/login/Login';

import { removeTokens } from 'utils/token';

import { LoggedInContext } from 'contexts/login';

import { useTranslation } from 'react-i18next';

import './header.css';

const Header = () => {
  const { state, dispatch } = useContext(LoggedInContext);
  const { t, i18n } = useTranslation();
  
  const logout = () => {
    removeTokens();
    dispatch({ type: 'logout' });
  }

  return (
    <header className="header">
      {!state.loggedIn ? (
        <Login />
      ) : (
        <button onClick={logout}>{t('Login:Logout')}</button>
      )}

      <button onClick={() => {
        const nextLocale = i18n.language === 'sv' ? 'en' : 'sv';
        i18n.changeLanguage(nextLocale);
      }}>
        Change language
      </button>

    </header>
  )
}

export default Header;
