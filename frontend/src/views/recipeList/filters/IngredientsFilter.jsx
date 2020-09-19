import './filters.css';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AllIngredientsContext } from 'contexts/allIngredients';
import { RecipeFilterContext } from 'contexts/recipeFilter';

import Select from 'components/core/Select';

export default function IngredientsFilter() {
  const { state: ingredients } = useContext(AllIngredientsContext);
  const {
    recipeFilters: { ingredientFilters },
    recipeFilterDispatch
  } = useContext(RecipeFilterContext);
  const { t } = useTranslation();

  const filterOptions = useMemo(() => {
    const preSelectedIngredientIds = ingredientFilters?.map(ingredient => ingredient.id) || [];
    return ingredients
      // .filter(ingredient => {
      //   return ingredient.status !== 'pending';
      // })
      .map(ingredient => ({
        id: ingredient.id,
        selected: preSelectedIngredientIds.includes(ingredient.id),
        name: ingredient.name
      })
    )
  }, [ingredients, ingredientFilters]);

  const removeFilterIngredient = (filteredIngredient) => {
    const updatedIngredientFilters = ingredientFilters.filter(ingredient => {
      return ingredient.id !== filteredIngredient.id;
    });
    recipeFilterDispatch({ type: 'updateIngredientFilters', value: updatedIngredientFilters });
  }

  const toggleIngredientFilter = (filteredIngredient, state) => {
    if (filteredIngredient.selected) {
      recipeFilterDispatch({
        type: 'updateIngredientFilters',
        value: [...ingredientFilters, filteredIngredient]
      });
    } else {
      removeFilterIngredient(filteredIngredient);
    }
  }

  return (
    <>
      <div className="boxDivider" />
      <div className="filter__section flex vcenter">

        <div className="alignSelf--baseline">
          <h4>{t('Filter:Ingredients')}</h4>
          <Select
            searchable
            multiSelect
            options={filterOptions}
            textAttribute="name"
            manualStateMode={true}
            manualEditState={true}
            onChange={toggleIngredientFilter}
          />
        </div>

        <div className="flex grow wrap">
          {ingredientFilters.map(ingredient => (
            <span
              key={`selected-ingredient-filter-${ingredient.id}`}
              className="margin--right margin--left margin--bottom clickable filter__selectedOption"
              onClick={() => removeFilterIngredient(ingredient)}
            >
              {ingredient.name}
            </span>
          ))}
        </div>
      </div>

      <div className="boxDivider" />
    </>
  );
}
