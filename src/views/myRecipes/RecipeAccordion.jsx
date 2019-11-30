import React, { useState } from 'react';
import posed from 'react-pose';
import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import cc from 'classcat';

import './recipeAccordion.css'
import { useTranslation } from 'react-i18next';

const Content = posed.div({
  enter: {
    y: 0,
    height: 'auto'
  },
  exit: {
    y: "-100%",
    height: '0px'
  }
})


const RecipeAccordion = ({ recipe }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();


  return (
    <div 
      className={cc(['recipeAccordion', {
        boxShadow: !open
      }])} 
      key={recipe.id}
    >
      <div 
        className={cc(['recipeAccordion__header', {
          'recipeAccordion__header--draft': recipe.draft
        }])}
        onClick={() => setOpen(!open)}
      >
        <label className="recipeAccordion__recipeStatus">
          {recipe.draft ? t('Recipe:Draft') : t('Recipe:Published')}
        </label>
        {recipe.name}
      </div>

      <Content className="recipeAccordion__content" initialPose="exit" pose={open ? "enter" : "exit"}>
        <CreateRecipeView recipe={recipe} />
      </Content>
    </div>
  );
};

export default RecipeAccordion;
