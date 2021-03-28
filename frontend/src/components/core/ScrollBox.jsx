import './scrollBox.css';
import React from 'react';

const ScrollBox = ({ children, className }) => {
  const classes = ['scrollbox', className].join(' ');
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default ScrollBox;
