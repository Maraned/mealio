import React, { useContext, useEffect, useState } from 'react';

import { getRequest } from 'utils/request';
import RecipeCard from './RecipeCard';

import './recipeList.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    const fetchedRecipes = await getRequest('recipes');
    setRecipes(fetchedRecipes);
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="recipeList">
      {recipes.map(recipe => (
        <RecipeCard 
          key={recipe.id}
          recipe={recipe} 
        />
      ))}
    </div>
  )
}

export default RecipeList;
