import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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

  const style = useMemo(() => {
    let styling = {};
    if (changedValue && size) {
      styling = {
        textAlign,
        width: `${size}px`
      }
    }
    return styling;
  }, [size, textAlign, changedValue]);

  return (
    <>
      <input
        style={style}
        ref={inputRef}
        value={changedValue}
        onChange={handleOnChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {unit && !!changedValue && (
        <span key={`unit-${unit}-${changedValue}`}>
          {t(`Unit:${unit}`, { count: parseInt(changedValue, 10) })}
        </span>
      )}
    </>
  );
}
