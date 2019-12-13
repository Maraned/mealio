import React, { useContext, useState, useEffect } from 'react'; 
import RecipeAccordion from 'views/myRecipes/RecipeAccordion';
import { DraftRecipesContext } from 'contexts/draftRecipes';
import { PublishedRecipesContext } from 'contexts/publishedRecipes';

import { useTranslation } from 'react-i18next';

const RecipeAccordionList = ({ title, data: recipes = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="recipeAccordionList flex grow column">
      {recipes.map((recipe, index) => (
        <RecipeAccordion 
          recipe={recipe} 
          key={index} 
          index={index} 
        />
      ))}

      {recipes.length === 0 && (
        <div className="recipeAccordionList--noRecipes background box">
          {t('MyRecipes:NoRecipes')}
        </div>
      )}
    </div>
  );
}


export default RecipeAccordionList;

