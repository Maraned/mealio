import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from 'components/core/Accordion';
import Select from 'components/core/Select';
import IngredientsFilter from 'views/recipeList/filters/IngredientsFilter';

import './recipeFilter.css';

const RecipeFilter = () => {
  const { t } = useTranslation();

  return (
    <div className="recipeFilter background">
      <Accordion
        className="recipeFilter__accordion"
        title={<span className="recipeFilter__title">{t('Recipe:Filter')}</span>}
      >
        <IngredientsFilter />
      </Accordion>
    </div>
  );
};

export default RecipeFilter;

