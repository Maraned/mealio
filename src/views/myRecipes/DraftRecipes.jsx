import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from 'contexts/user';
import RecipeAccordion from 'views/myRecipes/RecipeAccordion'

import './draftRecipes.css';

const DraftRecipes = () => {
  const { state: userState } = useContext(UserContext);
  const [draftRecipes, setDraftRecipes] = useState([]);

  const recipeInRecipes = (recipes, recipeKey) => {
    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].id === recipeKey) {
        return i;
      }
    }
  };

  const getDraftRecipes = async () => {
    const recipes = [];
    await userState.user.get('draftRecipes').map().on((recipe, recipeKey) => {
      if (recipes.length === 0) {
        recipes.push({ ...recipe, id: recipeKey, images: [], steps: [], ingredients: [], draft: true });
      } else {
        const existingRecipeIndex = parseInt(recipeInRecipes(recipes, recipeKey), 10);
        if (existingRecipeIndex >= 0) {
          recipes[existingRecipeIndex] = { ...recipe, id: recipeKey, images: [], steps: [], ingredients: [], draft: true };
        } else {
          recipes.push({ ...recipe, id: recipeKey, images: [], steps: [], ingredients: [], draft: true });
        }
      }
    });

    setDraftRecipes(recipes);
  };

  useEffect(() => {
    if (userState.user) {
      getDraftRecipes();
    }
  }, [userState.user]);

  return (
    <div className="draftRecipes" key="draftRecipes">
      {draftRecipes.map((recipe, index) => (
        <RecipeAccordion 
          recipe={recipe} 
          key={index} 
          index={index} 
        />
      ))}
    </div>
  )
};

export default DraftRecipes;