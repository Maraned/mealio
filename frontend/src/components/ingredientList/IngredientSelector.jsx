import React, { useMemo, useContext } from 'react';
import { AllIngredientsContext } from 'contexts/allIngredients';
import Select from 'components/core/Select';

const IngredientSelector = ({ ignoreIds, selected, onChange }) => {
  const { state: allIngredients } = useContext(AllIngredientsContext);

  const sortOptions = options => {
    return options.sort((a, b) => a.name - b.name);
  };

  const options = useMemo(() => {
    if (!ignoreIds && !selected) {
      return sortOptions(allIngredients);
    }
    return sortOptions(allIngredients.filter(ingredient => {
      if (ignoreIds && ignoreIds.includes(ingredient.id)) {
        return false;
      }
      if (selected && selected === ingredient.id) {
        return false;
      }
      return true;
    }));
  }, [ignoreIds, selected, allIngredients]);

  console.log('ingredients', options)

  return (
    <Select
      searchable
      textAttribute="name"
      selectedText={selected?.name}
      onChange={onChange}
      manualStateMode
      manualEditState
      options={options}
    />
  );
};

export default IngredientSelector;
