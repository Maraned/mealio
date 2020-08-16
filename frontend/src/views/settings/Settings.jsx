import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cc from 'classcat';

import { EditableProvider } from 'contexts/editable';
import UserSettings from './UserSettings';
import { ModalSideMenu } from 'components/modal/Modal';

import './settings.css';

const Settings = () => {
  const [activeViewName, setActiveViewName] = useState('UserSettings');
  const { t } = useTranslation();

  const renderMenuOption = viewName => (
    <div 
      className={cc(['modal__sideMenu__option', {
        'settings__menu__option--selected': activeViewName === viewName
      }])}
      onClick={() => setActiveViewName(viewName)}
    >
      {t(`Menu:${viewName}`)}
    </div>
  );

  const renderMenu = () => (
    <ModalSideMenu>
      <div className="background list">
        {renderMenuOption('UserSettings')}
      </div>
    </ModalSideMenu>
  );

  return (
    <div className="settings">
      <EditableProvider>
        {renderMenu()}

        <div className="settings__activeView">
          {activeViewName === 'UserSettings' && (
            <UserSettings />
          )}
        </div>
      </EditableProvider>
    </div>
  );
}

export default Settings;
 