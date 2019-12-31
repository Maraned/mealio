import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import cc from 'classcat';
import posed from 'react-pose';
import { FaTimes } from 'react-icons/fa';
import DraftEditor from 'components/core/DraftEditor';

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
  textTag,
  onRemove,
  showRemove,
  autoWidth,
}) => {
  const [open, setOpen] = useState(false);
  const { state } = useContext(EditableContext);
  const [fallbackValue, setFallbackValue] = useState(
    !onChange ? value : ''
  );
  const [filteredOptions, setFilteredOptions] = useState([]);
  const node = useRef();
  const isFocused = useRef(null);

  const fallbackOnChange = value => {
    setFallbackValue(value);
  };

  const handleClick = useCallback(e => {
    if (node.current && !node.current.contains(e.target)) {
      setOpen(false);
      
      if (isFocused.current && onBlur) {
        const currentValue = onChange ? value : fallbackValue;
        onBlur(currentValue);
      }
    }
  }, [value, fallbackValue, onChange, node, isFocused]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick]);

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

  const renderRemoveButton = () => (onRemove && showRemove) ? (
    <div className="removeButton" onClick={onRemove}>
      <FaTimes />
    </div>
  ) : '';

  const handleOnChange = value => {
    if (onChange) {
      onChange(value);
    } else {
      fallbackOnChange(value);
    }
  };

  const handleOnPaste = event => {
    const value = event.clipboardData.getData('Text');
    if (onPaste) {
      onPaste(value);
    }
  }

  const renderEditMode = () => {
    return type === 'text' ? (
      <>
        <DraftEditor 
          className={cc(["editableField editableField__edit", className, {
            'editableField--center': center,
            [`editableField--${textTag}`]: textTag,
            'editableField--text': !textTag,
            'editableField--autoWidth': autoWidth,
          }])}
          onChange={value => handleOnChange(value)}
          value={fallbackValue || value}
          placeholder={placeholder}
          textTag={textTag}
          onPaste={onPaste}
        />

        {renderRemoveButton()}
      </>
    ) : (
      <div ref={node} className={cc(["editableField__container", {
        'editableField__container--center': center,
        'editableField--autoWidth': autoWidth,
        }])}>
        <div className="editableField__innerContainer">
          <input
            className={cc(['editableField editableField__edit', className, {
              'editableField--center': center,
            }])}
            onChange={event => handleOnChange(event.target.value)}
            value={fallbackValue || value}
            placeholder={placeholder}
            onPaste={handleOnPaste}
            onFocus={focus}
          />

          {renderRemoveButton()}
        </div>

        {searchOptions && (
          <OptionsContainer 
            className="editableField__options" 
            pose={open ? "open" : "closed"} 
            initialPose="closed"
          >
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
      'editableField--clickable': onClick,
      'editableField--autoWidth': autoWidth,
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
