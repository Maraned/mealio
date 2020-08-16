import './recipeAccordion.css';

import React, { useState, useEffect } from 'react';
import posed from 'react-pose';
import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import cc from 'classcat';

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
  const [delayedOpen, setDelayedOpen] = useState(false);
  const { t } = useTranslation();

  // This delay is to allow the conditional rendering to work with the pose animation
  useEffect(() => {
    setTimeout(() => setDelayedOpen(open), 300);
  }, [open]);

  const useDelay = !open ? delayedOpen : open;

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
        {useDelay && (
          <CreateRecipeView recipe={recipe} />
        )}
      </Content>
    </div>
  );
};

export default RecipeAccordion;
