import './filters.css';

import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AllIngredientsContext } from 'contexts/allIngredients';
import Select from 'components/core/Select';

export default function IngredientsFilter() {
  const { state: ingredients } = useContext(AllIngredientsContext);
  const [filteredIngredients, setFilteredIngredients] = useState(() => []);
  const { t } = useTranslation();

  const filterOptions = useMemo(() => {
    return ingredients
      // .filter(ingredient => {
      //   return ingredient.status !== 'pending';
      // })
      .map(ingredient => ({
        id: ingredient.id,
        selected: false,
        name: ingredient.name
      })
    )
  }, [ingredients]);

  const removeFilterIngredient = (filteredIngredient) => {
    setFilteredIngredients(filteredIngredients.filter(ingredient => {
      return ingredient.id !== filteredIngredient.id;
    }));
  }

  const toggleIngredientFilter = (filteredIngredient, state) => {
      console.log('filteredIngredient', {
        filteredIngredient,
        state,
      })
    if (filteredIngredient.selected) {
      setFilteredIngredients([...filteredIngredients, filteredIngredient]);
    } else {
      removeFilterIngredient(filteredIngredient);
    }
  }

  return (
    <div className="filter__section margin--top--large flex vcenter">
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
        {filteredIngredients.map(ingredient => (
          <span
            className="margin--right margin--left margin--bottom clickable"
            onClick={() => removeFilterIngredient(ingredient)}
          >
            {ingredient.name}
          </span>
        ))}
      </div>
    </div>
  );
}
