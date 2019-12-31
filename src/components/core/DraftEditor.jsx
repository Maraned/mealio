import 'draft-js/dist/Draft.css';

import React, { useState } from 'react';

import { Editor, EditorState, ContentState, convertToRaw } from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';

export default function DraftEditor({
  value = '',
  onChange,
  className,
  placeholder,
  textTag
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
      />
    </div>
  );
}
