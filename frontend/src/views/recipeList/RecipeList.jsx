import './recipeList.css';

import React from 'react';

import RecipeCard from './RecipeCard';
import RecipeFilter from './RecipeFilter';

const RecipeList = ({
  recipes
}) => {
  return (
    <div className="recipeListView">
      <RecipeFilter />

      <div className="recipeList box background">

        {recipes && !!recipes.length && recipes.map(recipe => (
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
