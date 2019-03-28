import React, { useState, useContext, useEffect } from 'react';
import DraftRecipes from './DraftRecipes';
import { useTranslation } from 'react-i18next';
import SideMenuLayout from 'components/layouts/SideMenuLayout';
import PublishedRecipes from './PublishedRecipes';
import { UserContext } from 'contexts/user';
import RecipeAccordionList from './RecipeAccordionList';

const MyRecipes = () => {
  const [activeView, setActiveView] = useState('draftRecipes');
  const [draftRecipes, setDraftRecipes] = useState([]);
  const [publishedRecipes, setPublishedRecipes] = useState([]);
  const { state: userState } = useContext(UserContext);

  const { t } = useTranslation();

  const recipeInRecipes = (recipes, recipeKey) => {
    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].id === recipeKey) {
        return i;
      }
    }
  };

  const getRecipes = async (type, isDraft) => {
    const recipes = [];
    await userState.user.get(type).map().on((recipe, recipeKey) => {
      if (recipes.length === 0) {
        recipes.push({ ...recipe, id: recipeKey, images: [], steps: [], ingredients: [], draft: isDraft });
      } else {
        const existingRecipeIndex = parseInt(recipeInRecipes(recipes, recipeKey), 10);
        if (existingRecipeIndex >= 0) {
          recipes[existingRecipeIndex] = { ...recipe, id: recipeKey, images: [], steps: [], ingredients: [], draft: isDraft };
        } else {
          recipes.push({ ...recipe, id: recipeKey, images: [], steps: [], ingredients: [], draft: isDraft });
        }
      }
    });
    return recipes;
  }

  const setRecipes = async () => {
    const fetchedDraftRecipes = await getRecipes('draftRecipes', true);
    setDraftRecipes(fetchedDraftRecipes);
    const fetchedPublishedRecipes = await getRecipes('publishedRecipes', false);
    setPublishedRecipes(fetchedPublishedRecipes);
  }

  useEffect(() => {
    if (userState && userState.user) {
      setRecipes();
    }
  }, [userState.user]);

  const views = [{
    View: RecipeAccordionList,
    name: 'allRecipes',
    text: t('MyRecipes:AllRecipes'),
    data: [...draftRecipes, ...publishedRecipes],
  }, {
    View: RecipeAccordionList,
    name: 'draftRecipes',
    text: t('MyRecipes:DraftRecipes'),
    data: draftRecipes,
  }, {
    View: RecipeAccordionList,
    name: 'publishedRecipes',
    text: t('MyRecipes:PublishedRecipes'),
    data: publishedRecipes,
  }];
  

  return (
    <SideMenuLayout views={views} defaultView="allRecipes" />
  );
};

export default MyRecipes;
