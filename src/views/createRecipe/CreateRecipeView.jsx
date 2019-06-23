import React, { useContext } from 'react';

import { RecipeProvider } from 'contexts/recipe';
import { EditableProvider } from 'contexts/editable';
import { AllIngredientsProvider } from 'contexts/allIngredients';
import CreateRecipe from './CreateRecipe';

const CreateRecipeView = props => {
  return (    
    <EditableProvider editable>
      <AllIngredientsProvider>
        <RecipeProvider recipe={props.recipe}>
          <CreateRecipe />
        </RecipeProvider>
      </AllIngredientsProvider>
    </EditableProvider>
  );
}

export default CreateRecipeView;
