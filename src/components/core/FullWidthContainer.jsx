import React from 'react';
import cc from 'classcat';

import './fullWidthContainer.css';

const FullWidthContainer = ({
  stack,
  center,
  children
}) => (
  <div className={cc(['fullWidthContainer', {
    'fullWidthContainer--stack': stack,
    'fullWidthContainer--centered': center,
  }])}>
    {children}
  </div>
)
  
export default FullWidthContainer;
