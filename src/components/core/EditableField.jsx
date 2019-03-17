import React, { useContext } from 'react';
import cc from 'classcat';

import { EditableContext } from 'contexts/editable';

import './editableField.css';

const EditableField = ({ 
  value, 
  onChange, 
  placeholder,
  className,
  onPaste,
}) => {
  const { state } = useContext(EditableContext);

  return state.editable ? (
    <input 
      className={cc(["editableField editableField__edit", className])}
      onChange={onChange}
      value={value}  
      placeholder={placeholder}
      onPaste={onPaste}
    />
  ) : (
    <div className="editableField">
      {value}
    </div>
  )
}

export default EditableField;
