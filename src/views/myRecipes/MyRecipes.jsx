import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SideMenuLayout from 'components/layouts/SideMenuLayout';
import { UserContext } from 'contexts/user';

import RecipeAccordionList from './RecipeAccordionList';
import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import FetchMyRecipes from 'utils/fetchMyRecipes';

const MyRecipes = () => {
  const { state: user } = useContext(UserContext);
  const { t } = useTranslation();
  const {
    draftRecipes,
    publishedRecipes,
    getDraftRecipes,
    getPublishedRecipes
  } = FetchMyRecipes();

  useEffect(() => {
    if (user.id) {
      getDraftRecipes(user.id);
      getPublishedRecipes(user.id);
    }
  }, [user.id]);

  const allRecipes = [...draftRecipes, ...publishedRecipes];

  const views = [{
    View: CreateRecipeView,
    name: 'createRecipe',
    text: t('MyRecipes:CreateRecipe'),
    createAction: true,
  }, {
    View: RecipeAccordionList,
    name: 'allRecipes',
    text: t('MyRecipes:AllRecipes'),
    data: allRecipes,
    disabled: !allRecipes.length
  }, {
    View: RecipeAccordionList,
    name: 'draftRecipes',
    text: t('MyRecipes:DraftRecipes'),
    data: draftRecipes,
    disabled: !draftRecipes.length
  }, {
    View: RecipeAccordionList,
    name: 'publishedRecipes',
    text: t('MyRecipes:PublishedRecipes'),
    data: publishedRecipes,
    disabled: !publishedRecipes.length
  }];

  return (
    <SideMenuLayout 
      views={views} 
      defaultView="allRecipes" 
      grid
    />
  );
};

export default MyRecipes;
