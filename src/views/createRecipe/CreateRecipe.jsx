import React, { useContext, useState, useEffect } from 'react';

import { GunContext } from 'contexts/gun';
import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';

import IngredientList from 'components/ingredientList/IngredientList';
import EditableField from 'components/core/EditableField';

import 'views/recipe/recipe.css';

import { t } from 'utils/translation';

const CreateRecipe = () => {
  const Gun = useContext(GunContext);
  const { dispatch } = useContext(EditableContext);
  const { state, dispatch: updateRecipe } = useContext(RecipeContext);

  console.log('state', state)

  const { name } = state;
  
  useEffect(() => {
    dispatch({ type: 'edit' })
  }, []);

  const changeName = event => {
    updateRecipe({ type: 'name', value: event.target.value });
  }

  return (
    <div className="createRecipe recipe">
      <div className="fullWidthContainer fullWidthContainer--centered">
        <EditableField 
          onChange={changeName} 
          value={name}
          className="recipe__name" 
          placeholder={t('Recipe.Name')}
        />
      </div>

      <IngredientList />
    </div>
  )
}

export default CreateRecipe;
