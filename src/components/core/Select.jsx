import React, { useState } from 'react';
import cc from 'classcat';
import './select.css';

import posed from 'react-pose';

const SelectContent = posed.div({
  open: {
    height: 'auto',
    opacity: 1,
  },
  closed : {
    height: 0,
    opacity: 0,
  },
})

const Select = ({
  onChange,
  preSelected,
  options,
  defaultText,
  className
}) => {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const changeSelected = option => () => {
    setSelected(option.text);

    if (onChange) {
      onChange(option);
    }
  };  

  return (
    <div className={cc(['select', className])}>
      <div className="select__input" onClick={() => setOpen(!open)}>
        {selected 
          || (preSelected && preSelected.text) 
          || defaultText}
      </div>

      <SelectContent className="select__content" pose={open ? 'open' : 'closed'}>
        {options.map(option => (
          <div className="select__option" onClick={changeSelected(option)}>
            {option.text}
          </div>
        ))}
      </SelectContent>
    </div>
  );
};

export default Select;

