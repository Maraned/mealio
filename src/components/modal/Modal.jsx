import React, { useRef, useContext } from 'react';
import posed, { PoseGroup } from 'react-pose';
import { FaTimes } from  'react-icons/fa';
import cc from 'classcat';

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
});

export const ModalSideOption = ({
  key,
  onClick,
  selected,
  children
}) => (
  <div 
    key={key} 
    className={cc(['modal__sideMenu__option', {
      'modal__sideMenu__option--selected': selected
    }])}
    onClick={onClick}
  >
    {children}
  </div>
);

export const ModalSideMenu = ({
  children,
  className
}) => {
  return (
    <div className={cc(['modal__sideMenu', className])}>
      {children}
    </div>
  );
};

export const ModalContent = ({
  children,
  className
}) => {
  return (
    <div className={cc(['modal__content', 'background', className])}>
      {children}
    </div>
  );
};

const Modal = ({ children, ref }) => {
  const modalRef = useRef(null);
  const { state: router, dispatch } = useContext(RouterContext);
  const { 
    ModalView, 
    ModalData = {}, 
    ModalSize = 'large', 
    WithSideMenu = true 
  } = router;

  const { headerTitle } = ModalData;

  const outsideClick = event => {
    if (!modalRef.current.contains(event.target)) {
      dispatch({ type: 'closeModal' });
    }
  };

  const closeModal = () => {
    dispatch({ type: 'closeModal' });
  };

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
            'modal--auto': ModalSize === 'auto',
            'modal--withSideMenu': WithSideMenu
          }])} 
          ref={modalRef}
        >
          <div className="modal__header">
            <div className="modal__headerTitle">{headerTitle}</div>

            <div className="modal__closeIcon">
              <FaTimes onClick={closeModal} />
            </div>
          </div>

          <ModalView data={ModalData} closeModal={closeModal} />
        </div>
      </PosedModal>
    )}
  </PoseGroup>
  );
}

export default Modal;
