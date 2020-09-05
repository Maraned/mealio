import React from 'react';

import RecipeDetail from './RecipeDetail';
import { EditableProvider } from 'contexts/editable';
const RecipeDetailWrapper = () => {
  return (
    <EditableProvider editable={false}>
      <RecipeDetail />
    </EditableProvider>
  );
}

export default RecipeDetailWrapper;
