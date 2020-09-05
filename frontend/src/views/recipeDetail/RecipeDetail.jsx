import './recipeDetail.css';

import React, { useContext } from 'react';

import { RecipeContext, RecipeProvider } from 'contexts/recipe';
import CreateRecipe from 'views/createRecipe/CreateRecipe';

const RecipeDetail = () => {
  const { state: recipe } = useContext(RecipeContext);

  if (!recipe) {
    return '';
  }

  return (
    <RecipeProvider recipe={recipe}>
      <CreateRecipe publishedMode />
    </RecipeProvider>
  );
}

export default RecipeDetail;
