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

  const [initialFetchDone, setInitialFetchDone] = useState(false);

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

  const { state: user } = useContext(UserContext);

  const performInitialFetch = async () => {
    await Promise.all([
      getDraftRecipes(user.id),
      getPublishedRecipes(user.id),
    ]);
    setInitialFetchDone(true);
  }

  useEffect(() => {
    if (user.id) {
      performInitialFetch();
    }
  }, [user.id]);

  if (!initialFetchDone) {
    return '';
  }

  return (
    <div className="myRecipes child-flex">
      <Tabs views={views} defaultRoute="all" />
    </div>
  );
};

export default MyRecipes;
