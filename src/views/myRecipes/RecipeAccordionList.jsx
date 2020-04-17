import React from 'react'; 
import RecipeAccordion from 'views/myRecipes/RecipeAccordion';

import { useTranslation } from 'react-i18next';

const RecipeAccordionList = ({ data: recipes = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="recipeAccordionList flex grow column">
      {recipes.map((recipe, index) => (
        <RecipeAccordion 
          recipe={recipe} 
          key={recipe.id} 
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

