import RecipeList from './RecipeList';

import React, { useEffect, useState } from 'react';

import { getRequest } from 'utils/request';
import { RecipeFilterProvider } from 'contexts/recipeFilter';

export default function RecipeListWrapper() {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    const fetchedRecipes = await getRequest('recipes');
    setRecipes(fetchedRecipes);
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <RecipeFilterProvider>
      <RecipeList recipes={recipes} />
    </RecipeFilterProvider>
  );
}

