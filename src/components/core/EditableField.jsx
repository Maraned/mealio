import React, { useContext, useState, useEffect, useRef } from 'react';
import cc from 'classcat';
import posed from 'react-pose';

import { EditableContext } from 'contexts/editable';

import './editableField.css';

const OptionsContainer = posed.div({
  open: {
    height: 'auto',
    opacity: 1,
  },
  closed : {
    height: 0,
    opacity: 0,
  },
});

const EditableField = ({
  value,
  onChange,
  onClick,
  placeholder,
  className,
  onPaste,
  onFocus,
  onBlur,
  type,
  center,
  searchOptions,
  onOptionClick,
  optionText,
  titleField = false,
}) => {
  const [open, setOpen] = useState(false);
  const { state } = useContext(EditableContext);
  const [fallbackValue, setFallbackValue] = useState(value || '');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const node = useRef();
  const isFocused = useRef(null);

  const fallbackOnChange = event => {
    setFallbackValue(event.target.value);
  };

  const handleClick = e => {
    if (node.current && !node.current.contains(e.target)) {
      setOpen(false);
      
      if (isFocused.current && onBlur) {
        onBlur(e);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const focus = () => {
    setOpen(true);

    isFocused.current = true;

    if (onFocus) {
      onFocus();
    }
  }

  useEffect(() => {
    let fieldValue = value || fallbackValue;
    const alteredFilteredOptions = [];
    if (searchOptions) {
      for (let option of searchOptions) {
        const lowerCaseValue = fieldValue ? fieldValue.toLowerCase() : '';
        const lowerCaseOption = optionText(option).toLowerCase();

        if (lowerCaseOption.indexOf(lowerCaseValue) !== -1) {
          alteredFilteredOptions.push(option);
        }
      }
    }
    setFilteredOptions(alteredFilteredOptions);
  }, [value, fallbackValue])

  const optionClick = option => () => {
    setOpen(false);
    if (onOptionClick) {
      onOptionClick(option);
    }
  };

  const renderEditMode = () => {
    return type === 'text' ? (
      <div
        contentEditable
        className={cc(["editableField editableField__edit", className, {
          'editableField--center': center
        }])}
        onChange={onChange || fallbackOnChange}
        placeholder={placeholder}
        onPaste={onPaste}
        onFocus={focus}
        suppressContentEditableWarning={true}
        ref={node} 
      >
        {value || fallbackValue}
      </div>
    ) : (
      <div ref={node} className={cc(["editableField__container", {
        'editableField__container--center': center
      }])}>
        <input
          className={cc(["editableField editableField__edit", className, {
            'editableField--center': center
          }])}
          onChange={onChange || fallbackOnChange}
          value={value || fallbackValue}
          placeholder={placeholder}
          onPaste={onPaste}
          onFocus={focus}
        />

        {searchOptions && (
          <OptionsContainer className="editableField__options" pose={open ? "open" : "closed"} initialPose="closed">
            {filteredOptions.map(option => (
              <div className="editableField__option" onClick={optionClick(option)}>
                {optionText(option)}
              </div>
            ))}
          </OptionsContainer>
        )}
      </div>
    );
  };

  const renderViewMode = () => {
    const classes = cc(['editableField', className, { 
      'editableField--clickable': onClick 
    }]);

    return titleField ? (
      <h1 className={classes} onClick={onClick}>
        {value}
      </h1>
    ) : (
      <div className={classes} onClick={onClick}>
        {value}
      </div>
    );
  }

  return state.editable ? renderEditMode() : renderViewMode();
}

export default EditableField;
