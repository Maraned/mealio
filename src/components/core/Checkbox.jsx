import React, { useState } from 'react';
import cc from 'classcat';

import { FaCheck } from 'react-icons/fa';

import './checkbox.css';

const Checkbox = ({
  onClick,
  value,

}) => {
  const [checked, setChecked] = useState(value);

  const checkboxClick = () => {
    if (onClick) {
      onClick(!checked);
    }
    setChecked(!checked);
  }

  return (
    <div
      onClick={checkboxClick} 
      className={cc(['checkbox', {
        'checkbox--checked': checked,
      }])}
    >
      {checked && (
        <FaCheck />
      )}
    </div>
  )
}

export default Checkbox;
