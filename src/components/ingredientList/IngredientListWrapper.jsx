import React, { useContext } from 'react';
import cc from 'classcat';
import { useTranslation } from 'react-i18next';

import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';

import IngredientList from 'components/ingredientList/IngredientList';
import RangeSlider from 'components/core/rangeSlider/RangeSlider';

export default function IngredientListWrapper() {
  const { state } = useContext(EditableContext);
  const { state: recipe, dispatch: updateRecipe } = useContext(RecipeContext);
  console.log('recipe', recipe)
  const { ingredientGroups, portions, portionsType, defaultPortions } = recipe;
  const { t } = useTranslation();

  const updatePortions = event => {
    updateRecipe({ type: 'update', value: { portions: event.target.value }});
  }

  const portionsAmount = portions 
    ? parseInt(portions, 10) 
    : parseInt(defaultPortions, 10);

  const getPortionsTypeKey = () => {
    switch (portionsType) {
      case 'sats':
        return 'Sats';
      default:
        return 'Portion';
    }
  }

  return (
    <div className={cc(['ingredientList', 'list', 'background', 'listSpacing', {
      'ingredientList--editMode': state.editable
    }])}>
      <div className="ingredientList__header">
        <h4>{t('Recipe:Ingredients')}</h4>
      </div>

      <RangeSlider 
        value={portionsAmount}
        min={1} 
        max={8} 
        label={t(`Recipe:${getPortionsTypeKey()}`, { count: portionsAmount })} 
        onChange={updatePortions}
        className="center"
      />

      {ingredientGroups 
        ? ingredientGroups.map(({ name, ingredients }, index) => (
          <>
            <h3>{name}</h3>
            <IngredientList 
              groupIngredients={ingredients} 
              marginBottom={index !== (ingredientGroups.length - 1)} 
            />
          </>
        )

      ) : (
        <IngredientList />
      )}

    </div>
  );
}