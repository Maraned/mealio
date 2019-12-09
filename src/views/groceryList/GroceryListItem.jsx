import './groceryListItem.css';

import React, { useState } from 'react';

import cc from 'classcat';
import EditableField from 'components/core/EditableField';

import Checkbox from 'components/core/Checkbox';

const GroceryListItem = ({ 
  item, 
  removeItem, 
  changeItem,
  onCheckedChange,
}) => {
  const [itemValue, setItemValue] = useState(item.text);

  const changeValue = event => {
    setItemValue(event.target.value);
  };

  const onChecked = checked => {
    item.checked = checked;
    onCheckedChange(checked);
  };

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
        onBlur={changeItem}  
        onClick={() => onChecked(!item.checked)} 
        onRemove={removeItem}
        showRemove
      />

    </div>
  )
};

export default GroceryListItem;
