import React, { useContext } from 'react';
import Login from 'views/login/Login';
import UserMenu from 'views/userMenu/UserMenu';

import { LoggedInContext } from 'contexts/login';
import { UserContext } from 'contexts/user';
import { RouterContext } from 'contexts/router';
import { RecipeContext } from 'contexts/recipe';

import { useTranslation } from 'react-i18next';

import './header.css';

const Header = () => {
  const { state, dispatch } = useContext(LoggedInContext);
  const User = useContext(UserContext);
  const { state: router, dispatch: routerDispatch } = useContext(RouterContext);
  const { dispatch: recipeDispatch } = useContext(RecipeContext);
  const { t, i18n } = useTranslation();

  const goToRecipeList = () => {
    recipeDispatch({ type: 'unset' })
    routerDispatch({ type: 'recipeList' });
  }

  return (
    <header className="header">
      <button onClick={() => {
        const nextLocale = i18n.language === 'sv' ? 'en' : 'sv';
        i18n.changeLanguage(nextLocale);
      }}>
        Change language
      </button>

      <button onClick={goToRecipeList}>Recipe List</button>
      
      {!state.loggedIn ? (
        <Login />
      ) : (
        <UserMenu />
      )}
    </header>
  )
}

export default Header;
