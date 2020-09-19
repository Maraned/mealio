import './recipeList.css';

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { RecipeFilterContext } from 'contexts/recipeFilter';
import RecipeCard from './RecipeCard';
import RecipeFilter from './RecipeFilter';

const RecipeList = () => {
  const { recipeFilters: { filteredRecipes } } = useContext(RecipeFilterContext);
  const { t } = useTranslation();

  return (
    <div className="recipeListView grow">
      <RecipeFilter />

      <div className="box background">
        {(filteredRecipes && !!filteredRecipes.length) ? (
          <div className="recipeList ">
            {filteredRecipes?.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </div>
        ) : (
          <span>{t('RecipeList:NoRecipesFound')}</span>
        )}
      </div>
    </div>
  )
}

export default RecipeList;
