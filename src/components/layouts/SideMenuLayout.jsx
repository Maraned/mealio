import React, { useState } from 'react';
import cc from 'classcat';
import './sideMenuLayout.css';

/*
  @param views: Array[{ View, name, text }]
  @param defaultView: String
*/

const SideMenuLayout = ({ views, defaultView, className }) => {
  const [activeView, setActiveView] = useState(defaultView);

  const renderSideMenuOption = ({ viewName, text }) => (
    <div 
      key={viewName}
      className={cc('myRecipes__sideMenuOption', {
        'myRecipes__sideMenuOption--selected': viewName === activeView
      })}
      onClick={() => setActiveView(viewName)}
    >
      {text}
    </div>
  );

  return (
    <div className="sideMenuLayout">
      <div className="sideMenuLayout__sideMenu">
        {views.map(view => renderSideMenuOption({
          viewName: view.name,
          text: view.text
        }))}
      </div>

      <div className="sideMenuLayout__activeView">
        {views.map(view => view.name === activeView && (
          <view.View key={view.name}/>
        ))}
      </div>
    </div>
  )
};

export default SideMenuLayout;
