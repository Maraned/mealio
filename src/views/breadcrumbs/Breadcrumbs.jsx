import './breadcrumbs.css';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cc from 'classcat';
import { useHistory, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const { t } = useTranslation();
  const history = useHistory();
  let location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState(['/']);

  useEffect(() => {
    const currentLocation = history.location.pathname;
    const currentLocationBreadcrumbs = currentLocation === '/'
      ? ['/'] 
      : currentLocation.split('/');

    currentLocationBreadcrumbs[0] = '/';
    return setBreadcrumbs(currentLocationBreadcrumbs);
  }, [history, location]);

  const breadcrumbClick = (breadcrumb, index) => {
    const newLocationBreadcrumbs = breadcrumbs.slice(0, index + 1 || 1);
    const newLocationPath = newLocationBreadcrumbs.join('/').replace('//', '/');
    history.push(newLocationPath);
  };

  const getBreadcrumbName = breadcrumb => {
    let breadcrumbName = breadcrumb;
    if (breadcrumbName !== '/' &&   breadcrumbName.includes('/')) {
      const splittedBreadcrumd = breadcrumb.split('/');
      breadcrumbName = splittedBreadcrumd[splittedBreadcrumd.length - 1];
    }
    return breadcrumbName;
  }

  return (
    <div className="breadcrumbs">
      <div className="background box">
        {breadcrumbs.map((breadcrumb, index) => {
          const lastBreadcrumb = index === (breadcrumbs.length - 1);
    
          return (
            <span key={breadcrumb + index}>
              <span 
                className={cc(['breadcrumb', {
                  'breadcrumb--last': lastBreadcrumb
                }])}
                onClick={() => !lastBreadcrumb && breadcrumbClick(breadcrumb, index)}
              >
                {t(`Breadcrumbs:${getBreadcrumbName(breadcrumb)}`)}
              </span>

              {!lastBreadcrumb && (
                <span>&nbsp;/&nbsp;</span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  );
}