import React, { useState, useContext } from 'react';

import { FaTrash } from 'react-icons/fa';
import posed from 'react-pose';
import cc from 'classcat';
import { GroceryListContext } from 'contexts/groceryList';

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
  const [showButtons, setShowButtons] = useState(false);
  const [itemValue, setItemValue] = useState(item.text);

  const changeValue = event => {
    setItemValue(event.target.value);
  };

  const onChecked = checked => {
    item.checked = checked;
    dispatch({ type: 'updateListItem', listIndex, index, value: item })
  };

  return (
    <div 
      className={cc(['groceryListItem', {
        'groceryListItem--checked': item.checked,
      }])}
      onMouseOver={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      <ButtonsContainer 
        className="groceryListItem__buttons" 
        pose={showButtons ? 'visible' : 'hidden'}
      >
        <button className="removeButton" onClick={removeItem}>
          <FaTrash />
        </button>
      </ButtonsContainer>

      <Checkbox value={item.checked} onClick={onChecked} />

      <div className="groceryListItem__content">
        <input 
          value={itemValue} 
          onChange={changeValue}
          onBlur={changeItem}  
        />
      </div>
    </div>
  )
};

export default GroceryListItem;
