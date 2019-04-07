import React from 'react';

import { FaUtensils } from 'react-icons/fa';
import cc from 'classcat';

import './recipeCard.css';

const RecipeCard = ({ recipe }) => {
  console.log('recipe', recipe)
  return (
    <div className="recipeCard">
      <div className={cc(['recipeCard__image', {
        'recipeCard__image--default': !recipe.image
      }])}>
        {!recipe.images.length ? (
          <FaUtensils />
        ) : (
          <img src={recipe.images[0]} />
        )}
      </div>

      <div className="recipeCard__content">
        <div className="recipeCard__name">
          {recipe.name}
        </div>
      </div>
    </div>
  )
};

export default RecipeCard;
