import './sideMenuLayout.css';

import React, { useState } from 'react';
import cc from 'classcat';
import { useTranslation } from 'react-i18next';
import { FaPlusCircle } from 'react-icons/fa';

/*
  @param views: Array[{ View, name, text }]
  @param defaultView: String
*/

const SideMenuLayout = ({ views, defaultView }) => {
  const [activeView, setActiveView] = useState(defaultView);
  const { t } = useTranslation();

  const renderSideMenuOption = ({ 
    viewName, 
    text, 
    count, 
    disabled,
    createAction 
  }) => (
    <button 
      key={viewName}
      // className={cc(['sideMenuLayout__sideMenuOption', {
      //   'sideMenuLayout__sideMenuOption--selected': viewName === activeView,
      //   'sideMenuLayout__sideMenuOption--disabled': disabled
      // }])}
      className={cc(['fullWidth', {
        'selected': viewName === activeView,
        'disabled': disabled,
        'create': createAction,
      }])}
      disabled={disabled}
      onClick={disabled ? null : () => setActiveView(viewName)}
    >
      {!!count && (
        <div className="sideMenuLayout__sideMenuOption__count">
          <span>{count}</span>
        </div>
      )}
      {createAction && (
        <FaPlusCircle />
      )}
      {text}
    </button>
  );

  return (
    <div className="sideMenuLayout">
      <div className="sideMenuLayout__sideMenu">
        <div className="background box">
          <h2 className="center">{t(`MyRecipes:${activeView}`)}</h2>
          <div className="box-divider" />
          {views.map(view => renderSideMenuOption({
            viewName: view.name,
            text: t(`MyRecipes:${view.text}`),
            count: view.data && view.data.length,
            ...view
          }))}
        </div>
      </div>

      <div className="sideMenuLayout__activeView viewMaxWidth">
        {views.map(view => view.name === activeView && (
          <view.View 
            key={view.name} 
            title={view.text} 
            data={view.data} 
            viewClassName={view.className}   
          />
        ))}
      </div>
    </div>
  )
};

export default SideMenuLayout;
