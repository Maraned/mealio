import React, { useRef, useContext, useState } from 'react';
import posed, { PoseGroup } from 'react-pose';
import cc from 'classcat';
import { useTranslation } from 'react-i18next';

import { RouterContext } from 'contexts/router';

import './modal.css';

const PosedModal = posed.div({
  enter: {
    opacity: 1,
    transition: {

    }
  },
  exit: {
    opacity: 0,
    transition: {
    }
  },
})

const Modal = ({ children, ref }) => {
  const modalRef = useRef(null);
  const { state: router, dispatch } = useContext(RouterContext);
  const { ModalView, ModalData = {}, ModalSize = 'large' } = router;
  const { t } = useTranslation();

  const outsideClick = event => {
    if (!modalRef.current.contains(event.target)) {
      dispatch({ type: 'closeModal' });
    }
  }

  return (
    <PoseGroup enterPose="enter">
    {!!ModalView && (
      <PosedModal 
        key="modal" 
        className="modalWrapper" 
        onClick={outsideClick}
      >
        <div 
          className={cc(['modal', {
            'modal--large': ModalSize === 'large',
            'modal--auto': ModalSize === 'auto'
          }])} 
          ref={modalRef}
        >
          <ModalView data={ModalData} />
        </div>
      </PosedModal>
    )}
  </PoseGroup>
  );
}

export default Modal;
