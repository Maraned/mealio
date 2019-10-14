import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { postRequest, getRequest } from 'utils/request';

import { GroceryListContext } from 'contexts/groceryList';
import { UserContext } from 'contexts/user';
import GroceryList from './GroceryList';
import Accordion from 'components/core/Accordion';

import { FaPlusCircle, FaCartPlus } from 'react-icons/fa';

import './groceryLists.css';

class RecipeData {
  constructor(props) {
    if (!props) {
      this.items = [];
      this.recipeId = '';
      this.recipeName = '';
    } else {
      this.items = props.items;
      this.recipeId = props.recipeId;
      this.recipeName = props.recipeName;
    }
  }
}

const GroceryLists = ({ data }) => {
  const { 
    state: groceryLists, 
    dispatch: groceryListDispatch 
  } = useContext(GroceryListContext);
  const { state: user } = useContext(UserContext);
  const [recipeData, setRecipeData] = useState(data);
  const [activeList, setActiveList] = useState(null);
  const [activeListIndex, setActiveListIndex] = useState(0);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (setRecipeData) {
      setRecipeData(data);
    }
  }, [data]);

  const fetchGroceryLists = async () => {
    const fetchedGroceryLists = await getRequest(`users/${user.id}/groceryLists`);
    groceryListDispatch({ type: 'update', value: fetchedGroceryLists });
  }

  useEffect(() => {
    fetchGroceryLists();
  }, []);

  const createNewGroceryList = async () => {
    const newGroceryList = await postRequest('groceryList/create', {
      items: (recipeData && recipeData.items) || [],
      recipeId: (recipeData && recipeData.recipeId) || '',
      name: recipeData && recipeData.recipeName || t('GroceryList:NewGroceryList'),
      userId: user.id,
    });

    groceryListDispatch({ type: 'add', value: [newGroceryList] });
    setRecipeData(new RecipeData());
  };

  const updateGroceryListName = event => {
    groceryLists[activeListIndex].name = event.target.value;
    groceryListDispatch({ 
      type: 'updateListIndex', 
      index: activeListIndex, 
      value: groceryLists[activeListIndex] 
    });
  };

  const addGroceryListItem = () => {
    groceryLists[activeListIndex].items.push({ text: '', checked: false });
    groceryListDispatch({ 
      type: 'updateListIndex', 
      index: activeListIndex, 
      value: groceryLists[activeListIndex], 
      silent: true 
    });
  };

  const addDataItemsToGroceryList = index => event => {
    event.preventDefault();
    event.stopPropagation();
    groceryLists[index].items = [...groceryLists[index].items, ...recipeData.items];
    groceryListDispatch({ type: 'updateListIndex', index, value: groceryLists[index] });
    setRecipeData(new RecipeData());
  };

  const addToCartIcon = index => () => {
    if (!recipeData || !recipeData.items.length) {
      return '';
    }

    return (
      <FaCartPlus onClick={addDataItemsToGroceryList(index)} />
    );
  };

  const createdAtDate = createdAt => {
    var options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
    };
    const locale = i18n.language === 'sv' ? 'sv-SE' : 'en-GB';
    return new Date(createdAt).toLocaleDateString(locale, options);
  };

  const removeList = (index, listId) => () => {
    groceryListDispatch({ type: 'remove', index, listId, userId: user.id });
  };

  return (
    <div className="groceryLists">
      <div className="modal__sideMenu">
        {groceryLists.map((list, index) => (  
          <div className="groceryLists__list">
            {list.name}
          </div>
        ))}
      </div>
      <div className="groceryLists__create" onClick={createNewGroceryList}>
        {t('GroceryList:CreateNew')}
      </div>

      {activeList && (
        <>
          <div className="groceryLists__createdAt">
            {t('GroceryList:CreatedAt')}: {createdAtDate(activeList.createdAt)}
          </div>
          <GroceryList key={activeList} list={activeList} listIndex={activeListIndex} />
          <div 
            className="groceryLists__addItem"
            onClick={addGroceryListItem}
          >
            <FaPlusCircle />
            {t('GroceryList:AddGroceryItem')}
          </div>
        </>
      )}
    </div>
  )
};

export default GroceryLists;