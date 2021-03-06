import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LoggedInContext } from 'contexts/login';
import { Link } from 'react-router-dom';

export default function MainDashboard() {
  const { t } = useTranslation();
  const { state: { loggedIn } } = useContext(LoggedInContext);

  const renderSquare = (text, page) => (
    <Link to={`${page}`}>
      <div className="square shadow center">
        {text}
      </div>
    </Link>
  );

  const renderModalSquare = (text, page) => (
    <a>
      <div
        className="square shadow center"

      >
        {text}
      </div>
    </a>
  );

  return (
    <div className="mainDashboard">
      <div className="flex wrap">
        {renderSquare(t('MainDashboard:SearchRecipes'), '/recipes')}

        {loggedIn && (
          <>
            {renderSquare(t('MainDashboard:SavedRecipes'), '/savedRecipes')}
            {renderModalSquare(t('MainDashboard:GroceryLists'), 'groceryLists')}
            {renderSquare(t('MainDashboard:CreateRecipe'), '/recipes/create')}
            {renderSquare(t('MainDashboard:MyCreatedRecipes'), '/myRecipes')}
          </>
        )}
      </div>
    </div>
  )
}
