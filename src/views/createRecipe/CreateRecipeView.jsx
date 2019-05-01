import React, { useContext } from 'react';

import { RecipeProvider } from 'contexts/recipe';
import { EditableProvider } from 'contexts/editable';
import CreateRecipe from './CreateRecipe';

const CreateRecipeView = props => {
  console.log('props', props)
  return (    
    <EditableProvider>
      <RecipeProvider recipe={props.recipe}>
        <CreateRecipe />
      </RecipeProvider>
    </EditableProvider>
  );
}

export default CreateRecipeView;
