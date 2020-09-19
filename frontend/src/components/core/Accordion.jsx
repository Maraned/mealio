import React, { useState } from 'react';
import cc from 'classcat';
import posed from 'react-pose';
import { FaCaretDown, FaTrash } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

import './accordion.css';

const Accordion = ({
  children,
  className,
  title,
  editable,
  onBlur,
  hideIcon,
  LeftIcon,
  removeable,
  onRemove,
  headerContent,
}) => {
  const [open, setOpen] = useState(false);
  const [accordionTitle, setAccordionTitle] = useState(title);
  const [hovering, setHovering] = useState(false);

  const toggleOpen = event => {
    if (event.target.nodeName !== 'INPUT')
    setOpen(!open);
  };

  const changeTitle = event => {
    setAccordionTitle(event.target.value);
  };

  return (
    <div className={cc(['accordion', className])} >
      <div className="accordion__headerContainer"
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {removeable && hovering && (
          <button className="removeButton" onClick={onRemove}>
            <FaTrash />
          </button>
        )}
        <div
          className={cc(['accordion__header', {
            'accordion__header--open': open,
            'accordion__header--removeButtonVisible': hovering && removeable
          }])}
          onClick={toggleOpen}
        >

          {LeftIcon && (
            <button className="accordion__header__leftIcon">
              <LeftIcon />
            </button>
          )}

          {editable ? (
            <input className="accordion__header__input" value={accordionTitle} onChange={changeTitle} onBlur={onBlur} />
          ) : title}

          {!hideIcon && (
            <FaCaretDown className="accordion__header__caret" />
          )}
        </div>

        {headerContent && (
          <div className="margin--left">
            {headerContent}
          </div>
        )}
      </div>

      <div className="accordion__content">
        <AnimatePresence>
          {open && (
            <motion.div
            layoutTransition
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100%' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Accordion;
