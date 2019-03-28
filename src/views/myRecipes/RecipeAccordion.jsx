import React, { useState } from 'react';
import posed, { PoseGroup } from 'react-pose';
import { RecipeProvider } from 'contexts/recipe';
import { EditableProvider } from 'contexts/editable';
import CreateRecipeView from 'views/createRecipe/CreateRecipe';
import { tween } from 'popmotion'
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
    height: '1px'
  }
})


const RecipeAccordion = ({ recipe }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  console.log('recipe', recipe)

  return (
    <div 
      className="recipeAccordion" 
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

      <EditableProvider>
        <RecipeProvider recipe={recipe}>
          <Content className="recipeAccordion__content" initialPose="exit" pose={open ? "enter" : "exit"}>
            <CreateRecipeView />
          </Content>
        </RecipeProvider>
      </EditableProvider>
    </div>
  );
};

export default RecipeAccordion;
