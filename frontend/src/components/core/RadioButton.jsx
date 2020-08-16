import React, { useState } from 'react';
import cc from 'classcat';

const RadioButton = ({
  name,
  onClick,
  className,
  value,
}) => {
  return (
    <label className={cc(['radioButton', className])}>
      <input className="hidden" onClick={onClick} name={name} value={value} />
      <span className="radioButton__icon" />
    </label>
  );  
};

export default RadioButton;
