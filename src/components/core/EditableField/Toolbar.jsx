import React, { useState, useRef, useEffect, useMemo} from 'react';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import cc from 'classcat';
import { EditorState, RichUtils, SelectionState } from 'draft-js';
import posed from 'react-pose';
import useOutsideClick from 'utils/useOutsideClick';
import uuid from 'utils/uuid';

const ToolbarContainer = posed.div({
  show: { y: 0, opacity: 1, delay: 100 },
  hide: { y: 10, opacity: 0 }
});

export default function Toolbar({
  toolbarButtons = [],
  showToolbar,
  editorState,
  onChange,
}) {
  const [internalShowToolbar, setInternalShowToolbar] = useState(false);
  const toolbarContainerRef = useRef(null);
  
  useOutsideClick(internalShowToolbar && toolbarContainerRef, () => {
    setInternalShowToolbar(false)
  });

  const keyId = useMemo(() => uuid(), []);

  useEffect(() => {
    setInternalShowToolbar(showToolbar);
  }, [showToolbar]);

  const changeInlineStyle = style => () => {
    const currentContent = editorState.getCurrentContent();
    const firstBlock = currentContent.getBlockMap().first();
    const lastBlock = currentContent.getBlockMap().last();
    const firstBlockKey = firstBlock.getKey();
    const lastBlockKey = lastBlock.getKey();
    const lengthOfLastBlock = lastBlock.getLength();

    const selection = new SelectionState({
      anchorKey: firstBlockKey,
      anchorOffset: 0,
      focusKey: lastBlockKey,
      focusOffset: lengthOfLastBlock,
    });

    const updatedState = EditorState.acceptSelection(editorState, selection);
    onChange(RichUtils.toggleInlineStyle(updatedState, style));    
  };

  const toolbarOption = (style, icon) => ({
    icon,
    style,
    onClick: changeInlineStyle(style),
    isSelected: currentStyle => currentStyle.has(style),
  });

  const builtInOptions = {
    bold: toolbarOption('BOLD', <FaBold />),
    italic: toolbarOption('ITALIC', <FaItalic />),
    underline: toolbarOption('UNDERLINE', <FaUnderline />)
  };

  const currentStyle = editorState.getCurrentInlineStyle();

  const renderToolbarOption = button => {
    return !button.hide && (
      <div 
        className={cc(['editableField__toolbar__option', {
          'editableField__toolbar__option--selected': button.isSelected && button.isSelected(currentStyle)
        }])}
        onClick={() => button.onClick(button.style)}
      >
        {button.icon}
      </div>
    );
  };

  return (
    <div ref={toolbarContainerRef} id={`tool-${keyId}`}>
      {!!toolbarButtons.length && (
        <ToolbarContainer
          end={toolbarContainerRef}
          initialPose="hide" 
          pose={internalShowToolbar ? 'show' : 'hide'} 
          className="editableField__toolbar"
          key={`toolbar-${keyId}`}
        >
          {toolbarButtons.map(button => button.type 
            ? renderToolbarOption(builtInOptions[button.type])
            : renderToolbarOption(button)
          )}
        </ToolbarContainer>
      )}
    </div>
  );
}