import React, { useContext, useEffect, useState } from 'react';

import { getRequest } from 'utils/request';
import RecipeCard from './RecipeCard';
import RecipeFilter from './RecipeFilter';

import './recipeList.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  console.log('recipes', recipes)

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
    <div className="recipeListView">
      <RecipeFilter />

      <div className="recipeList">

        {recipes.map(recipe => (
          <RecipeCard 
            key={recipe.id}
            recipe={recipe} 
          />
        ))}
      </div>
    </div>
  )
}

export default RecipeList;
