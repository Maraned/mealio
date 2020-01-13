import './ingredient.css';

import React, { useState, useContext, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import cc from 'classcat';
import { useHistory, useLocation } from 'react-router-dom';

import { AllIngredientsContext } from 'contexts/allIngredients';
import { EditableContext } from 'contexts/editable';

import EditableField from 'components/core/EditableField';
import Select from 'components/core/Select';

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
  const { state: allIngredients } = useContext(AllIngredientsContext);
  const { state: editState } = useContext(EditableContext);
  const history = useHistory();
  const location = useLocation();
  const onPasteCalled = useRef(false);

  const amountValue = () => {
    if (ingredient.amount) {
      const factor = portions / defaultPortions;
      return parseFloat(ingredient.amount) * factor;
    }
  };

  const updateAmount = value => {
    if (onPasteCalled.current) {
      onPasteCalled.current = false;
      return;
    }
    ingredient.amount = value;
    updateIngredient(index, ingredient);
  };

  const updateName = ingredientOption => {
    if (onPasteCalled.current) {
      onPasteCalled.current = false;
      return;
    }
    ingredient.name = ingredientOption.name;
    ingredient.ingredientId = ingredientOption.id;
    updateIngredient(index, ingredient);
  };

  const updateUnit = value => {
    if (onPasteCalled.current) {
      onPasteCalled.current = false;
      return;
    }
    ingredient.unit = value;
    updateIngredient(index, ingredient);
  };

  const removeIngredient = () => {
    onRemove(index, ingredient);
  };

  const onFocus = () => {
    setShowRemove(true);
  };

  const onBlur = () => {
    setShowRemove(false);
  };

  const onPasteHandler = text => {
    onPasteCalled.current = true;
    if (onPaste) {
      onPaste(text);
    }
  };

  const onAddIngredient = () => {
    history.push({
      pathname: '/newIngredient',
      state: { name: ingredient.name, groups, modal: true, previousLocation: location }
    });
  };

  const showNameError = useCallback(() => {
    return !allIngredients.find(existingIngredient => {
      return existingIngredient.name === ingredient.name
    });
  }, [ingredient, allIngredients]);

  return (
    <div className={cc(['ingredient', {
      'ingredient--editMode': editState.editable
    }])}>
      <EditableField 
        value={amountValue()} 
        onChange={updateAmount} 
        type="text"
        placeholder={t('Ingredient:Amount')} 
        onPaste={onPasteHandler}
        onFocus={onFocus}
        onBlur={onBlur}
        autoWidth
      />

      <EditableField 
        value={ingredient.unit} 
        onChange={updateUnit} 
        type="text"
        placeholder={t('Ingredient:Unit')} 
        onPaste={onPasteHandler}
        onFocus={onFocus}
        onBlur={onBlur}
        autoWidth
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
        error={showNameError()}
      />

      {editState.editable && (
        <div className="ingredient__remove__container">
          {showRemove && (
            <div className="ingredient__remove">
              <FaTimes onClick={removeIngredient} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Ingredient;
