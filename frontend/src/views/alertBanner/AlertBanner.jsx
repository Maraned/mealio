import React, { useEffect } from 'react';
import cc from 'classcat';

import './alertBanner.css';

const AlertBanner = ({
  text,
  type,
  delay = 3000,
  onRemove,
}) => {
  useEffect(() => {
    setTimeout(() => onRemove(), delay);
  }, [onRemove, delay]);

  return (
    <div className={cc(['alertBanner', {
      'alertBanner--success': type === 'success',
      'alertBanner--error': type === 'error',
    }])}>
      {text}
    </div>
  )
};

export default AlertBanner;
