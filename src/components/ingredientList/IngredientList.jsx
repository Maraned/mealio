import './ingredientList.css';

import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cc from 'classcat';

import { getRequest } from 'utils/request';

import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';
import { RouterContext } from 'contexts/router';
import { AllIngredientsContext } from 'contexts/allIngredients';
import IngredientModel from 'models/ingredientModel';

import Ingredient from 'components/ingredientList/Ingredient';
import RangeSlider from 'components/core/rangeSlider/RangeSlider';

const IngredientList = () => {
  const { state } = useContext(EditableContext);
  const { state: recipe, dispatch: updateRecipe } = useContext(RecipeContext);
  const { dispatch: changeView } = useContext(RouterContext);
  const { dispatch: allIngredientsDispatch } = useContext(AllIngredientsContext);
  const { t } = useTranslation();
  const { ingredients, portions, defaultPortions = 4 } = recipe;
  const [ ingredientGroups, setIngredientGroups ] = useState([]); 

  const fetchIngredients = async () => {
    const newAllIngredients = await getRequest('ingredients');
    if (!ingredients.error) {
      allIngredientsDispatch({ type: 'update', value: newAllIngredients });
    }
  };

  const fetchIngredientGroups = async () => {
    const ingredientGroups = await getRequest('ingredients/groups');
    setIngredientGroups(ingredientGroups);
  };

  useEffect(() => {
    if (state.editable) {
      fetchIngredients();
      fetchIngredientGroups();
    }
  }, []);

  const updateIngredient = (index, ingredient) => {
    ingredients[index] = ingredient;
    updateRecipe({ type: 'ingredients', value: ingredients });
  }

  const addIngredient = () => {
    ingredients.push({...IngredientModel});
    updateRecipe({ type: 'ingredients', value: ingredients });
  }

  const updateDefaultPortions = event => {
    updateRecipe({ type: 'defaultPortions', value: event.target.value });
  }

  const updatePortions = event => {
    updateRecipe({ type: 'portions', value: event.target.value });
  }

  const updateIngredients = ingredients => {
    updateRecipe({ type: 'ingredients', value: ingredients });
  }

  const removeIngredient = (index, ingredient) => {
    const modifiedIngredients = [...ingredients];
    modifiedIngredients.splice(index, 1);
    updateRecipe({ type: 'ingredients', value: modifiedIngredients });
  }

  const parseIngredientText = ingredientText => {
    const fullIngredientRegex = /([\d,\.]+)\s(.+?)\s(.+)/;
    const lines = ingredientText.split('\n');
    const parsedIngredients = [];

    for (let i = 0; i < lines.length; i++) {
      const matches = lines[i].match(fullIngredientRegex);
      if (matches) {
        const [, amount, unit, name] = matches;
        if (amount && unit && name) {
          parsedIngredients.push({
            ...IngredientModel,
            amount: parseFloat(amount.replace(',', '.')), 
            unit, 
            name
          });
        }
      }
    }

    if (parsedIngredients.length) {
      const newIngredients = [...ingredients, ...parsedIngredients];
      updateIngredients(newIngredients);
    }
  }

  const pasteIngredients = event => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('Text');
    parseIngredientText(pastedText)
  };

  const ingredientsToGroceryListItems = ingredients => {
    let groceryListItems = [];
    for (let ingredient of ingredients) {
      groceryListItems.push({
        text: `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`,
        checked: false,
      });
    }
    return groceryListItems;
  }

  const openGroceryListModal = () => {
    changeView({ type: 'groceryLists', value: { 
      items: ingredientsToGroceryListItems(ingredients), 
      recipeId: recipe.id,
      recipeName: recipe.name,
      headerTitle: t('GroceryList:Title'),
    } });
  };
  
  const portionsAmount = parseInt(portions, 10) || parseInt(defaultPortions, 10);

  return (
    <>
      <div className={cc(['ingredientList', 'list', 'background', {
        'ingredientList--editMode': state.editable
      }])}>
        <div className="ingredientList__header">
          <h4>{t('Recipe:Ingredients')}</h4>
        </div>

        <RangeSlider 
          value={portionsAmount}
          min={1} 
          max={8} 
          label={t('Recipe:Portion', { count: portionsAmount })} 
          onChange={updatePortions}
          className="center"
        />

        {ingredients && ingredients.map((ingredient, index) => (
          <Ingredient
            key={'ingredient' + index}
            updateIngredient={updateIngredient} 
            index={index} 
            ingredient={ingredient}
            defaultPortions={defaultPortions}
            portions={portionsAmount}
            onPaste={pasteIngredients}
            onRemove={removeIngredient}
            groups={ingredientGroups}
          />
        ))}
        {state.editable ? (
          <button onClick={addIngredient}>
            {t('Recipe:AddIngredient')}
          </button>
        ) : (
          <button onClick={openGroceryListModal}>
            {t('Recipe:AddToGroceryList')}
          </button>
        )}
      </div>
    </>
  )
}

export default IngredientList;
