import React, { useState } from 'react';
import cc from 'classcat';
import './sideMenuLayout.css';
import { useTranslation } from 'react-i18next';

/*
  @param views: Array[{ View, name, text }]
  @param defaultView: String
*/

const SideMenuLayout = ({ views, defaultView, className }) => {
  const [activeView, setActiveView] = useState(defaultView);
  const { t } = useTranslation();

  console.log('activeView', activeView)

  const renderSideMenuOption = ({ viewName, text, count }) => {
    console.log('viewName', viewName, viewName === activeView)
    return (
    <div 
      key={viewName}
      className={cc(['sideMenuLayout__sideMenuOption', {
        'sideMenuLayout__sideMenuOption--selected': viewName === activeView
      }])}
      onClick={() => setActiveView(viewName)}
    >
      {!!count && (
        <div className="sideMenuLayout__sideMenuOption__count">{count}</div>
      )}
      {text}
    </div>
  )
  };

  console.log('views', views)

  return (
    <div className="sideMenuLayout">
      <div className="sideMenuLayout__sideMenu">
        {views.map(view => renderSideMenuOption({
          viewName: view.name,
          text: t(`MyRecipes:${view.text}`),
          count: view.data.length
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
