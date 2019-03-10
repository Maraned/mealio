import React, { useContext, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';
import IngredientModel from 'models/ingredientModel';

import Ingredient from 'components/ingredientList/Ingredient';

import './ingredientList.css';

const IngredientList = () => {
  const { state } = useContext(EditableContext);
  const { state: recipe, dispatch: updateRecipe } = useContext(RecipeContext);
  const { t } = useTranslation();
  const { ingredients } = recipe;

  const updateIngredient = (index, ingredient) => {
    ingredients[index] = ingredient;
    updateRecipe({ type: 'ingredients', value: ingredients })
  }

  const addIngredient = () => {
    ingredients.push({...IngredientModel});
    updateRecipe({ type: 'ingredients', value: ingredients })
  }

  return (
    <div className="ingredientList list">
      <h4>{t('Recipe:Ingredients')}</h4>
      {ingredients.map((ingredient, index) => (
        <Ingredient
          key={'ingredient' + index}
          updateIngredient={updateIngredient} 
          index={index} 
          ingredient={ingredient}
        />
      ))}
      {state.editable && (
        <button onClick={addIngredient}>
          {t('Recipe:AddIngredient')}
        </button>
      )}
    </div>
  )
}

export default IngredientList;
