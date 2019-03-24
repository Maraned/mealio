import React from 'react';
import cc from 'classcat';

import './fullWidthContainer.css';

const FullWidthContainer = ({
  stack,
  center,
  spaceBetween,
  children
}) => (
  <div className={cc(['fullWidthContainer', {
    'fullWidthContainer--stack': stack,
    'fullWidthContainer--centered': center,
    'fullWidthContainer--spaceBetween': spaceBetween
  }])}>
    {children}
  </div>
)
  
export default FullWidthContainer;
