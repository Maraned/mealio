import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cc from 'classcat';

import UserSettings from './UserSettings';
import Modal from 'components/modal/Modal';

import './settings.css';

const Settings = () => {
  const [ActiveView, setActiveView] = useState(UserSettings);
  const [activeViewName, setActiveViewName] = useState('UserSettings');
  const { t } = useTranslation();

  const setUserSettingsActive = () => {
    setActiveViewName('UserSettings');
    setActiveView(UserSettings);
  }

  const renderMenu = () => (
    <div className="settings__menu">
      <div 
        className={cc(['settings__menu__option', {
          'settings__menu__option--selected': activeViewName === 'UserSettings'
        }])}
        onClick={setUserSettingsActive}
      >
        {t('Menu:User')}
      </div>
    </div>
  );

  return (
    <div className="settings">
      {renderMenu()}

      {ActiveView}
    </div>
  );
}

export default Settings;
