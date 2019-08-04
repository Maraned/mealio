import React, { useContext, useEffect, useState } from 'react';

import RecipeCard from './RecipeCard';
import RecipeFilter from './RecipeFilter';

import './recipeList.css';

const RecipeList = ({
  recipes
}) => {
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
