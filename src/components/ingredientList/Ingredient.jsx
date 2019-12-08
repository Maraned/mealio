import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

import { RouterContext } from 'contexts/router';
import { AllIngredientsContext } from 'contexts/allIngredients';

import EditableField from 'components/core/EditableField';
import Select from 'components/core/Select';


import './ingredient.css';

const Ingredient = ({ 
  ingredient, 
  updateIngredient, 
  index,
  defaultPortions,
  portions,
  onPaste,
  onRemove,
  groups,
}) => {
  const { t } = useTranslation();
  const [showRemove, setShowRemove] = useState(false);
  const { dispatch: route } = useContext(RouterContext);
  const { state: allIngredients } = useContext(AllIngredientsContext);

  const amountValue = () => {
    if (ingredient.amount) {
      const factor = portions / defaultPortions;
      return parseFloat(ingredient.amount) * factor;
    }
  }

  const updateAmount = event => {
    ingredient.amount = event.target.value;
    updateIngredient(index, ingredient);
  }

  const updateName = ingredient => {
    ingredient.name = ingredient.name;
    ingredient.ingredientId = ingredient.id;
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

  const onAddIngredient = () => {
    console.log('onAddIngredient')
    route({ type: 'newIngredient', value: groups, size: 'auto', allIngredients, });
  };

  return (
    <div className="ingredient">
      <EditableField 
        value={amountValue()} 
        onChange={updateAmount} 
        placeholder={t('Ingredient:Amount')} 
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <EditableField 
        value={ingredient.unit} 
        onChange={updateUnit} 
        placeholder={t('Ingredient:Unit')} 
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      
      <Select 
        onChange={updateName}
        preSelected={ingredient}
        defaultText={t('Ingredient:SelectIngredient')}
        textAttribute="name"
        options={allIngredients}
        addable
        onAddItem={onAddIngredient}
        addItemText={t('Ingredient:NewIngredient')}
        searchable
      />

      <div className="ingredient__remove__container">
        {showRemove && (
          <div className="ingredient__remove">
            <FaTimes onClick={removeIngredient} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Ingredient;
