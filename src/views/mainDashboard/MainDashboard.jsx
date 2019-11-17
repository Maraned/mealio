import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LoggedInContext } from 'contexts/login';
import { RouterContext } from 'contexts/router';

export default function MainDashboard() {
  const { t } = useTranslation();
  const { state: { loggedIn } } = useContext(LoggedInContext);
  const { dispatch } = useContext(RouterContext);

  const navigateTo = page => {
    dispatch({ type: page });
  };

  const renderSquare = (text, page) => (
    <div className="square shadow" onClick={() => navigateTo(page)}>
      {text}
    </div>
  );

  return (
    <div className="mainDashboard">
      <div className="flex wrap">
        {renderSquare(t('MainDashboard:SearchRecipes'), 'recipeList')}

        {loggedIn && (
          <>
            {renderSquare(t('MainDashboard:SavedRecipes'), 'recipeCollection')}
            {renderSquare(t('MainDashboard:GroceryLists'), 'groceryLists')}
            {renderSquare(t('MainDashboard:CreateRecipe'), 'createRecipe')}
            {renderSquare(t('MainDashboard:MyCreatedRecipes'), 'myRecipes')}
          </>
        )}
      </div>
    </div>
  )
}
