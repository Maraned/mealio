import './modalButtons.css';

import React from 'react';
import cc from 'classcat';

import { useTranslation } from 'react-i18next';

export default function ModalButtons({
  onSave,
  saveText,
  saveDisabled,
}) {
  const { t } = useTranslation();

  return (
    <div className="modalButtons">
      {onSave && (
        <button 
          className={cc({ 'disabled': saveDisabled })} 
          disabled={saveDisabled} 
          onClick={onSave}
        >
          {saveText || t('Modal:Save')}
        </button>
      )}
    </div>
  )
}