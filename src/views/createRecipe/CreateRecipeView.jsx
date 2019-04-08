import React, { useContext } from 'react';

import { EditableProvider } from 'contexts/editable';
import CreateRecipe from './CreateRecipe';

const CreateRecipeView = () => {
  return (    
    <EditableProvider>
      <CreateRecipe />
    </EditableProvider>
  );
}

export default CreateRecipeView;
