import React, { useContext } from 'react';

import { EditableProvider } from 'contexts/editable';
import { RecipeProvider } from 'contexts/recipe';
import { LoggedInContext } from 'contexts/login';
import CreateRecipe from './CreateRecipe';

const CreateRecipeView = () => {
  const { state } = useContext(LoggedInContext);

  return (    
    <EditableProvider>
      <RecipeProvider>
        <CreateRecipe />
      </RecipeProvider>
    </EditableProvider>
  );
}

export default CreateRecipeView;
