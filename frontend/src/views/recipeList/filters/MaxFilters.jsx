import './filters.css';

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RecipeFilterContext } from 'contexts/recipeFilter';
import { FaSortNumericDown, FaClock } from 'react-icons/fa';

import Input from 'components/core/Input';

export default function MaxIngredientsFilter() {
  const {
    recipeFilters: { maxIngredientsAmount, maxCookingTime },
    recipeFilterDispatch
  } = useContext(RecipeFilterContext);
  const { t } = useTranslation();

  const updateMaxIngredientsAmount = newMaxIngredientsAmount => {
    recipeFilterDispatch({ type: 'updateMaxIngredientsAmount', value: newMaxIngredientsAmount });
  };

  const updateMaxCookingTime = newMaxCookingTime => {
    recipeFilterDispatch({ type: 'updateMaxCookingTime', value: newMaxCookingTime });
  };

  return (
    <>
      <div className="boxDivider" />
      <div className="filter__section flex vcenter">

        <div className="alignSelf--baseline grid column-2">
          <div className="border--right padding--right--large">
            <h4 className="flex vcenter">
              <FaSortNumericDown className="margin--right" />
              {t('Filter:MaxIngredients')}
            </h4>

            <Input
              placeholder={t('Filter:MaxIngredientsPlaceholder')}
              type="number"
              onChange={updateMaxIngredientsAmount}
              value={maxIngredientsAmount}
            />
          </div>

          <div>
            <h4 className="flex vcenter">
              <FaClock className="margin--right" />
              {t('Filter:MaxCookingTime')}
            </h4>

            <Input
              placeholder={t('Filter:MaxCookingTimePlaceholder')}
              onChange={updateMaxCookingTime}
              value={maxCookingTime}
              unit="Minute"
              size={50}
              textAlign="center"
            />
          </div>
        </div>
      </div>

      <div className="boxDivider" />
    </>
  );
}
