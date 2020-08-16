import React from 'react';
import cc from 'classcat';

import './fullWidthContainer.css';

const FullWidthContainer = ({
  stack,
  center,
  spaceBetween,
  className,
  wrapOnlyMobile,
  children
}) => (
  <div className={cc(['fullWidthContainer', className, {
    'fullWidthContainer--stack': stack,
    'fullWidthContainer--centered': center,
    'fullWidthContainer--spaceBetween': spaceBetween,
    'fullWidthContainer--wrapOnlyMobile': wrapOnlyMobile,
  }])}>
    {children}
  </div>
)

export default FullWidthContainer;
