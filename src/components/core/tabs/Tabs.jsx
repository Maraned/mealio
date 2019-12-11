import './tabs.css';

import React, { useState } from 'react';
import posed from 'react-pose';

const Tab = posed.div({
  enter: {
    opacity: 1,
    borderColor: 'red',
    delay: 150,
    transition: {
      y: { type: 'spring', stiffness: 1000, damping: 15 },
      borderColor: { ease: 'easeOut', duration: 150 },
    }
  },
  exit: {
    opacity: 0.3,
    borderColor: 'none',
    transition: { 
      duration: 150,
      borderColor: { ease: 'easeOut', duration: 300 },
    }
  }
});


export default function Tabs({
  views = []
}) {
  const [activeView, setActiveView] = useState(views.length 
    ? views[0]
    : null
  );
  const { View, ...rest } = activeView;

  return (
    <div className="tabs">
      <div className="tabs__header background center flex">
        {views.map(view => {
          const isSelected = activeView.name === view.name;
          return (
            <Tab 
              onClick={() => setActiveView(view)}
              key={view.name}
              pose={isSelected ? 'enter' : 'exit'}
              className="tabs__tab"
            >
              <h3>{view.title}</h3>
            </Tab>
          )
        })}
      </div>
      <div className="tabs__content">
        {activeView && (
          <View {...rest} />
        )}
      </div>
    </div>
  );
}