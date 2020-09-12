import './createNew.css';

import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import cc from 'classcat';

export default function CreateNew({ title, onClick, className }) {
  return (
    <div
      className={cc(['flex vcenter box margin--bottom', className])}
      onClick={onClick}
    >
      <FaPlusCircle
        className="margin--right"
        style={{ width: '1.4rem', height: '1.4rem' }}
      />
      {title}
    </div>
  );
}