import React from 'react';

import { RecipeProvider } from 'contexts/recipe';
import { EditableProvider } from 'contexts/editable';
import CreateRecipe from './CreateRecipe';

const CreateRecipeView = props => {
  return (
    <EditableProvider editable={props.editable}>
      <RecipeProvider recipe={props.recipe}>
        <CreateRecipe />
      </RecipeProvider>
    </EditableProvider>
  );
}

export default CreateRecipeView;
