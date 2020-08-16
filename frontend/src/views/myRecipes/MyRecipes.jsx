import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from 'components/core/tabs/Tabs';

import RecipeAccordionList from './RecipeAccordionList';
import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import { DraftRecipesContext } from 'contexts/draftRecipes';
import { PublishedRecipesContext } from 'contexts/publishedRecipes';

const MyRecipes = () => {
  const { t } = useTranslation();
  const { state: draftRecipes } = useContext(DraftRecipesContext);
  const { state: publishedRecipes } = useContext(PublishedRecipesContext);

  const allRecipes = [...draftRecipes, ...publishedRecipes];

  const views = [{
    View: CreateRecipeView,
    name: 'createRecipe',
    title: t('MyRecipes:CreateRecipe'),
    createAction: true,
    route: 'create',
  }, {
    View: RecipeAccordionList,
    name: 'allRecipes',
    title: t('MyRecipes:AllRecipes'),
    data: allRecipes,
    disabled: !allRecipes.length,
    route: 'all',
  }, {
    View: RecipeAccordionList,
    name: 'draftRecipes',
    title: t('MyRecipes:DraftRecipes'),
    data: draftRecipes,
    disabled: !draftRecipes.length,
    route: 'draft',
  }, {
    View: RecipeAccordionList,
    name: 'publishedRecipes',
    title: t('MyRecipes:PublishedRecipes'),
    data: publishedRecipes,
    disabled: !publishedRecipes.length,
    route: 'published',
  }];

  return (
    <div className="myRecipes child-flex">
      <Tabs views={views} defaultRoute="all" />
    </div>
  );
};

export default MyRecipes;
