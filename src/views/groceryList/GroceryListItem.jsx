import React, { useState, useContext } from 'react';

import { FaTrash } from 'react-icons/fa';
import posed from 'react-pose';
import cc from 'classcat';
import { GroceryListContext } from 'contexts/groceryList';
import EditableField from 'components/core/EditableField';

import Checkbox from 'components/core/Checkbox';

import './groceryListItem.css'

const ButtonsContainer = posed.div({
  visible: {
    opacity: 1,
    transition: {
      duration: 0
    }
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0
    }
  }
})


const GroceryListItem = ({ 
  item, 
  removeItem, 
  index, 
  changeItem,
  listIndex, 
}) => {
  const { dispatch } = useContext(GroceryListContext);
  const [itemValue, setItemValue] = useState(item.text);

  const changeValue = event => {
    setItemValue(event.target.value);
  };

  const onChecked = checked => {
    item.checked = checked;
    dispatch({ type: 'updateListItem', listIndex, index, value: item })
  };

  const onBlur = (event) => {
    console.log('blurring', event)
  }

  return (
    <div 
      className={cc(['groceryListItem', {
        'groceryListItem--checked': item.checked,
      }])}
    >
      <Checkbox value={item.checked} onClick={onChecked} />
      
      <EditableField
        value={itemValue} 
        onChange={changeValue}
        onBlur={onBlur} // changeItem 
        onClick={() => onChecked(!item.checked)} 
      />
    </div>
  )
};

export default GroceryListItem;
