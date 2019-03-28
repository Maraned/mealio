import React, { useContext, useState, useEffect } from 'react'; 
import { GunContext } from 'contexts/gun';
import CreateRecipe from '../createRecipe/CreateRecipe';
import RecipeAccordion from 'views/myRecipes/RecipeAccordion';

const PublishedRecipes = ({ data: recipes }) => {
  // const recipeInRecipes = (recipes, recipeKey) => {
  //   for (let i = 0; i < recipes.length; i++) {
  //     if (recipes[i].id === recipeKey) {
  //       return i;
  //     }
  //   }
  // };

  // const getRecipes = async () => {
  //   const recipes = [];
  //   await userState.user.get('publishedRecipes').map().on((recipe, recipeKey) => {
  //     if (recipes.length === 0) {
  //       recipes.push({ ...recipe, id: recipeKey, images: [], steps: [], ingredients: [], draft: false });
  //     } else {
  //       const existingRecipeIndex = parseInt(recipeInRecipes(recipes, recipeKey), 10);
  //       if (existingRecipeIndex >= 0) {
  //         recipes[existingRecipeIndex] = { ...recipe, id: recipeKey, images: [], steps: [], ingredients: [], draft: false };
  //       } else {
  //         recipes.push({ ...recipe, id: recipeKey, images: [], steps: [], ingredients: [], draft: false });
  //       }
  //     }
  //   });

  //   setRecipes(recipes);
  // };

  // useEffect(() => {
  //   getRecipes();
  // }, [userState.user]);

  return (
    <div className="publishedRecipes">
      {recipes.map((recipe, index) => (
        <RecipeAccordion 
          recipe={recipe} 
          key={index} 
          index={index} 
        />
      ))}
    </div>
  )
};

export default PublishedRecipes;

