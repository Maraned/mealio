import 'draft-js/dist/Draft.css';

import React, { useState, useEffect } from 'react';

import { Editor, EditorState, ContentState, convertToRaw } from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';

export default function DraftEditor({
  value = '',
  onChange,
  className,
  placeholder,
  textTag,
  onPaste
}) {
  const createContent = () => {
    if (textTag) {
      const processedHTML = DraftPasteProcessor.processHTML(
        `<${textTag}>${value}</${textTag}>`
      );
      return ContentState.createFromBlockArray(processedHTML);
    }
    return ContentState.createFromText(`${value}`);
  }

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(createContent())
  );

  useEffect(() => {
    const currentValue = editorState.getCurrentContent().getPlainText();
    if (currentValue !== value) {
      setEditorState(EditorState.createWithContent(createContent()));
    }
  }, [value]);

  const handleOnChange = editorState => {
    const changedValue = editorState.getCurrentContent().getPlainText();
    if (changedValue !== value && onChange) {
      onChange(changedValue);
    }
    setEditorState(editorState)
  };

  return (
    <div className={className}>
      <Editor
        editorState={editorState}
        onChange={handleOnChange}
        placeholder={placeholder}
        handlePastedText={onPaste}
      />
    </div>
  );
}
