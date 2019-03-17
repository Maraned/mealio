import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

import EditableField from 'components/core/EditableField';

import './ingredient.css';

const Ingredient = ({ 
  ingredient, 
  updateIngredient, 
  index,
  defaultPortions,
  portions,
  onPaste,
  onRemove,
}) => {
  const { t, i18n } = useTranslation();
  const [showRemove, setShowRemove] = useState(false);

  const amountValue = () => {
    const factor = portions / defaultPortions;
    return parseFloat(ingredient.amount) * factor;
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

  const removeIngredient = () => {
    onRemove(index, ingredient);
  }

  const onFocus = () => {
    setShowRemove(true);
  }

  const onBlur = () => {
    setShowRemove(false);
  }

  return (
    <div className="ingredient">
      <EditableField 
        value={amountValue()} 
        onChange={updateAmount} 
        placeholder={t('Ingredient.Amount')} 
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <EditableField 
        value={ingredient.unit} 
        onChange={updateUnit} 
        placeholder={t('Ingredient.Unit')} 
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <EditableField 
        value={ingredient.name} 
        onChange={updateName} 
        placeholder={t('Ingredient.Name')} 
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {showRemove && (
        <div className="ingredient__remove">
          <FaTimes onClick={removeIngredient} />
        </div>
      )}
    </div>
  )
}

export default Ingredient;
