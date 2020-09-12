import './recipeDetail.css';

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { RecipeContext, RecipeProvider } from 'contexts/recipe';
import { PendingRequestContext } from 'contexts/pendingRequests';
import CreateRecipe from 'views/createRecipe/CreateRecipe';
import Loader from 'components/core/Loader';
import ErrorIcon from 'components/core/icons/ErrorIcon';

const RecipeDetail = () => {
  const { state: recipe } = useContext(RecipeContext);
  const { state } = useContext(PendingRequestContext);
  const { t } = useTranslation();

  if (state.pendingRecipeFetch) {
    return (
      <div className="background grow flex center vcenter">
        <Loader size={4} />
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="background grow flex center vcenter">
        <ErrorIcon isError marginRight />
        {t('Recipe:ShowRecipeFailed')}
      </div>
    )
  }

  return (
    <RecipeProvider recipe={recipe}>
      <CreateRecipe publishedMode />
    </RecipeProvider>
  );
}

export default RecipeDetail;
