import React, { useContext, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';
import IngredientModel from 'models/ingredientModel';

import Ingredient from 'components/ingredientList/Ingredient';
import RangeSlider from 'components/core/rangeSlider/RangeSlider';

import './ingredientList.css';

const IngredientList = () => {
  const { state } = useContext(EditableContext);
  const { state: recipe, dispatch: updateRecipe } = useContext(RecipeContext);
  const { t } = useTranslation();
  const { ingredients, portions, defaultPortions = 4 } = recipe;

  const updateIngredient = (index, ingredient) => {
    ingredients[index] = ingredient;
    updateRecipe({ type: 'ingredients', value: ingredients });
  }

  const addIngredient = () => {
    ingredients.push({...IngredientModel});
    updateRecipe({ type: 'ingredients', value: ingredients });
  }

  const updateDefaultPortions = event => {
    updateRecipe({ type: 'defaultPortions', value: event.target.value });
  }

  const updatePortions = event => {
    updateRecipe({ type: 'portions', value: event.target.value });
  }
  
  const portionsAmount = parseInt(portions, 10) || parseInt(defaultPortions, 10);

  return (
    <div className="ingredientList list">
      <div className="ingredientList__header">
        <h4>{t('Recipe:Ingredients')}</h4>
      
        {state.editable && (
          <div>
            <label>{t('Recipe:Portion_plural')}</label>
            <input 
              type="number" 
              value={defaultPortions} 
              max={10} 
              min={1} 
              onChange={updateDefaultPortions}  
            />
          </div>
        )}
      </div>

      {!state.editable && (
        <RangeSlider 
          value={portionsAmount}
          min={1} 
          max={8} 
          label={t('Recipe:Portion', { count: portionsAmount })} 
          onChange={updatePortions}
        />
      )}

      {ingredients.map((ingredient, index) => (
        <Ingredient
          key={'ingredient' + index}
          updateIngredient={updateIngredient} 
          index={index} 
          ingredient={ingredient}
          defaultPortions={defaultPortions}
          portions={portionsAmount}
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
