import React from 'react';
import { useTranslation } from 'react-i18next';

import EditableField from 'components/core/EditableField';

import './ingredient.css';

const Ingredient = ({ 
  ingredient, 
  updateIngredient, 
  index,
  defaultPortions,
  portions,
}) => {
  const { t, i18n } = useTranslation();

  const amountValue = () => {
    const factor = portions / defaultPortions;
    return parseInt(ingredient.amount, 10) * factor;
  }

  const updateAmount = event => {
    ingredient.amount = event.target.value;
    updateIngredient(index, ingredient);
  }

  const updateName = event => {
    ingredient.name = event.target.value;
    updateIngredient(index, ingredient);
  }

  const updateUnit = event => {
    ingredient.unit = event.target.value;
    updateIngredient(index, ingredient);
  }

  return (
    <div className="ingredient">
      <EditableField 
        value={amountValue()} 
        onChange={updateAmount} 
        placeholder={t('Ingredient.Amount')} 
      />

      <EditableField 
        value={ingredient.unit} 
        onChange={updateUnit} 
        placeholder={t('Ingredient.Unit')} 
      />

      <EditableField 
        value={ingredient.name} 
        onChange={updateName} 
        placeholder={t('Ingredient.Name')} 
      />
    </div>
  )
}

export default Ingredient;
