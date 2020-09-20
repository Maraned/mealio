import React, { useState, useEffect, useRef } from 'react';

export default function Input({
  disableEnter,
  disableTab,
  onChange,
  value,
  type = 'text',
  placeholder,
  unit,
  size,
  textAlign = 'left',
}) {
  const inputRef = useRef(null);
  const [changedValue, setChangedValue] = useState(() => value);
  useEffect(() => {
    setChangedValue(value || '');
  }, [value]);

  const handleOnChange = event => {
    const value = event.target.value;
    if (!value) {
      return setChangedValue(value);
    }
    if (type === 'number') {
      return setChangedValue(parseInt(value, 10));
    }
    return setChangedValue(value);
  };

  const onBlur = () => {
    onChange(changedValue);
  };

  const handleKeyDown = event => {
    if (event.keyCode === 9 && !disableTab) {
      inputRef.current.blur();
    }
    if (event.keyCode === 13 && !disableEnter) {
      inputRef.current.blur();
    }
  }

  return (
    <>
      <input
        style={{ width: `${size}px`, textAlign }}
        ref={inputRef}
        value={changedValue}
        onChange={handleOnChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {unit && (
        <span>{unit}</span>
      )}
    </>
  );
}
