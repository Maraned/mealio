import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { postRequest, getRequest } from 'utils/request';

import EditableField from 'components/core/EditableField';

import { UserContext } from 'contexts/user';
import { AllIngredientsContext } from 'contexts/allIngredients';

import './newIngredient.css';

const NewIngredient = ({ groups, closeModal }) => {
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientGroup, setIngredientGroup] = useState({ name: '' });
  const [ingredientAlternatives, setIngredientAlternatives] = useState([]);
  const { t } = useTranslation();
  const { state: user } = useContext(UserContext);
  const { 
    state: allIngredients, 
    dispatch: allIngredientsDispatch 
  } = useContext(AllIngredientsContext);

  const updateAllIngredients = async () => {
    const updatedIngredients = await getRequest('ingredients');
    console.log('updatedIngredients', updatedIngredients)

    allIngredientsDispatch({ type: 'update', value: updatedIngredients });
  }

  const addIngredient = async () => {
    let groupId = ingredientGroup.id;
    if (!groupId) {
      groupId = await postRequest('ingredients/groups', { 
        name: ingredientGroup.name,
        userId: user.id,
      }, true);
      ingredientGroup.id = groupId;
    }

    const ingredientId = await postRequest('ingredients', { 
      name: ingredientName, 
      group: ingredientGroup,
      alternatives: ingredientAlternatives.map(alternative => alternative.id),
      userId: user.id,
    }, true);

    if (ingredientId) {
      await updateAllIngredients();
      closeModal();
    }
  };

  const onGroupChange = event => {
    const alteredIngredientGroup = { ...ingredientGroup };
    alteredIngredientGroup.name = event.target.value;
    setIngredientGroup(alteredIngredientGroup);
  };

  const addAlternative = alternative => {
    const alteredAlternatives = [...ingredientAlternatives];
    alteredAlternatives.push(alternative);
    setIngredientAlternatives(alteredAlternatives);
  }

  const onAlternativeSelect = alternative => {
    addAlternative(alternative);
  };

  const removeAlternative = index => () => {
    const modifiedAlternatives = [...ingredientAlternatives];
    modifiedAlternatives.splice(index, 1);
    setIngredientAlternatives(modifiedAlternatives);
  };

  const renderIngredientAlternatives = () => (
    <div>
      <label>{t('Ingredient:Alternatives')}</label>
      <div className="ingredient__tags">
        {ingredientAlternatives.map((alternative, index) => (
          <span className="ingredient__tag" onClick={removeAlternative(index)}>
            {t(`IngredientNames:${alternative.name}`)}
          </span>
        ))}
      </div>
      <EditableField 
        placeholder={t('Ingredient:Alternative')} 
        searchOptions={allIngredients}
        onOptionClick={onAlternativeSelect}     
        optionText={option => t(`IngredientNames:${option.name}`)} 
        center    
      />
    </div>
  );

  const onGroupSelect = group => {
    setIngredientGroup(group);
  };

  return (
    <div className="newIngredient">
      <h2>{t('Ingredient:NewIngredient')}</h2>

      <EditableField
        placeholder={t('Ingredient:Name')} 
        onChange={event => setIngredientName(event.target.value)}  
        value={ingredientName}
        center
      />

      <EditableField 
        value={t(`Group:${ingredientGroup.name}`)}
        onChange={onGroupChange}
        placeholder={t('Ingredient:Group')} 
        searchOptions={groups}
        onOptionClick={onGroupSelect}    
        optionText={option => t(`Group:${option.name}`)}
        center
      />

      {renderIngredientAlternatives()}

      <button className="ingredient__saveNewIngredient success" onClick={addIngredient}>
        {t('Common:Save')}
      </button>
    </div>
  );
}

export default NewIngredient;