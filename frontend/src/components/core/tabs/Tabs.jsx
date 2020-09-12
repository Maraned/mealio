import './tabs.css';

import React, { useState, useEffect } from 'react';
import { Switch, Route, Link, useRouteMatch, Redirect, useLocation } from 'react-router-dom';
import classcat from 'classcat';

export const Tab = React.memo(({ children, isSelected, onClick }) => (
  <div
    onClick={onClick}
      className={classcat(['tab', {
      'tab--selected': isSelected
    }])}
  >
    {children}
  </div>
));

const Tabs = React.memo(({
  views = [],
  defaultRoute,
}) => {
  let match = useRouteMatch();
  let location = useLocation();

  const [tabViews, setTabViews] = useState(views);

  const [activeView, setActiveView] = useState(null);
  const { View, ...rest } = activeView || {};

  useEffect(() => {
    setActiveView(
      views.find(view => {
        const viewRoute = `${match.path}/${view.route}`;
        return viewRoute === location.pathname;
      })
    )
  }, [tabViews, location.pathname, match.path, views]);

  useEffect(() => {
    if (views) {
      setTabViews(views);
    }
  }, [views])

  return (
    <div className="tabs">
      <div className="tabs__header background center flex">
        {tabViews.map(view => {
          const viewLink = `${match.path}/${view.route}`;
          const isSelected = viewLink === location.pathname;
          return (
            <Tab
              key={view.title}
              isSelected={isSelected}
              className="tabs__tab"
            >
              <Link to={viewLink}><h3>{view.title}</h3></Link>
            </Tab>
          )
        })}
      </div>
      <div className="tabs__content">
        <Switch>
          {tabViews.map(view => (
            <Route key={view.name} path={`${match.path}/${view.route}`}>
              <view.View {...rest} />
            </Route>
          ))}

          {defaultRoute && (
            <Route path={match.path}>
              <Redirect to={`${match.path}/${defaultRoute}`} />
            </Route>
          )}
        </Switch>
      </div>
    </div>
  );
});

export default Tabs;
