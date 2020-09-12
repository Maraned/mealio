import React from 'react';
import { useTranslation } from 'react-i18next';

import RecipeAccordion from 'views/myRecipes/RecipeAccordion';
import CreateNew from 'components/core/CreateNew';

const RecipeAccordionList = React.memo(function({
  data: recipes = [],
  createNew = {
    allowed: false,
    title: '',
    onCreate: null,
  },
  openRecipes = [],
  onPublish = null,
  name,
}) {
  const { t } = useTranslation();

  return (
    <div className="recipeAccordionList flex grow column">
      {createNew.allowed && (
        <CreateNew
          title={createNew.title}
          onClick={createNew.onCreate}
          className="recipeAccordion__header recipeAccordion__header--createNew"
        />
      )}

      {recipes.map((recipe, index) => {
        return (
        <RecipeAccordion
          recipe={recipe}
          key={recipe.draft ? `draft-${recipe.id}` : `published-${recipe.id}`}
          index={index}
          defaultOpenState={openRecipes.includes(recipe.id)}
          onPublish={onPublish}
        />
      )})}

      {recipes.length === 0 && (
        <div className="recipeAccordionList--noRecipes background box">
          {t('MyRecipes:NoRecipes')}
        </div>
      )}
    </div>
  );
});

export default RecipeAccordionList;
