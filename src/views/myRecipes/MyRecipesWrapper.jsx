import React, { useState, useContext, useEffect } from 'react';

import { DraftRecipesProvider } from 'contexts/draftRecipes';
import { PublishedRecipesProvider } from 'contexts/publishedRecipes';
import MyRecipes from './MyRecipes';

const MyRecipesWrapper = () => {
  return (
    <PublishedRecipesProvider>
      <DraftRecipesProvider>
        <MyRecipes />
      </DraftRecipesProvider>
    </PublishedRecipesProvider>
  );
}

export default MyRecipesWrapper;