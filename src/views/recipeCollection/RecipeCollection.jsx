import './recipeCollection.css';

import React, { useState, useEffect, useContext } from 'react';
import { getRequest } from 'utils/request';
import { UserContext } from 'contexts/user';
import RecipeList from 'views/recipeList/RecipeList';
import { useTranslation } from 'react-i18next';

export default function RecipeCollection({

}) {
  const { state: user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const { t } = useTranslation();

  const fetchRecipeCollection = async () => {
    if (user.id) {
      const recipeCollection = await getRequest(`users/${user.id}/recipeCollection`);
      setRecipes(recipeCollection);
    }
};

  useEffect(() => {
    fetchRecipeCollection();
  }, []);

  return (
    <div className="recipeCollection background">
      {recipes.length ? (
        <RecipeList recipes={recipes} />
      ) : (
        <div className="recipeCollection__noRecipes">
          {t('RecipeCollection:NoRecipes')}
        </div>
      )}
    </div>
  );
}

