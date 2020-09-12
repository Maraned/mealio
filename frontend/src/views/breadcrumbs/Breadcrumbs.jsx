import './breadcrumbs.css';

import React, { useEffect, useState, useContext } from 'react';
import { PublishedRecipesContext } from 'contexts/publishedRecipes';
import { useTranslation } from 'react-i18next';
import cc from 'classcat';
import { useHistory, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const { t } = useTranslation();
  const history = useHistory();
  let location = useLocation();
  const { state: publishedRecipes } = useContext(PublishedRecipesContext);
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

    let translation = t(`Breadcrumbs:${breadcrumbName}`);
    if (!translation) {
      const foundRecipeForBreadcrumb = publishedRecipes.find(recipe => {
        return recipe.url === breadcrumbName;
      });
      if (foundRecipeForBreadcrumb) {
        translation = foundRecipeForBreadcrumb.name;
      }
    }
    return translation;
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
                {getBreadcrumbName(breadcrumb)}
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