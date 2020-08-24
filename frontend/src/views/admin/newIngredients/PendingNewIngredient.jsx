import './pendingNewIngredient.css';

import React, { useContext, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaPen, FaTrash } from 'react-icons/fa';
import cc from 'classcat';
import Flags from 'country-flag-icons/react/3x2';

import { AllIngredientsContext } from 'contexts/allIngredients';
import { IngredientGroupsContext } from 'contexts/ingredientGroups';
import { UserContext } from 'contexts/user';
import EditableField from 'components/core/EditableField/EditableField';
import Select from 'components/core/Select';
import { Capitalize } from 'utils/utils';

export default function PendingNewIngredient({ newIngredient }) {
  const [editMode, setEditMode] = useState(false);
  const { dispatch, state: allIngredients } = useContext(AllIngredientsContext);
  const { state: ingredientGroups } = useContext(IngredientGroupsContext);
  const { state: user } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  const sortOptions = options => {
    return options.sort((a, b) => {
      if (a.selected && !b.selected) { return -1; }
      else if (!a.selected && b.selected) { return 1; }
      else if (a.name < b.name) { return -1; }
      else if (a.name > b.name) { return 1; }
      else { return 0 };
    });
  }

  const [alternativeOptions, selectedAlternatives] = useMemo(() => {
    const selected = [];
    const options = [];
    // const options = allIngredients.map(ingredient => {
    for (let ingredient of allIngredients) {
      if (ingredient.id === newIngredient.id) {
        continue;
      }

      const isSelected = newIngredient.alternatives.includes(ingredient.id);
      if (isSelected) {
        selected.push(ingredient.name);
      }

      options.push({
        ...ingredient,
        selected: isSelected,
      })
    }



    return [sortOptions(options), selected];
  }, [allIngredients, newIngredient.alternatives]);

  const [ingredientGroupOptions, selectedGroups] = useMemo(() => {
    const selected = [];
    const options = ingredientGroups.map(ingredientGroup => {
      const isSelected = newIngredient.groups.includes(ingredientGroup.id);
      if (isSelected) {
        selected.push(ingredientGroup.name);
      }

      return {
        ...ingredientGroup,
        selected: isSelected
      }
    });

    return [sortOptions(options), selected];
  }, [ingredientGroups, newIngredient.groups]);


  const updateNewIngredient = updatedAttributes => {
    dispatch({
      type: 'updateIngredient',
      value: {
        userId: user.id,
        id: newIngredient.id,
        updatedAttributes
      }
    })
  }

  const updateIngredientName = value => {
    updateNewIngredient({ name: value });
  };

  const updateIngredientGroup = value => {
    let updatedGroups = [...newIngredient.groups];
    if (value.selected) {
      updatedGroups.push(value.id);
    } else {
      updatedGroups = updatedGroups.filter(id => id !== value.id);
    }

    updateNewIngredient({ groups: updatedGroups });
  };

  const updateAlternatives = value => {
    let updatedAlternatives = [...newIngredient.alternatives];
    if (value.selected) {
      updatedAlternatives.push(value.id);
    } else {
      updatedAlternatives = updatedAlternatives.filter(id => id !== value.id);
    }

    updateNewIngredient({ alternatives: updatedAlternatives });
  };

  const updateIngredientStatus = () => {
    const status = newIngredient.status === 'pending'
      ? 'active'
      : 'pending';
    updateNewIngredient({ status });
  };

  const Flag = Flags[i18n.language];

  return (
    <>
      <span
        className="pendingNewIngredient__edit flex vcenter"
        key={`edit-${newIngredient.id}`}
        onClick={() => setEditMode(!editMode)}
      >
        <FaPen />
      </span>

      <span className="pendingNewIngredient__name" key={`name-${newIngredient.id}`}>
        <EditableField
          manualStateMode
          manualEditState={editMode}
          value={newIngredient.name}
          onChange={updateIngredientName}
        />

        <div className={cc(['flex', { 'column center': editMode } ])}>
          <div className="flex vcenter">
            <Flag className="flag--small margin--right noShrink" />
            <span className="noShrink">{t('NewIngredients:Singular')} &nbsp;</span>
          </div>
          <EditableField
            manualStateMode
            manualEditState={editMode}
            value={t(`Ingredient:${newIngredient.name}`)}
            // onChange={updateNewIngredient}
          />
        </div>

        <div className={cc(['flex', { 'column center': editMode } ])}>
          <div className="flex vcenter">
            <Flag className="flag--small margin--right noShrink" />
            <span className="noShrink">{t('NewIngredients:Plural')} &nbsp;</span>
          </div>
          <EditableField
            manualStateMode
            manualEditState={editMode}
            value={t(`Ingredient:${newIngredient.name}`)}
            // onChange={updateNewIngredient}
          />
        </div>
      </span>

      <span className="pendingNewIngredient__group" key={`group-${newIngredient.id}`}>
        <Select
          textAttribute="name"
          selectedText={selectedGroups.join(', ')}
          onChange={updateIngredientGroup}
          manualStateMode
          manualEditState={editMode}
          multiSelect
          options={ingredientGroupOptions}
        />
      </span>

      <span className="pendingNewIngredient__alternatives" key={`alternatives-${newIngredient.id}`}>
        <Select
          textAttribute="name"
          selectedText={selectedAlternatives.join(', ')}
          onChange={updateAlternatives}
          manualStateMode
          manualEditState={editMode}
          multiSelect
          options={alternativeOptions}
        />
      </span>

      <span className="pendingNewIngredient__tips" key={`tops-${newIngredient.id}`}>
        {newIngredient.tips}
      </span>

      <span
        key={`status-${newIngredient.id}`}
        className="pendingNewIngredient__status flex vcenter"
        onClick={updateIngredientStatus}
      >
        <FaCheckCircle className={cc(['pendingNewIngredient__statusIcon', {
          'pendingNewIngredient__statusIcon--checked': newIngredient.status === 'active'
        }])}/>
        {Capitalize(newIngredient.status)}
      </span>

      <span className="pendingNewIngredient__remove flex center vcenter">
        <FaTrash />
      </span>
    </>
  );
}