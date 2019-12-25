import React, { useState } from 'react';

import { Editor, EditorState, ContentState, convertToRaw } from 'draft-js';

export default function DraftEditor({
  value = '',
  onChange,
  className,
}) {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(`${value}`))
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
      />
    </div>
  );
}
