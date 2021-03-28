import './removeIngredients.css';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalContent, ModalButtons } from 'components/modal/Modal';
import { AllIngredientsContext } from 'contexts/allIngredients';
import ScrollBox from 'components/core/ScrollBox';
import RemoveIngredient from 'components/ingredientList/RemoveIngredient';
import { getRequest, postRequest } from 'utils/request';

const RemoveIngredients = ({ ingredientIds }) => {
  const { t } = useTranslation();
  const { state: allIngredients, dispatch } = useContext(AllIngredientsContext);
  const [ingredientReplacements, setIngredientReplacements] = useState({});
  const [ingredientRecipes, setIngredientRecipes] = useState({});

  const getRecipesUsingIngredients = async () => {
    const recipesUsingIngredients = await getRequest('recipes', {
      ingredientIds
    });
    setIngredientRecipes(recipesUsingIngredients);
  }

  const ingredients = useMemo(() => {
    if (!ingredientIds?.length || !allIngredients?.length) {
      return [];
    }
    return ingredientIds.map(id => {
      return allIngredients.find(ingredient => ingredient.id === id);
    });
  }, [ingredientIds, allIngredients]);

  useEffect(() => {
    getRecipesUsingIngredients();
  }, []);

  const ingredientsToBeRemoved = useMemo(() => {
    return ingredients.map(ingredient => ({
      ...ingredient,
      usedInRecipes: ingredientRecipes?.[ingredient.id] || []
    }));
  }, [ingredients, ingredientRecipes]);

  console.log('removeIngredients ingredientIds', ingredientIds);

  const updateIngredientReplacements = ingredientReplacement => {
    const updatedIngredientReplacements = {
      ...ingredientReplacements,
      ...ingredientReplacement
    };
    console.log('updatedIngredientReplacements',updatedIngredientReplacements)
    setIngredientReplacements(updatedIngredientReplacements);
  };

  const renderColumnTitles = () => (
    <>
      <div className="grid__title">{t('RemoveIngredients:ColumnName')}</div>
      <div className="grid__title">{t('RemoveIngredients:ColumnUsedIn')}</div>
      <div className="grid__title">{t('RemoveIngredients:ColumnReplacement')}</div>
    </>
  );

  const renderIngredients = () => (
    <ScrollBox className="removeIngredients__ingredients">
      {renderColumnTitles()}
      {ingredientsToBeRemoved.map(ingredient => (
        <RemoveIngredient
          key={ingredient.id}
          ingredient={ingredient}
          onChange={updateIngredientReplacements}
        />
      ))}
    </ScrollBox>
  );

  const removeIngredients = async () => {
    console.log('ingredientReplacements', ingredientReplacements);
    const ingredients = ingredientIds.map(id => ({
      id,
      replacementId: ingredientReplacements[id]
    }));
    await postRequest(`ingredients/delete`, { ingredients });
  };

  return (
    <>
      <ModalContent className="removeIngredients">
        {renderIngredients()}
      </ModalContent>
      <ModalButtons
        center
        saveText={t('RemoveIngredients:SaveText')}
        onSave={removeIngredients}
      />
    </>
  );
};

export default RemoveIngredients;
