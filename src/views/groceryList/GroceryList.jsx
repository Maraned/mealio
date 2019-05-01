import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import GroceryListItem from './GroceryListItem';
import { GroceryListContext } from 'contexts/groceryList';
import Accordion from 'components/core/Accordion';

import './groceryList.css';

const GroceryList = ({ list, listIndex }) => {
  const { dispatch } = useContext(GroceryListContext);
  const { t } = useTranslation();
 
  const checkedList = [];

  const removeItem = index => () => {
    list.items.splice(index, 1);
    dispatch({ type: 'updateListIndex', index: listIndex, value: list });
  };

  const changeItem = index => event => {
    list.items[index].text = event.target.value;
    dispatch({ type: 'updateListIndex', index: listIndex, value: list });
  };

  return (
    <div className="groceryList">
      {list.items.map((item, index) => {
        if (item.checked) {
          checkedList.push({ item, index });
          return '';
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

      {!!checkedList.length && (
        <Accordion 
          className="groceryList__checkedItems"
          title={t('GroceryList:CheckedItems')}
        >
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
        </Accordion>
      )}
    </div>
  )
};

export default GroceryList;
