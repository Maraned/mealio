import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import cc from 'classcat';
import posed from 'react-pose';
import { FaTimes } from 'react-icons/fa';
import DraftEditor from 'components/core/EditableField/DraftEditor';

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
  toolbarButtons,
  hideIfEmpty = false,
  manualStateMode = false,
  manualEditState = false,
  textAlignment,
  small,
  xSmall,
}) => {
  const [editedValue, setEditedValue] = useState(false);
  const [open, setOpen] = useState(false);
  const { state } = useContext(EditableContext);
  const [fallbackValue, setFallbackValue] = useState(!onChange ? value : '');
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
  }, [value, fallbackValue, onChange, node, isFocused, onBlur]);

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
    // eslint-disable-next-line
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
    setEditedValue(value);

    if (onChange) {
      onChange(value);
    }
  };

  const handleOnBlur = () => {
    if (onChange) {
      onChange(editedValue || value);
    } else {
      fallbackOnChange(editedValue || value);
    }
  }

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
          className={cc(["editableField editableField__edit editableField--textField", className, {
            'editableField--center': center,
            [`editableField--${textTag}`]: textTag,
            'editableField--text': !textTag,
            'editableField--autoWidth': autoWidth,
            'editableField--small': small,
            'editableField--xSmall': xSmall,
          }])}
          onChange={value => handleOnChange(value)}
          onBlur={handleOnBlur}
          value={`${editedValue || fallbackValue || value}`}
          placeholder={placeholder}
          textTag={textTag}
          onPaste={onPaste}
          onFocus={onFocus}
          toolbarButtons={toolbarButtons}
          onRemove={onRemove}
          textAlignment={textAlignment}
        />
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
            value={editedValue || fallbackValue || value}
            placeholder={placeholder}
            onPaste={handleOnPaste}
            onFocus={focus}
            onBlur={handleOnBlur}
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

    const Tag = textTag || titleField ? 'h1' : 'div';

    return (
      <Tag className={classes} onClick={onClick}>
        {value}
      </Tag>
    );
  }

  const editState = manualStateMode ? manualEditState : state.editable;

  return editState
    ? renderEditMode()
    : hideIfEmpty
      ? !!value && renderViewMode()
      : renderViewMode();
}

export default EditableField;
