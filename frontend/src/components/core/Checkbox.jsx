import React, { useState, useEffect } from 'react';
import cc from 'classcat';

import { FaCheck } from 'react-icons/fa';

import './checkbox.css';

const Checkbox = ({
  onClick,
  value,
  text,
  disabled,
  showIcon = true,
  backgroundColor = "#fff",
  checkedBackgroundColor = "#fff"
}) => {
  const [checked, setChecked] = useState(value);

  useEffect(() => {
    setChecked(value);
  }, [value]);

  const checkboxClick = () => {
    if (onClick) {
      onClick(!checked);
    }
    setChecked(!checked);
  }

  return (
    <div 
      className={cc(['checkbox__wrapper', {
        'checkbox__wrapper--disabled': disabled,
      }])} 
      onClick={checkboxClick}
    >
      <div 
        className={cc(['checkbox', {
          'checkbox--checked': checked,
        }])}
        style={{
          '--backgroundColor': backgroundColor, 
          '--checkedBackgroundColor': checkedBackgroundColor
        }}
      >
        {checked && showIcon && (
          <FaCheck className="checkbox__icon" />
        )}
      </div>

      {text && (
        <span className="checkbox__text">{text}</span>
      )}
    </div>
  )
}

export default Checkbox;
