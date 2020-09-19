import './select.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import cc from 'classcat';
import posed from 'react-pose';
import { FaPlus, FaCaretDown, FaCheckSquare, FaRegSquare } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import MiniSearch from 'minisearch';

import ReactDOM from 'react-dom';

import { EditableContext } from 'contexts/editable';

const SelectContentPose = posed.div({
  open: {
    height: 'auto',
    opacity: 1,
  },
  closed : {
    height: 0,
    opacity: 0,
  },
});

const SelectContent = ({
  children,
  className,
  open,
  anchorElement,
  contentRef,
}) => {
  useEffect(() => {
    if (open && contentRef.current && anchorElement) {
      const anchorRect = anchorElement.getBoundingClientRect();
      const yPos = window.scrollY + anchorRect.y;
      contentRef.current.style.top = `${yPos + anchorRect.height}px`;
      contentRef.current.style.left = `${anchorRect.x}px`;
      contentRef.current.style.width = `${anchorRect.width}px`;
    }
  }, [open, contentRef, anchorElement]);

  const content = (
    <SelectContentPose className={className} ref={contentRef} pose={open ? 'open' : 'closed'}>
      {children}
    </SelectContentPose>
  );

  return ReactDOM.createPortal(
    content,
    document.getElementById('root')
  );
}

const Select = ({
  onChange,
  preSelected,
  selectedText,
  options,
  defaultText,
  className,
  textAttribute = 'text',
  addable,
  onAddItem,
  OptionMarkup,
  closeOnSelect,
  searchable,
  searchPlaceholder,
  searchFields = ['name'],
  error,
  manualStateMode,
  manualEditState,
  multiSelect,
}) => {
  const { state: editableState } = useContext(EditableContext);
  const [open, setOpen] = useState(false);
  const node = useRef();
  const contentRef = useRef(null);
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(() =>options);
  const miniSearch = useRef(null);
  const inputRef = useRef(null);

  const previousOptions = useRef(null);
  const previousSearchable = useRef(null);
  const previousSearchFields = useRef(null);

  const changeSelected = option => () => {
    if (!multiSelect) {
      setOpen(false);
    }

    if (onChange) {
      option.selected = !option.selected;
      onChange(option);
    }
  };
  const handleClick = e => {
    if ((
        node.current
        && !node.current.contains(e.target)
        && contentRef.current
        && !contentRef.current.contains(e.target)
      ) || closeOnSelect
    ) {
      setOpen(false);
    }
  };

  const handleAddItemClick = e => {
    setOpen(false);

    if (onAddItem) {
      onAddItem(e);
    }
  }

  useEffect(() => {
    if (previousOptions.current?.length === options?.length
      && previousSearchable.current === searchable
      && previousSearchFields.current?.length === searchFields?.length) {
        return;
    }

    previousOptions.current = options;
    previousSearchable.current = searchable;
    previousSearchFields.current = searchFields;

    if (searchable) {
      miniSearch.current = new MiniSearch({
        fields: searchFields, // fields to index for full-text search
      });
      miniSearch.current.addAll(options)
    }

    setFilteredOptions(options);
  }, [options, searchable, searchFields]);

  useEffect(() => {
    if (searchable) {
      const searchOptions = {
        fuzzy: 0.2,
        prefix: true
      };
      const searchResult = miniSearch.current.search(query, searchOptions);

      const searchResultIds = searchResult.map(result => result.id);
      if (query) {
        const newFilteredOptions = options.filter(option => {
          return searchResultIds.includes(option.id);
        })
        setFilteredOptions(newFilteredOptions);
      } else {
        setFilteredOptions(options);
      }
    }
  }, [query, miniSearch, options, searchable]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
    // eslint-disable-next-line
  }, []);


  const editState = manualStateMode
    ? manualEditState
    : editableState && editableState.editable;

  const renderCheckbox = option => {
    const className = "absolute left margin--left vcenter";
    return option.selected
      ? <FaCheckSquare className={className} />
      : <FaRegSquare className={className} />;
  };

  const getSelectedText = () => {
    return selectedText
      || (preSelected && preSelected[textAttribute])
      || defaultText;
  };

  const renderEditableView = () => (
    <div
      className={cc(['select', className, {
        'select--error': error
      }])}
      ref={node}
    >
      <div ref={inputRef} className="select__input" onClick={() => setOpen(!open)}>
        <span className="select__inputText text--ellipsisOverflow">
          {getSelectedText()}
        </span>

        <FaCaretDown
          className={cc(['select__caret', {
            'select__caret--open': open
          }])}
        />
      </div>

      <SelectContent contentRef={contentRef} anchorElement={inputRef.current} open={open} className="select__content">
          {OptionMarkup ? (
            <OptionMarkup />
          ) : (
            <>
              <div className="select__options">
                {searchable && (
                  <input
                    className="select__search"
                    placeholder={searchPlaceholder || t('Select:Search')}
                    onChange={event => setQuery(event.target.value)}
                  />
                )}
                {filteredOptions && filteredOptions.map(option => (
                  <div
                    key={option.id}
                    className={cc(['select__option relative clickable text--ellipsisOverflow', {
                      'select__option--selected': option.selected
                    }])}
                    onClick={changeSelected(option)}
                  >
                    {multiSelect && renderCheckbox(option)}
                    {option[textAttribute]}
                  </div>
                ))}
              </div>

              {addable && (
                <div className="select__option select__addOption" onClick={handleAddItemClick}>
                  <FaPlus />
                </div>
              )}
            </>
          )}
      </SelectContent>
    </div>
  );

  const renderReadonlyView = () => (
    <div className="" ref={node}>
      {getSelectedText()}
    </div>
  );

  return editState
    ? renderEditableView()
    : renderReadonlyView();
};

export default Select;

