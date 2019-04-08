import React, { useContext } from 'react';

import { FaUtensils } from 'react-icons/fa';
import cc from 'classcat';

import './recipeCard.css';

import { RecipeContext } from 'contexts/recipe';
import { RouterContext } from 'contexts/router';

const RecipeCard = ({ recipe }) => {
  const { dispatch: setRecipe } = useContext(RecipeContext);
  const { dispatch: goToPage } = useContext(RouterContext);

  const goToRecipeDetail = () => {
    goToPage({ type: 'recipeDetail' });
    setRecipe({ type: 'recipe', value: recipe });
  }

  return (
    <div className="recipeCard" onClick={goToRecipeDetail}>
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
