import React, { useState } from 'react';
import cc from 'classcat';
import './sideMenuLayout.css';
import { useTranslation } from 'react-i18next';

/*
  @param views: Array[{ View, name, text }]
  @param defaultView: String
*/

const SideMenuLayout = ({ views, defaultView }) => {
  const [activeView, setActiveView] = useState(defaultView);
  const { t } = useTranslation();

  const renderSideMenuOption = ({ viewName, text, count, disabled }) => (
    <div 
      key={viewName}
      className={cc(['sideMenuLayout__sideMenuOption', {
        'sideMenuLayout__sideMenuOption--selected': viewName === activeView,
        'sideMenuLayout__sideMenuOption--disabled': disabled
      }])}
      onClick={() => setActiveView(viewName)}
    >
      {!!count && (
        <div className="sideMenuLayout__sideMenuOption__count">
          <span>{count}</span>
        </div>
      )}
      {text}
    </div>
  );

  return (
    <div className="sideMenuLayout">
      <div className="sideMenuLayout__sideMenu">
        {views.map(view => renderSideMenuOption({
          viewName: view.name,
          text: t(`MyRecipes:${view.text}`),
          count: view.data && view.data.length,
          disabled: view.disabled
        }))}
      </div>

      <div className="sideMenuLayout__activeView">
        {views.map(view => view.name === activeView && (
          <view.View key={view.name} data={view.data} viewClassName={view.className} />
        ))}
      </div>
    </div>
  )
};

export default SideMenuLayout;
