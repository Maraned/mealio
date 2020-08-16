import './popup.css';

import React, { useRef } from 'react';
import cc from 'classcat';
import useOutsideClick from 'utils/useOutsideClick';

import posed from 'react-pose';

const PopupPose = posed.div({
  show: {
    opacity: 1
  },
  hide: {
    opacity: 0,
  }
})

export default function Popup({
  children,
  className,
  onClose,
  id,
  show,
}) {
  const popupRef = useRef(null);

  useOutsideClick(popupRef, onClose);
  return (
    <PopupPose key={id} pose={show ? 'show' : 'hide'} className={cc(['popup', className])} ref={popupRef}>
      {children}
    </PopupPose>
  );
}