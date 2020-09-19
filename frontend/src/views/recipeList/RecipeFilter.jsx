import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RecipeFilterContext } from 'contexts/recipeFilter';
import Accordion from 'components/core/Accordion';
import IngredientsFilter from 'views/recipeList/filters/IngredientsFilter';

import { FaPepperHot } from 'react-icons/fa';

import './recipeFilter.css';

const RecipeFilter = () => {
  const { recipeFilters } = useContext(RecipeFilterContext);
  const { t } = useTranslation();

  const {
    filteredRecipesCount,
    allRecipesCount,
    filteredIngredientCount,
  } = useMemo(() => {
    const filteredRecipesCount = recipeFilters.filteredRecipes.length;
    const allRecipesCount = recipeFilters.allRecipes.length;
    const filteredIngredientCount = recipeFilters.ingredientFilters.length;

    return {
      filteredRecipesCount,
      allRecipesCount,
      filteredIngredientCount,
    }
  }, [recipeFilters]);

  const accordionHeaderContent = () => (
    <div className="flex column">
      {!!filteredRecipesCount && !!allRecipesCount && (
        <div>
          {t('Filter:SearchAmount', { filteredRecipesCount, allRecipesCount })}
        </div>
      )}
      {!!filteredIngredientCount && (
        <div>
          <FaPepperHot className="margin--right" />
          {t('Filter:FilteredIngredients', { count: filteredIngredientCount})}
        </div>
      )}
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
      </Accordion>
    </div>
  );
};

export default RecipeFilter;

