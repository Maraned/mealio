import './filters.css';

import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RecipeFilterContext } from 'contexts/recipeFilter';

export default function MaxIngredientsFilter() {
  const {
    recipeFilters: { maxIngredientsAmount },
    recipeFilterDispatch
  } = useContext(RecipeFilterContext);
  const [newAmount, setNewAmount] = useState(() => maxIngredientsAmount);

  useEffect(() => {
    setNewAmount(maxIngredientsAmount);
  }, [maxIngredientsAmount]);

  const { t } = useTranslation();

  const updateMaxIngredientsAmount = () => {
    recipeFilterDispatch({ type: 'updateMaxIngredientsAmount', value: newAmount });
  }

  return (
    <>
      <div className="boxDivider" />
      <div className="filter__section flex vcenter">

        <div className="alignSelf--baseline">
          <h4>{t('Filter:MaxIngredients')}</h4>
          <input
            placeholder={t('Filter:MaxIngredientsPlaceholder')}
            type="number"
            onChange={event => setNewAmount(parseInt(event.target.value, 10))}
            onBlur={updateMaxIngredientsAmount}
            value={newAmount}
          />
        </div>
      </div>

      <div className="boxDivider" />
    </>
  );
}
