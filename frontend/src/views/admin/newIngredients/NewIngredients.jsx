import './newIngredients.css';

import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCaretDown, FaPen, FaTrash } from 'react-icons/fa';
import cc from 'classcat';
import Flags from 'country-flag-icons/react/3x2';

import { AllIngredientsContext } from 'contexts/allIngredients';
import NewIngredient from 'views/admin/newIngredients/PendingNewIngredient';
import useSearchField from 'components/core/useSearchField';

export default function NewIngredients() {
  const { state: allIngredients } = useContext(AllIngredientsContext);
  const { t, i18n } = useTranslation();

  const [sortAttribute, setSortAttribute] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState(['pending']);

  const changeSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const changeSortAttribute = attribute => {
    if (sortAttribute === attribute) {
      changeSortDirection();
    } else {
      setSortAttribute(attribute);
    }
  };


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
  }

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
    const Flag = Flags[language];
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

  const renderColumnTitle = (title, attribute) => (
    <span className={cc(['newIngredients__title', { 
      'newIngredients__title--selected': attribute === sortAttribute 
    }])}>
      <span onClick={() => changeSortAttribute(attribute)}>{title}</span>

      <FaCaretDown 
        className={cc(['newIngredients__sortCaret', {
          'newIngredients__sortCaret--down': sortDirection === 'asc',
          'newIngredients__sortCaret--up': sortDirection === 'desc',
        }])}
        onClick={() => changeSortDirection(attribute)} 
      />
    </span>
  );

  const renderLine = id => (
    <>
      <div className="line" key={`line1-${id}`} />
      <div className="line" key={`line2-${id}`} />
      <div className="line" key={`line3-${id}`} />
      <div className="line" key={`line4-${id}`} />
      <div className="line" key={`line5-${id}`} />
      <div className="line" key={`line6-${id}`} />
      <div className="line" key={`line7-${id}`} />
    </>
  );

  return (
    <div className="newIngredients background fullWidth box">
      {renderHeader()}

      {SearchField}

      <div className="newIngredients__list scrollable">    
        <span className="newIngredients__titleIcon" />
        {renderColumnTitle(t('NewIngredients:Name'), 'name')}
        {renderColumnTitle(t('NewIngredients:Group'), 'group')}
        {renderColumnTitle(t('NewIngredients:Alternatives'), 'alternatives')}
        {renderColumnTitle(t('NewIngredients:Tips'), 'tips')}
        {renderColumnTitle(t('NewIngredients:Status'), 'status')}
        <span />

        {sortedIngredients.map((newIngredient, index) => {
          return (
            <>
              <NewIngredient newIngredient={newIngredient} key={newIngredient.id} />
              {index !== sortedIngredients.length - 1 && renderLine(newIngredient.id)}
            </>
          )
        })}
      </div>
    </div>
  );
};
