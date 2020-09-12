import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from 'components/core/tabs/Tabs';

import RecipeAccordionList from './RecipeAccordionList';
import { DraftRecipesContext } from 'contexts/draftRecipes';
import { PublishedRecipesContext } from 'contexts/publishedRecipes';
import { UserContext } from 'contexts/user';
import { postRequest } from 'utils/request';
import RecipeModel from 'models/recipeModel';

const MyRecipes = () => {
  const { t } = useTranslation();
  const {
    state: draftRecipes,
    dispatch: updateDraftRecipes
  } = useContext(DraftRecipesContext);
  const { state: user } = useContext(UserContext);
  const [openRecipes, setOpenRecipes] = useState([]);
  const { state: publishedRecipes } = useContext(PublishedRecipesContext);
  const allRecipes = [...draftRecipes, ...publishedRecipes];

  const createDraftRecipe = async () => {
    const response = await postRequest('recipes/createUpdate', {
      recipe: new RecipeModel(),
      id: user.id
    });
    if (response.draftId) {
      setOpenRecipes([response.draftId]);
    }
  };

  const onPublish = recipeId => {
    setOpenRecipes([...openRecipes, `published-${recipeId}`]);
  }

  const createNew = {
    allowed: true,
    title: t('MyRecipes:CreateRecipe'),
    onCreate: createDraftRecipe
  };

  const views = [{
    View: RecipeAccordionList,
    name: 'allRecipes',
    title: t('MyRecipes:AllRecipes'),
    data: allRecipes,
    createNew,
    openRecipes,
    disabled: !allRecipes.length,
    onPublish,
    route: 'all',
  }, {
    View: RecipeAccordionList,
    name: 'draftRecipes',
    title: t('MyRecipes:DraftRecipes'),
    data: draftRecipes,
    createNew,
    disabled: !draftRecipes.length,
    openRecipes,
    onPublish,
    route: 'draft',
  }, {
    View: RecipeAccordionList,
    name: 'publishedRecipes',
    title: t('MyRecipes:PublishedRecipes'),
    data: publishedRecipes,
    disabled: !publishedRecipes.length,
    onPublish,
    route: 'published',
  }];

  return (
    <div className="myRecipes child-flex">
      <Tabs views={views} defaultRoute="all" />
    </div>
  );
};

export default MyRecipes;
