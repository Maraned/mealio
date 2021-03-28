import React, { useState } from 'react';
import IngredientSelector from 'components/ingredientList/IngredientSelector';
import { getRequest } from 'utils/request';
import { useTranslation } from 'react-i18next';

const RemoveIngredient = ({ ingredient, onChange }) => {
  const [ingredientReplacement, setIngredientReplacement] = useState(null);
  const { t } = useTranslation();

  const onIngredientReplacementChange = updatedIngredientReplacement => {
    console.log('onIngredientReplacementChange')
    setIngredientReplacement(updatedIngredientReplacement);
    if (onChange) {
      onChange({ [ingredient.id]: updatedIngredientReplacement.id });
    }
  };

  return (
    <>
      <div>{ingredient.name}</div>
      <div>
        {t('RemoveIngredients:RecipeCount', {
          count: ingredient.usedInRecipes.length
        })}
      </div>
      <IngredientSelector
        selected={ingredientReplacement}
        onChange={onIngredientReplacementChange}
      />
    </>
  );

};

export default RemoveIngredient