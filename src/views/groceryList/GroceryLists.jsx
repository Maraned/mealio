import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { postRequest, getRequest } from 'utils/request';
import cc from 'classcat';

import { GroceryListContext } from 'contexts/groceryList';
import { UserContext } from 'contexts/user';
import GroceryList from './GroceryList';

import { FaCartPlus, FaTrash } from 'react-icons/fa';

import { ModalSideOption } from 'components/modal/Modal';

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

  useEffect(() => {
    if (groceryLists && groceryLists.length && !activeList) {
      setActiveList(groceryLists[0]);
    }
  }, [groceryLists]);

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

  const createdAtDate = createdAt => {
    var options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
    };
    const locale = i18n.language === 'sv' ? 'sv-SE' : 'en-GB';
    return new Date(createdAt).toLocaleDateString(locale, options);
  };

  const removeList = (index, listId) => {
    groceryListDispatch({ type: 'remove', index, listId, userId: user.id });
  };

  return (
    <div className="groceryLists">
      <div className="modal__sideMenu">
        <div className="groceryLists__create" onClick={createNewGroceryList}>
          <div className="groceryLists__create__inner">
            {recipeData && recipeData.recipeName || t('GroceryList:CreateNew')}
          </div>
        </div>

        {groceryLists && groceryLists.map((list, index) => (  
          <ModalSideOption
            key={list.id}
            onClick={() => setActiveList(list)}
            selected={activeList && (list.id === activeList.id)}
          >
            <div className="groceryLists__removeIcon" onClick={() => removeList(index, list.id)}>
              <FaTrash />
            </div>
            
            <div className="groceryLists__listName">{list.name}</div>
            
            <div className="groceryLists__createdAt">
              ({createdAtDate(list.createdAt)})
            </div>         
          </ModalSideOption>   
        ))}
      </div>

      {activeList && (
        <div className="modal__content">
          <GroceryList key={activeList} list={activeList} listIndex={activeListIndex} />          
        </div>
      )}
    </div>
  )
};

export default GroceryLists;