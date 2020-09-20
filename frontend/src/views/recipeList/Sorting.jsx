import React, { useMemo, useContext } from 'react';
import { RecipeFilterContext } from 'contexts/recipeFilter';

import {
  FaSortNumericDown,
  FaSortNumericDownAlt,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
} from 'react-icons/fa';

import Select from 'components/core/Select';

export default function Sorting() {
  const { recipeFilters, recipeFilterDispatch } = useContext(RecipeFilterContext);

  const {
    sortBy,
    sortDirection,
  }= useMemo(() => ({
    sortBy: recipeFilters.sortBy,
    sortDirection: recipeFilters.sortDirection,
  }), [recipeFilters]);

  const sortByOptions = useMemo(() => [
    {
      id: 'publishedDate',
      text: 'Published date',
      selected: 'publishedDate' === sortBy,
      ascSortIcon: FaSortNumericDown,
      descSortIcon: FaSortNumericDownAlt
    },
    {
      id: 'score',
      text: 'Popularity',
      selected: 'score' === sortBy,
      ascSortIcon: FaSortNumericDown,
      descSortIcon: FaSortNumericDownAlt
    },
    {
      id: 'name',
      text: 'Name',
      selected: 'name' === sortBy,
      ascSortIcon: FaSortAlphaDown,
      descSortIcon: FaSortAlphaDownAlt
    },
  ], [sortBy]);

  const selectedOrderOption = useMemo(() => {
    return sortByOptions.find(option => option.id === sortBy);
  }, [sortBy]);

  const changeSortBy = value => {
    recipeFilterDispatch({ type: 'updateSortBy', value: value.id });
  };

  const toggleSortDirection = () => {
    const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    recipeFilterDispatch({ type: 'updateSortDirection', value: newSortDirection });
  };

  return (
    <div className="flex vcenter">
      <Select
        manualStateMode
        manualEditState
        smallPadding
        preSelected={selectedOrderOption}
        options={sortByOptions}
        onChange={changeSortBy}
      />

      {selectedOrderOption && (
        <div className="iconButton clickable" onClick={toggleSortDirection}>
          {sortDirection === 'asc' ? (
            <selectedOrderOption.ascSortIcon />
          ) : (
            <selectedOrderOption.descSortIcon />
          )}
        </div>
      )}
    </div>
  );
}
