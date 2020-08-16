import './menuOption.css';

import React from 'react';
import cc from 'classcat';

export default function MenuOption({
  onClick, 
  text, 
  Icon,
  selected,
  notificationCount
}) {
  return (
    <div 
      className={cc(['menuOption', {
        'clickable': onClick,
        'selected': selected,
      }])} 
      onClick={onClick}
    >
      <Icon className="menuOption__icon" />
      <span className="margin--right">{text}</span>

      {notificationCount && (
        <span className="notificationBubble">{notificationCount}</span>
      )} 
    </div>
  );
}

