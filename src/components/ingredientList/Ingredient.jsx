import React from 'react';
import { useTranslation } from 'react-i18next';

import EditableField from 'components/core/EditableField';

import './ingredient.css';

const Ingredient = ({ 
  ingredient, 
  updateIngredient, 
  index 
}) => {
  const { t, i18n } = useTranslation();

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
        value={ingredient.amount} 
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
