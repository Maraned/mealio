import './ingredientList.css';

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';
import { RouterContext } from 'contexts/router';
import { UserContext } from 'contexts/user';
import IngredientModel from 'models/ingredientModel';

import Ingredient from 'components/ingredientList/Ingredient';

import { Capitalize } from 'utils/utils';

const IngredientList = ({ groupIngredients, marginBottom }) => {
  const { state } = useContext(EditableContext);
  const { state: user } = useContext(UserContext);
  const { state: recipe, dispatch: updateRecipe } = useContext(RecipeContext);
  const { dispatch: changeView } = useContext(RouterContext);
  const { t } = useTranslation();
  const { ingredients: recipeIngredients, portions, defaultPortions = 4 } = recipe;
  const location = useLocation();

  const ingredients = groupIngredients || recipeIngredients;

  const author = {
    id: user.id,
    name: user.displayName
  };

  const updateIngredient = (index, ingredient) => {
    const modifiedIngredients = JSON.parse(JSON.stringify(ingredients));
    modifiedIngredients[index] = ingredient;
    updateRecipe({ type: 'update', value: { ingredients: modifiedIngredients, author }});
  }

  const addIngredient = () => {
    const modifiedIngredients = JSON.parse(JSON.stringify(ingredients));
    modifiedIngredients.push({...IngredientModel});
    updateRecipe({ type: 'update', value: { ingredients: modifiedIngredients, author }});
  }

  const updateIngredients = ingredients => {
    updateRecipe({ type: 'update', value: { ingredients, author }});
  }

  const removeIngredient = (index, ingredient) => {
    const modifiedIngredients = [...ingredients];
    modifiedIngredients.splice(index, 1);
    updateRecipe({ type: 'update', value: { ingredients: modifiedIngredients, author }});
  }

  const parseIngredientText = ingredientText => {
    const fullIngredientRegex = /([\d,.]+)\s(.+?)\s(.+)/;
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
            name: Capitalize(name)
          });
        }
      }
    }

    return parsedIngredients;
  }

  const pasteIngredients = pastedText => {
    const parsedIngredients = parseIngredientText(pastedText);
    if (parsedIngredients.length) {
      const ingredientRowToRemove = ingredients.length - 1;
      const modifiedIngredients = [...ingredients];
      modifiedIngredients.splice(ingredientRowToRemove, 1);
      const newIngredients = [...modifiedIngredients, ...parsedIngredients];
      updateIngredients(newIngredients);
    }
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

  const portionsAmount = portions 
    ? parseInt(portions, 10) 
    : parseInt(defaultPortions, 10);

  return (
    <div className={marginBottom && 'margin--bottom--xlarge'}>
      {ingredients && ingredients.map((ingredient, index) => (
        <Ingredient
          key={'ingredient' + index}
          updateIngredient={updateIngredient} 
          index={index} 
          ingredient={{...ingredient}}
          defaultPortions={defaultPortions}
          portions={portionsAmount}
          onPaste={pasteIngredients}
          onRemove={removeIngredient}
        />
      ))}
      {state.editable ? (
        <button onClick={addIngredient}>
          {t('Recipe:AddIngredient')}
        </button>
      ) : (
        <Link to={{ 
          pathname: '/grocerylists', 
          state: { 
            modal: true, 
            previousLocation: location, 
            data: {
              items: ingredientsToGroceryListItems(ingredients), 
              recipeId: recipe.id,
              recipeName: recipe.name,
              headerTitle: t('GroceryList:Title'),
            }
          }
        }}>
          <button onClick={openGroceryListModal}>
            {t('Recipe:AddToGroceryList')}
          </button>
        </Link>
      )}
    </div>
  )
}

export default IngredientList;
