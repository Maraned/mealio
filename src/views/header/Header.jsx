import React, { useContext } from 'react';
import Login from 'views/login/Login';
import UserMenu from 'views/userMenu/UserMenu';

import { LoggedInContext } from 'contexts/login';

import { useTranslation } from 'react-i18next';

import './header.css';

const Header = () => {
  const { state, dispatch } = useContext(LoggedInContext);
  const { t, i18n } = useTranslation();

        // {/* <button onClick={logout}>{t('Login:Logout')}</button> */}

  return (
    <header className="header">
      <button onClick={() => {
        const nextLocale = i18n.language === 'sv' ? 'en' : 'sv';
        i18n.changeLanguage(nextLocale);
      }}>
        Change language
      </button>
      
      {!state.loggedIn ? (
        <Login />
      ) : (
        <UserMenu />
      )}
    </header>
  )
}

export default Header;
