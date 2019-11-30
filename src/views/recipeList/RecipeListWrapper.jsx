import React, { useEffect, useState } from 'react';

import { getRequest } from 'utils/request';

import RecipeList from './RecipeList';


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
    <RecipeList recipes={recipes} />
  );
}

