import './groceryList.css';

import React, { useContext } from 'react';
import { FaPen, FaPlusCircle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next';

import GroceryListItem from './GroceryListItem';
import { GroceryListContext } from 'contexts/groceryList';
import { EditableContext } from 'contexts/editable';

const GroceryList = ({ list, listIndex }) => {
  const { dispatch } = useContext(GroceryListContext);
  const { state: { editable }, dispatch: setEditMode } = useContext(EditableContext);
  const { dispatch: updateList } = useContext(GroceryListContext);
  const { t, i18n } = useTranslation();
 
  const checkedList = [];

  const removeItem = index => () => {
    list.items.splice(index, 1);
    dispatch({ type: 'updateListIndex', index: listIndex, value: list });
  };

  const addGroceryListItem = () => {
    list.items.push({ text: '', checked: false });
    updateList({ 
      type: 'updateListIndex', 
      index: listIndex, 
      value: list, 
      silent: true 
    });
  };

  const changeItem = index => event => {
    const text = event.target.value;
    if (text && text !== list.items[index].text) {
      list.items[index].text = event.target.value;
      dispatch({ type: 'updateListIndex', index: listIndex, value: list });
    }
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

  return (
    <div className="groceryList">
      <div className="groceryList__header">
        <div className="flex vcenter">
          <h3>{list.name}</h3>
          <FaPen 
            className="groceryLists__editListIcon" 
            onClick={() => setEditMode({ type: editable ? 'view' : 'edit' })} 
          />
        </div>
        <div className="groceryLists__createdAt">
          {t('GroceryList:CreatedAt')}: {createdAtDate(list.createdAt)}
        </div>
      </div>
          
      {list.items.map((item, index) => {
        if (item.checked) {
          checkedList.push({ item, index });
        } else {
          return (
            <GroceryListItem 
              key={item.text + '' + index} 
              item={item} 
              removeItem={removeItem(index)} 
              index={index} 
              changeItem={changeItem(index)}
              listIndex={listIndex}
            />
          );
        }
      })}

      {checkedList.map(checkedItem => (
        <GroceryListItem 
          key={checkedItem.text + '' + checkedItem.index} 
          item={checkedItem.item} 
          removeItem={removeItem(checkedItem.index)} 
          index={checkedItem.index} 
          changeItem={changeItem(checkedItem.index)}
          listIndex={listIndex}
        />
      ))}

      {editable && (
        <div 
          className="groceryList__addItem flex center vcenter"
          onClick={addGroceryListItem}
        >
          <FaPlusCircle />
          {t('GroceryList:AddGroceryItem')}
        </div>
      )}
    </div>
  )
};

export default GroceryList;
