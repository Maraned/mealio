import './button.css';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import ModalRoute from 'components/core/ModalRoute';
import { useTranslation } from 'react-i18next';

export const RemoveButton = ({ onRemove, className }) => {
  const classes = ['removeButton', className].join(' ');
  return (
    <button className={classes} onClick={onRemove}>
      <FaTrash />
    </button>
  );
};

export const RemoveIngredientsButton = ({ ingredientIds, ...props }) => {
  return (
    <ModalRoute
      pathname="/removeIngredients"
      state={{ ingredientIds }}
    >
      <RemoveButton {...props} />
    </ModalRoute>
  );
};

export const CancelButton = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <button className="button cancel" onClick={onClick}>
      {t('Common:Cancel')}
    </button>
  )
};
