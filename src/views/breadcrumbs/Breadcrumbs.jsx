import './breadcrumbs.css';

import React, { useContext } from 'react';
import { RouterContext } from 'contexts/router';
import { useTranslation } from 'react-i18next';
import cc from 'classcat';

export default function Breadcrumbs() {
  const { dispatch, state: { breadcrumbs } } = useContext(RouterContext);
  const { t } = useTranslation();

  const breadcrumbClick = page => {
    dispatch({ type: 'breadcrumbNavigation', page });
  }

  return (
    <div className="breadcrumbs">
      <div className="background box">
        {breadcrumbs.map((breadcrumb, index) => {
          const lastBreadcrumb = index === (breadcrumbs.length - 1);
          console.log('lastBreadcrumb', lastBreadcrumb)
          
          return (
            <span key={breadcrumb}>
              <span 
                className={cc(['breadcrumb', {
                  'breadcrumb--last': lastBreadcrumb
                }])}
                onClick={() => !lastBreadcrumb && breadcrumbClick(breadcrumb)}
              >
                {t(`Breadcrumbs:${breadcrumb}`)}
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