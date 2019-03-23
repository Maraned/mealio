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
  onFocus, 
  onBlur,
  type,
  center,
}) => {
  const { state } = useContext(EditableContext);

  const renderEditMode = () => {
    return type === 'text' ? (
      <div
        contentEditable 
        className={cc(["editableField editableField__edit", className, {
          'editableField--center': center
        }])}
        onChange={onChange}
        placeholder={placeholder}
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
        suppressContentEditableWarning={true}
      >
        {value}
      </div>
    ) : (
      <input 
        className={cc(["editableField editableField__edit", className, {
          'editableField--center': center
        }])}
        onChange={onChange}
        value={value}  
        placeholder={placeholder}
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}  
      />    
    );
  }

  const renderViewMode = () => (
    <div className={cc(['editableField', className])}>
      {value}
    </div>  
  );

  return state.editable ? renderEditMode() : renderViewMode();
}

export default EditableField;
