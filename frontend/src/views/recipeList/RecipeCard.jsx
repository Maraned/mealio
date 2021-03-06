import React, { useContext } from 'react';

import { FaUtensils } from 'react-icons/fa';
import cc from 'classcat';
import { Link } from 'react-router-dom';
import { imageUrl } from 'utils/request';

import './recipeCard.css';

import { RecipeContext } from 'contexts/recipe';

const RecipeCard = ({ recipe }) => {
  const { dispatch: setRecipe } = useContext(RecipeContext);

  const goToRecipeDetail = () => {
    setRecipe({ type: 'recipe', value: recipe });
  }

  return (
    <Link to={`/recipes/${recipe.url}`}>
      <div className="recipeCard" onClick={goToRecipeDetail}>
        <div className={cc(['recipeCard__image', {
          'recipeCard__image--default': !recipe.image
        }])}>
          {!recipe.images.length ? (
            <FaUtensils />
          ) : (
            <img src={imageUrl(recipe.images[0])} alt="" />
          )}
        </div>

        <div className="recipeCard__content">
          <div className="recipeCard__name">
            {recipe.name}
          </div>
        </div>
      </div>
    </Link>
  )
};

export default RecipeCard;
