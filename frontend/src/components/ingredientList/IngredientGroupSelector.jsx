import React, { useContext, useMemo } from 'react';
import { IngredientGroupsContext } from 'contexts/ingredientGroups';
import Select from 'components/core/Select';
import { uniq } from 'lodash';
// import Select from '@material-ui/core/Select'

const IngredientGroupSelector = ({ selectedGroups=[], onGroupChange, onSelectionChange }) => {
  const { state: ingredientGroups } = useContext(IngredientGroupsContext);

  const sortOptions = options => {
    return options.sort((a, b) => {
      if (a.selected && !b.selected) { return -1; }
      else if (!a.selected && b.selected) { return 1; }
      else if (a.name < b.name) { return -1; }
      else if (a.name > b.name) { return 1; }
      else { return 0 };
    });
  };

  const ingredientGroupOptions = useMemo(() => {
    const options = ingredientGroups.map(ingredientGroup => {
      const isSelected = selectedGroups.includes(ingredientGroup.id);
      return {
        ...ingredientGroup,
        selected: isSelected
      }
    });

    return sortOptions(options);
  }, [ingredientGroups, selectedGroups]);

  const onChange = group => {
    if (onGroupChange) {
      return onGroupChange(group);
    }
    if (onSelectionChange) {
      let updatedSelectedGroups = [...selectedGroups];
      if (group.selected) {
        updatedSelectedGroups.push(group.id);
      } else {
        updatedSelectedGroups = updatedSelectedGroups.filter(selectedGroup => {
          return selectedGroup !== group.id;
        });
      }

      onSelectionChange(uniq(updatedSelectedGroups));
    }
  };

  return (
    <Select
      textAttribute="name"
      selectedText={selectedGroups.join(', ')}
      onChange={onChange}
      manualStateMode
      manualEditState
      multiSelect
      options={ingredientGroupOptions}
    />
  );
}

export default IngredientGroupSelector;
