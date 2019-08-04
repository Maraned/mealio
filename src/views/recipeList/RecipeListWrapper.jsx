import React, { useEffect, useState } from 'react';

import { getRequest } from 'utils/request';

import RecipeList from './RecipeList';


export default function RecipeListWrapper() {
  const [recipes, setRecipes] = useState([]);
  console.log('recipes state', recipes)

  const fetchRecipes = async () => {
    const fetchedRecipes = await getRequest('recipes');
    if (!fetchedRecipes.error) {
      console.log('fetchedRecipes', fetchedRecipes)
    }
    setRecipes(fetchedRecipes);
  }
  
  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <RecipeList recipes={recipes} />
  );
}

