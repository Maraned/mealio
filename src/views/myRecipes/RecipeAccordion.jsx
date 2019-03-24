import React, { useState } from 'react';
import posed, { PoseGroup } from 'react-pose';
import { RecipeProvider } from 'contexts/recipe';
import { EditableProvider } from 'contexts/editable';
import CreateRecipeView from 'views/createRecipe/CreateRecipe';
import { tween } from 'popmotion'

import './recipeAccordion.css'

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


  return (
    <div 
      className="recipeAccordion" 
      key={recipe.id}
    >
      <div 
        className="recipeAccordion__header"
        onClick={() => setOpen(!open)}
      >
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
