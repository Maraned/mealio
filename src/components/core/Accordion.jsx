import React, { useState } from 'react';
import cc from 'classcat';
import posed from 'react-pose';
import { FaCaretDown, FaTrash } from 'react-icons/fa';

import './accordion.css';

const Content = posed.div({
  enter: {
    y: 0,
    height: 'auto',
    // flip: true,
  },
  exit: {
    y: "-100%",
    height: '1px',
    // flip: true,
  }
})

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
      <div 
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={cc(['accordion__header', {
          'accordion__header__open': open
        }])}
       onClick={toggleOpen}
      >
      
        {LeftIcon && (
          <LeftIcon />
        )}

        {editable ? (
          <input className="accordion__header__input" value={accordionTitle} onChange={changeTitle} onBlur={onBlur} />
        ) : title}

        {!hideIcon && (
          <FaCaretDown className="accordion__header__caret" />
        )}

        {removeable && hovering && (
          <button className="removeButton" onClick={onRemove}>
            <FaTrash />
          </button>
        )}
      </div>

      <Content className="accordion__content" initialPose="exit" pose={open ? "enter" : "exit"}>
        {children}
      </Content>
    </div>
  );
};

export default Accordion;
