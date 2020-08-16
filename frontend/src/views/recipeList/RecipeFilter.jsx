import React from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from 'components/core/Accordion';
import Select from 'components/core/Select';

import './recipeFilter.css';

const RecipeFilter = () => {
  const { t } = useTranslation();
  const sorting = [
    { text: 'Namn A-Ö' },
    { text: 'Namn Ö-A' },
  ];

  return (
    <div className="recipeFilter background">
      <Accordion 
        className="recipeFilter__accordion" 
        title={<span className="recipeFilter__title">{t('Recipe:Filter')}</span>}
      >

      </Accordion>

      <Select
        defaultText={t('Recipe:Sort')}
        options={sorting}
      />
    </div>
  );
};

export default RecipeFilter;

