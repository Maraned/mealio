import './filters.css';

import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AllIngredientsContext } from 'contexts/allIngredients';
import { RecipeFilterContext } from 'contexts/recipeFilter';
import { FaPepperHot } from 'react-icons/fa';

import Select from 'components/core/Select';
import Filter from 'views/recipeList/filters/Filter';

export default function IngredientsFilter() {
  const { state: ingredients } = useContext(AllIngredientsContext);
  const {
    recipeFilters: { ingredientFilters, allIngredientOptions },
    recipeFilterDispatch
  } = useContext(RecipeFilterContext);
  const { t } = useTranslation();

  const filterOptions = useMemo(() => {
    const preSelectedIngredientIds = ingredientFilters?.map(ingredient => ingredient.id) || [];
    return allIngredientOptions
      .map(ingredient => ({
        id: ingredient.id,
        selected: preSelectedIngredientIds.includes(ingredient.id),
        name: ingredient.name
      })
    );
  }, [allIngredientOptions, ingredientFilters]);

  const removeFilterIngredient = (filteredIngredient) => {
    const updatedIngredientFilters = ingredientFilters.filter(ingredient => {
      return ingredient.id !== filteredIngredient.id;
    });
    recipeFilterDispatch({ type: 'updateIngredientFilters', value: updatedIngredientFilters });
  };

  const toggleIngredientFilter = filteredIngredient => {
    if (filteredIngredient.selected) {
      recipeFilterDispatch({
        type: 'updateIngredientFilters',
        value: [...ingredientFilters, filteredIngredient]
      });
    } else {
      removeFilterIngredient(filteredIngredient);
    }
  };

  return (
    <Filter
      Icon={FaPepperHot}
      title={t('Filter:Ingredients')}
    >
      <div className="grid column-2">
        <Select
          searchable
          multiSelect
          options={filterOptions}
          textAttribute="name"
          manualStateMode={true}
          manualEditState={true}
          onChange={toggleIngredientFilter}
        />

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
    </Filter>
  );
}
