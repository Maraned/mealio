import React from 'react'; 
import RecipeAccordion from 'views/myRecipes/RecipeAccordion';

import { useTranslation } from 'react-i18next';

const RecipeAccordionList = ({ title, data: recipes }) => {
  const { t } = useTranslation();

  return (
    <div className="recipeAccordionList flex grow column background box">
      <h2 className="center">{title}</h2>
      
      <div className="box-divider" />

      {recipes.map((recipe, index) => (
        <RecipeAccordion 
          recipe={recipe} 
          key={index} 
          index={index} 
        />
      ))}

      {recipes.length === 0 && (
        <div className="recipeAccordionList--noRecipes">
          {t('MyRecipes:NoRecipes')}
        </div>
      )}
    </div>
  );
}


export default RecipeAccordionList;

