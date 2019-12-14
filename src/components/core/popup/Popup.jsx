import './popup.css';

import React, { useRef } from 'react';
import cc from 'classcat';
import useOutsideClick from 'utils/useOutsideClick';

export default function Popup({
  children,
  className,
  onClose,
}) {
  const popupRef = useRef(null);

  useOutsideClick(popupRef, onClose);
  return (
    <div className={cc(['popup', className])} ref={popupRef}>
      {children}
    </div>
  );
}