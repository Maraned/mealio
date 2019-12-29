import './select.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import cc from 'classcat';
import posed from 'react-pose';
import { FaPlus, FaCaretDown } from 'react-icons/fa';
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
      contentRef.current.style.top = `${anchorRect.y + anchorRect.height}px`;
      contentRef.current.style.left = `${anchorRect.x}px`;
      contentRef.current.style.width = `${anchorRect.width}px`;
    }
  }, [open]);

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
}) => {
  const { state: editableState } = useContext(EditableContext);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const node = useRef();
  const contentRef = useRef(null);
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const miniSearch = useRef(null);
  const inputRef = useRef(null);
 
  const changeSelected = option => () => {
    setSelected(option[textAttribute]);
    setOpen(false);

    if (onChange) {
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
    if (searchable) {
      miniSearch.current = new MiniSearch({
        fields: searchFields, // fields to index for full-text search
      });
      miniSearch.current.addAll(options)
    } 
    setFilteredOptions(options);
  }, [options]); 

  useEffect(() => {
    if (searchable) {
      const searchOptions = {
        fuzzy: 1,
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
  }, [query, miniSearch]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const selectedText = selected 
    || (preSelected && preSelected[textAttribute]) 
    || defaultText;

  const renderEditableView = () => (
    <div className={cc(['select', className])} ref={node}>
      <div ref={inputRef} className="select__input" onClick={() => setOpen(!open)}>
        <span className="select__inputText">{selectedText}</span>
        <FaCaretDown className={cc(['select__caret', {
          'select__caret--open': open
        }])} />
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
                  <div key={option.id} className="select__option" onClick={changeSelected(option)}>
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
      {selectedText}
    </div>
  );
  
  return editableState && editableState.editable 
    ? renderEditableView() 
    : renderReadonlyView();
};

export default Select;

