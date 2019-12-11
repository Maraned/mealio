import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from 'contexts/user';
import Tabs from 'components/core/tabs/Tabs';

import RecipeAccordionList from './RecipeAccordionList';
import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import FetchMyRecipes from 'utils/fetchMyRecipes';

const MyRecipes = () => {
  const { t } = useTranslation();
  const {
    draftRecipes,
    publishedRecipes,
    getDraftRecipes,
    getPublishedRecipes
  } = FetchMyRecipes();

  const allRecipes = [...draftRecipes, ...publishedRecipes];

  const views = [{
    View: CreateRecipeView,
    name: 'createRecipe',
    title: t('MyRecipes:CreateRecipe'),
    createAction: true,
  }, {
    View: RecipeAccordionList,
    name: 'allRecipes',
    title: t('MyRecipes:AllRecipes'),
    data: allRecipes,
    disabled: !allRecipes.length
  }, {
    View: RecipeAccordionList,
    name: 'draftRecipes',
    title: t('MyRecipes:DraftRecipes'),
    data: draftRecipes,
    disabled: !draftRecipes.length
  }, {
    View: RecipeAccordionList,
    name: 'publishedRecipes',
    title: t('MyRecipes:PublishedRecipes'),
    data: publishedRecipes,
    disabled: !publishedRecipes.length
  }];

  const { state: user } = useContext(UserContext);

  useEffect(() => {
    if (user.id) {
      getDraftRecipes(user.id);
      getPublishedRecipes(user.id);
    }
  }, [user.id]);


  return (
    <div className="myRecipes child-flex">
      <Tabs views={views} />
    </div>
  );
};

export default MyRecipes;
