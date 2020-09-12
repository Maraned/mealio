import React from 'react';
import cc from 'classcat';

export default function Icon({ marginRight, isError, children }) {
  return (
    <div className={cc(['icon flex center vcenter', {
      'icon--error': isError,
      'icon--marginRight': marginRight
    }])}>
      {children}
    </div>
  );
};
