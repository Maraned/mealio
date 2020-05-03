import './pendingNewIngredient.css';

import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaPen, FaTrash } from 'react-icons/fa';
import cc from 'classcat';
import Flags from 'country-flag-icons/react/3x2';

import { AllIngredientsContext } from 'contexts/allIngredients';
import { IngredientGroupsContext } from 'contexts/ingredientGroups';
import EditableField from 'components/core/EditableField/EditableField';
import Select from 'components/core/Select';
import { Capitalize } from 'utils/utils'; 

export default function PendingNewIngredient({ newIngredient }) {
  const [editMode, setEditMode] = useState(false);
  const { dispatch, state: allIngredients } = useContext(AllIngredientsContext);
  const { state: ingredientGroups } = useContext(IngredientGroupsContext);
  const { t, i18n } = useTranslation();

  const updateNewIngredient = value => {
    console.log('updateNewIngredient', {
      value,
      id: newIngredient.id,
    })
  }

  const toggleChecked = () => {
    
  }

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
          onChange={updateNewIngredient}
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
            onChange={updateNewIngredient}
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
            onChange={updateNewIngredient}
          />
        </div>
      </span>



      <span className="pendingNewIngredient__group" key={`group-${newIngredient.id}`}>
        <Select
          textAttribute="name"
          onChange={updateNewIngredient}
          manualStateMode
          manualEditState={editMode}
          options={ingredientGroups}
        />
        {newIngredient.group && newIngredient.group.name}
      </span>

      <span className="pendingNewIngredient__alternatives" key={`alternatives-${newIngredient.id}`}>
        {newIngredient.alternatives}
        <Select
          textAttribute="name"
          onChange={updateNewIngredient}
          manualStateMode
          manualEditState={editMode}
          options={allIngredients}
        />
      </span>

      <span className="pendingNewIngredient__tips" key={`tops-${newIngredient.id}`}>
        {newIngredient.tips}
      </span>

      <span className="pendingNewIngredient__status flex vcenter" onClick={toggleChecked} key={`status-${newIngredient.id}`}>
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