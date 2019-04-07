import React, { useContext } from 'react';

import { EditableProvider } from 'contexts/editable';
import { RecipeProvider } from 'contexts/recipe';
import CreateRecipe from './CreateRecipe';

const CreateRecipeView = () => {
  return (    
    <EditableProvider>
      <RecipeProvider>
        <CreateRecipe />
      </RecipeProvider>
    </EditableProvider>
  );
}

export default CreateRecipeView;
