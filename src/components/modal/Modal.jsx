import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import posed, { PoseGroup } from 'react-pose';
import { FaTimes } from  'react-icons/fa';
import cc from 'classcat';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  }
});

export function ModalButtons({
  onSave,
  saveText,
  saveDisabled,
}) {
  const { t } = useTranslation();

  return (
    <div className="modalButtons">
      {onSave && (
        <button 
          className={cc({ 'disabled': saveDisabled })} 
          disabled={saveDisabled} 
          onClick={onSave}
        >
          {saveText || t('Modal:Save')}
        </button>
      )}
    </div>
  )
};

export const ModalSideOption = ({
  key,
  onClick,
  selected,
  children,
  flexOption,
}) => (
  <div 
    key={key} 
    className={cc(['modal__sideMenu__option', {
      'modal__sideMenu__option--selected': selected,
      'flex center vcenter': flexOption
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
    <div className={cc(['modal__content', 'background', 'box', className])}>
      {children}
    </div>
  );
};

const Modal = ({ children, ref, ModalSize = 'large', WithSideMenu = true, headerTitle }) => {
  const modalRef = useRef(null);
  const wrapperRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';

    wrapperRef.current.style.top = `${window.scrollY}px`;

    return () => document.getElementsByTagName('body')[0].style.overflow = 'auto';
  }, []);

  const outsideClick = event => {
    if (!modalRef.current.contains(event.target)) {
      history.goBack();
    }
  };

  const closeModal = () => {
    history.goBack();
  };
  

  const ModalView = (
    <PoseGroup enterPose="enter">
      <PosedModal 
        key="modal" 
        className="modalWrapper" 
        onClick={outsideClick}
        ref={wrapperRef}
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
          
          {children}
        </div>
      </PosedModal>
  </PoseGroup>
  );

  return createPortal(
    ModalView,
    document.getElementById('root')
  );
}

export default Modal;
