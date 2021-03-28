import './newIngredients.css';

import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCaretDown, FaCheckSquare, FaTimes } from 'react-icons/fa';
import cc from 'classcat';
import useFlag from 'utils/useFlag';

import { AllIngredientsContext } from 'contexts/allIngredients';
import { IngredientGroupsContext } from 'contexts/ingredientGroups';
import NewIngredient from 'views/admin/newIngredients/PendingNewIngredient';
import IngredientGroupSelector from 'components/ingredientList/IngredientGroupSelector';
import useSearchField from 'components/core/useSearchField';
import { RemoveIngredientsButton } from 'components/core/Button';
import {
  DataGrid,
  GridToolbarContainer,
  GridColumnsToolbarButton,
  GridFilterToolbarButton,
} from '@material-ui/data-grid';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export default function NewIngredients() {
  const { state: allIngredients, dispatch } = useContext(AllIngredientsContext);
  const { state: ingredientGroups } = useContext(IngredientGroupsContext);

  const { t, i18n } = useTranslation();
  console.log('allIngredients', allIngredients)
  const Flag = useFlag();

  const [sortAttribute, setSortAttribute] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState(['pending']);

  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const pendingIngredients = useMemo(() => {
    return allIngredients.filter(ingredient => filters.includes(ingredient.status));
  }, [allIngredients, filters]);

  const [SearchField, filteredIngredients] = useSearchField(pendingIngredients, ['name'], 'grow');

  const getSortAttribute = item => {
    const itemAttribute = item[sortAttribute];
    const attributeType = typeof itemAttribute;

    switch (attributeType) {
      case 'string':
        return itemAttribute;
      case 'object':
        if (Array.isArray(itemAttribute)) {
          return !!itemAttribute;
        } else {
          return itemAttribute ? itemAttribute.name : '';
        }
      default:
        return '';
    }
  };

  const sortedIngredients = useMemo(() => {
    return [...filteredIngredients].sort((a, b) => {
      const aSortAttribute = getSortAttribute(a);
      const bSortAttribute = getSortAttribute(b);

      if (aSortAttribute < bSortAttribute) {
        return sortDirection === 'asc' ? -1 : 1;
      } else if (aSortAttribute > bSortAttribute) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    })
  }, [sortAttribute, sortDirection, filteredIngredients]);

  console.log('sortedIngredients', sortedIngredients)

  const changeLanguage = language => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  };

  const toggleFilter = filterName => {
    if (filters.includes(filterName)) {
      setFilters(filters.filter(existingFilter => existingFilter !== filterName));
    } else {
      setFilters([...filters, filterName]);
    }
  };

  const renderFilter = (filterName, ) => (
    <div
      onClick={() => toggleFilter(filterName)}
      className={cc(['filter margin--right', {
        'filter--selected': filters.includes(filterName),
      }])}
    >
      {filterName}
    </div>
  );

  const renderFilters = () => (
    <div className="flex">
      {renderFilter('pending')}
      {renderFilter('active')}
    </div>
  );

  const renderLanguageOption = language => {
    const isCurrentLanguage = language === i18n.language;
    return (
      <Flag
        className={cc(['flag margin--right clickable', {
          'flag--nonSelected': !isCurrentLanguage
        }])}
        onClick={() => changeLanguage(language)}
      />
    )
  };

  const renderLanguageOptions = () => (
    <div className="flex">
      {renderLanguageOption('SE')}
      {renderLanguageOption('GB')}
    </div>
  );

  const renderHeader = () => (
    <div className="flex vcenter spaceBetween">
      <h2 className="margin--right noShrink">{t('NewIngredients:Title')}</h2>
      {renderFilters()}

      {renderLanguageOptions()}
    </div>
  );

  const renderIsTranslated = params => (
    <div className="flex center vcenter fullWidth">
      {!!t(`Ingredient:${params.row.name}`)
        ? (
          <CheckCircleIcon />
        ) : (
          <ErrorIcon />
        )}
    </div>
  );

  const onIngredientGroupChange = (selectedGroups) => {
    console.log('selectedGroups', {selectedGroups, selectedIngredients})
    for (let id of selectedIngredients) {
      dispatch({ type: 'updateIngredient', value: { id, groups: selectedGroups }})
    }
  };

  const renderGroup = ({ value = [], row }) => {
    const isSelected = selectedIngredients.find(id => id === row.id);
    if (isSelected) {
      return (
        <IngredientGroupSelector
          selectedGroups={value}
          onSelectionChange={onIngredientGroupChange}
        />
      );
    }
    const ingredientGroupNames = value.map(groupId => {
      return ingredientGroups?.find(ingredientGroup => ingredientGroup.id === groupId)?.name;
    });
    return ingredientGroupNames?.join(', ');
  };

  const renderAlternatives = ({ value = [] }) => {
    const alternativeIngredients = value.map(ingredientId => {
      return allIngredients.find(ingredient => ingredient.id === ingredientId)?.name;
    })
    return alternativeIngredients?.join(', ', '')
  };

  const renderStatus = ({ value }) => (
    <div className="center">
      {value === 'pending' ? <FaTimes /> : < FaCheckSquare />}
    </div>
  );

  const renderSearchAndDelete = () => (
    <div className="flex vcenter">
      {!!selectedIngredients.length && (
        <RemoveIngredientsButton
          className="margin--right--large margin--left"
          ingredientIds={selectedIngredients}
        />
      )}
      {SearchField}
    </div>
  );

  const columns = [
    {
      field: 'isTranslated',
      flex: 0.1,
      headerName: t('NewIngredients:IsTranslated'),
      headerAlign: 'center',
      align: 'center',
      renderCell: renderIsTranslated,
    },
    { field: 'name', flex: .25, headerName: t('NewIngredients:Name') },
    {
      field: 'groups',
      flex: .25,
      headerName: t('NewIngredients:Group'),
      disableClickEventBubbling: true,
      renderCell: renderGroup
    },
    { field: 'alternatives', flex: .25, headerName: t('NewIngredients:Alternatives'), valueGetter: renderAlternatives },
    // { field: 'tips', headerName: t('NewIngredients:Tips'), renderCell: renderColumnTitle },
    { field: 'status', headerName: t('NewIngredients:Status'), renderCell: renderStatus },
  ];

  return (
    <div className="newIngredients background fullWidth box">
      {renderHeader()}
      {renderSearchAndDelete()}

      <div className="newIngredients__grid">
        <DataGrid
          disableColumnMenu
          onSelectionChange={e => setSelectedIngredients(e.rowIds)}
          checkboxSelection
          rows={sortedIngredients}
          columns={columns}
        />
      </div>
    </div>
  );
};
