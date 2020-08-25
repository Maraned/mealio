import React, { useContext } from 'react';
import cc from 'classcat';
import { useTranslation } from 'react-i18next';

import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';

import IngredientList from 'components/ingredientList/IngredientList';
import RangeSlider from 'components/core/rangeSlider/RangeSlider';
import EditableField from 'components/core/EditableField/EditableField';

import { DragDropContext } from 'react-beautiful-dnd';

import uuid from 'utils/uuid';

export default function IngredientListWrapper() {
  const { state } = useContext(EditableContext);
  const { state: recipe, dispatch: updateRecipe } = useContext(RecipeContext);
  const { ingredientGroups = [], portions, portionsType, defaultPortions } = recipe;
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

  const addIngredientGroup = () => {
    const updatedIngredientGroups = [...ingredientGroups];
    updatedIngredientGroups.push({
      id: uuid(),
      ingredients: [],
      name: '',
    });

    updateRecipe({
      type: 'update',
      value: { ingredientGroups: updatedIngredientGroups }
    });
  };

  const updateIngredientGroup = (ingredientGroupId, updatedAttributes) => {
    updateRecipe({
      type: 'ingredientGroup',
      value: { ingredientGroupId, updatedAttributes }
    });
  };

  const onDragEnd = result => {
    if (!result?.source || !result?.destination) {
      return;
    }
    const ingredientId = result.draggableId;
    const fromIngredientGroup = result.source.droppableId;
    const fromIndex = result.source.index;
    const toIngredientGroup = result.destination.droppableId;
    const toIndex = result.destination.index;

    updateRecipe({
      type: 'movedIngredient',
      value: {
        ingredientId,
        fromIngredientGroup,
        fromIndex,
        toIngredientGroup,
        toIndex,
      }
    });
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

      {state.editable && (
        <button onClick={addIngredientGroup}>
          {t('Recipe:AddIngredientGroup')}
        </button>
      )}

      <DragDropContext
        onDragEnd={onDragEnd}
      >
        {ingredientGroups
          ? ingredientGroups.map(({ id, name, ingredients }, index) => (
            <React.Fragment key={`ingredientGroup-${index}`}>
              <EditableField
                value={name}
                textTag="h3"
                type="text"
                textAlignment="center"
                onChange={value => updateIngredientGroup(id, { name: value })}
              />
              <IngredientList
                ingredientGroupId={id}
                groupIngredients={ingredients}
                marginBottom={index !== (ingredientGroups.length - 1)}
              />
            </React.Fragment>
          )
        ) : (
          <IngredientList />
        )}
      </DragDropContext>
    </div>
  );
}