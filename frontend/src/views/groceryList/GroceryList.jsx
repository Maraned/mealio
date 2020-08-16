import './groceryList.css';

import React, { useContext } from 'react';
import { FaPen, FaPlusCircle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next';

import GroceryListItem from './GroceryListItem';
import EditableField from 'components/core/EditableField/EditableField';

import { GroceryListContext } from 'contexts/groceryList';
import { EditableContext } from 'contexts/editable';

const GroceryList = ({ list }) => {
  const { dispatch } = useContext(GroceryListContext);
  const { state: { editable }, dispatch: setEditMode } = useContext(EditableContext);
  const { dispatch: updateList } = useContext(GroceryListContext);
  const { t, i18n } = useTranslation();
 
  const checkedList = [];

  const removeItem = index => () => {
    list.items.splice(index, 1);
    dispatch({ type: 'updateList', id: list.id, value: list });
  };

  const addGroceryListItem = () => {
    list.items.push({ text: '', checked: false });
    updateList({ 
      type: 'updateList', 
      id: list.id, 
      value: list, 
      silent: true 
    });
  };

  const changeName = name => {
    if (name && name !== list.name) {
      list.name = name;
      dispatch({ type: 'updateList', id: list.id, value: list });
    }
  };

  const changeItem = index => text => {
    if (text && text !== list.items[index].text) {
      list.items[index].text = text;
      dispatch({ type: 'updateList', id: list.id, value: list });
    }
  };

  const onCheckedChange = index => checked => {
    list.items[index].checked = checked;
    dispatch({ type: 'updateList', id: list.id, value: list });
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
          <EditableField
            viewValue={<h3>{list.name}</h3>}
            value={list.name}
            onBlur={changeName}
          />
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
          return null;
        } else {
          return (
            <GroceryListItem 
              key={item.text + '' + index} 
              item={item} 
              removeItem={removeItem(index)} 
              index={index} 
              changeItem={changeItem(index)}
              onCheckedChange={onCheckedChange(index)}
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
          onCheckedChange={onCheckedChange(checkedItem.index)}
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
