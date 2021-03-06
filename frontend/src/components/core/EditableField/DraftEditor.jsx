import 'draft-js/dist/Draft.css';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaTimes } from 'react-icons/fa';

import { Editor, EditorState, ContentState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import Toolbar from './Toolbar';
import uuid from 'utils/uuid';

export default function DraftEditor({
  value = '',
  onChange,
  className,
  placeholder,
  textTag,
  onPaste,
  onFocus,
  onRemove,
  toolbarButtons,
  textAlignment,
}) {
  const editorFieldRef = useRef(null);
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);

  const keyId = useMemo(() => uuid(), []);

  // TEXT HANDLING
  const createContent = () => {
    if (textTag) {
      try {
        return convertFromRaw(JSON.parse(value));
      } catch (err) {}

      const processedHTML = DraftPasteProcessor.processHTML(
        `<${textTag}>${value}</${textTag}>`
      );
      return ContentState.createFromBlockArray(processedHTML);
    }

    if (value) {
      try {
        return convertFromRaw(JSON.parse(value));
      } catch (err) {
        return ContentState.createFromText(`${value}`);
      }
    }
    return ContentState.createFromText(`${value}`);
  }

  const [editorState, setEditorState] = useState(() => {
    return EditorState.createWithContent(createContent())
  });

  useEffect(() => {
    const currentValue = editorState.getCurrentContent().getPlainText();
    if (currentValue !== value) {
      setEditorState(EditorState.createWithContent(createContent()));
    }
    // eslint-disable-next-line
  }, [value]);

  const handleOnChange = changedEditorState => {
    setEditorState(changedEditorState);
  };

  const onBlur = () => {
    const changedValue = editorState.getCurrentContent().getPlainText();
    const rawDraftContentState = JSON.stringify( convertToRaw(editorState.getCurrentContent()) );
    if (changedValue !== value && onChange) {
      onChange(rawDraftContentState);
    }
  }

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleOnChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const focusHandler = event => {
    setShowToolbar(true);

    if (onFocus) {
      onFocus(event);
    }
  };

  const onOutsideClick = () => {
    setShowToolbar(false);
  }

  return (
    <>
      <div className={className} ref={editorFieldRef} key={`draftEditor-${keyId}`}>
        <Toolbar
          key={`toolbar-${keyId}-${showToolbar}`}
          showToolbar={showToolbar}
          toolbarButtons={toolbarButtons}
          editorState={editorState}
          onChange={handleOnChange}
          onOutsideClick={onOutsideClick}
        />
        <Editor
          editorState={editorState}
          onChange={handleOnChange}
          onFocus={focusHandler}
          onBlur={onBlur}
          placeholder={placeholder}
          handlePastedText={onPaste}
          handleKeyCommand={handleKeyCommand}
          ref={editorRef}
          textAlignment={textAlignment}
        />
      </div>

      {onRemove && (
        <div className="removeButton" onClick={onRemove}>
          <FaTimes />
        </div>
      )}
    </>
  );
}
