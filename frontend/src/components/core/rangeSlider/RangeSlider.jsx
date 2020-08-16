import React from 'react';
import cc from 'classcat';

import './rangeSlider.css';

const RangeSlider = ({ 
  className, 
  min, 
  max,
  label,
  step = 1,
  id,
  value,
  onChange,
}) => {
  return (
    <div className={cc(['rangeSlider', className ])}>
      {label && (
        <label id={id}>{value} {label}</label>
      )}
      <input
        className="rangeSlider__input" 
        htmlFor={id} 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        onChange={onChange}
        value={value}
      />
    </div>
  )
}

export default RangeSlider;
