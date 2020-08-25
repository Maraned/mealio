import React, { useState, useRef, useEffect, useMemo} from 'react';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import cc from 'classcat';
import { EditorState, RichUtils, SelectionState } from 'draft-js';
import useOutsideClick from 'utils/useOutsideClick';
import uuid from 'utils/uuid';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toolbar({
  toolbarButtons = [],
  showToolbar,
  onOutsideClick,
  editorState,
  onChange,
}) {
  const toolbarContainerRef = useRef(null);

  useOutsideClick(showToolbar && toolbarContainerRef.current?.parentElement?.parentElement, () => {
    if (onOutsideClick) {
      onOutsideClick();
    }
  });

  const keyId = useMemo(() => uuid(), []);

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

  const renderToolbarOption = (button, keyId) => {
    return !button.hide && (
      <div
        key={`tool-${keyId}-${button.name}`}
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
    <AnimatePresence initial={false} key={keyId}>
      {showToolbar && (
        <motion.div
          initial={{ opactiy: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div ref={toolbarContainerRef} id={`tool-${keyId}`}>
            {!!toolbarButtons.length && (
              <div
                className="editableField__toolbar"
                key={`toolbar-${keyId}`}
              >
                {toolbarButtons.map(button => button.type
                  ? renderToolbarOption(builtInOptions[button.type], keyId)
                  : renderToolbarOption(button, keyId)
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}