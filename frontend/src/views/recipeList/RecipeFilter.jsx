import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RecipeFilterContext } from 'contexts/recipeFilter';
import Accordion from 'components/core/Accordion';
import IngredientsFilter from 'views/recipeList/filters/IngredientsFilter';
import MaxIngredientsFilter from 'views/recipeList/filters/MaxIngredientsFilter';

import { FaPepperHot, FaSortNumericDown } from 'react-icons/fa';

import './recipeFilter.css';

const RecipeFilter = () => {
  const { recipeFilters } = useContext(RecipeFilterContext);
  const { t } = useTranslation();

  const {
    filteredRecipesCount,
    allRecipesCount,
    filteredIngredientCount,
    maxIngredientsAmount,
  } = useMemo(() => {
    const filteredRecipesCount = recipeFilters.filteredRecipes.length;
    const allRecipesCount = recipeFilters.allRecipes.length;
    const filteredIngredientCount = recipeFilters.ingredientFilters.length;
    const maxIngredientsAmount = recipeFilters.maxIngredientsAmount;

    return {
      filteredRecipesCount,
      allRecipesCount,
      filteredIngredientCount,
      maxIngredientsAmount,
    }
  }, [recipeFilters]);

  const accordionHeaderContent = () => (
    <div className="flex column">
      {!!filteredRecipesCount && !!allRecipesCount && (
        <div className="margin--right margin--bottom--small">
          {t('Filter:SearchAmount', { filteredRecipesCount, allRecipesCount })}
        </div>
      )}

      <div className="flex wrap">
        {!!filteredIngredientCount && (
          <div className="margin--right flex vcenter border--right noBorderOnLastChild">
            <FaPepperHot className="margin--right" />
            {t('Filter:FilteredIngredients', { count: filteredIngredientCount})}
          </div>
        )}

        {!!maxIngredientsAmount && (
          <div className="margin--right flex vcenter border--right noBorderOnLastChild">
            <FaSortNumericDown className="margin--right" />
            {t('Filter:FilteredMaxIngredients', { count: maxIngredientsAmount})}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="recipeFilter box background">
      <Accordion
        className="recipeFilter__accordion"
        title={<span className="recipeFilter__title">{t('Recipe:Filter')}</span>}
        headerContent={accordionHeaderContent()}
      >
        <IngredientsFilter />
        <MaxIngredientsFilter />
      </Accordion>
    </div>
  );
};

export default RecipeFilter;

