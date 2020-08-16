import './adminHeader.css';

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterContext } from 'contexts/router';

export default function AdminHeader({

}) {
  const { dispatch: route } = useContext(RouterContext);
  const { t } = useTranslation();

  const navigateTo = pageName => event => {
    event.preventDefault();
    event.stopPropagation();
    route({ type: pageName });
  }
 
  const renderMenuOption = ({ pageName }) => (
    <a href="#" className="adminHeader__nav" onClick={navigateTo(pageName)}>
      {t(`adminHeader:${pageName}`)}
    </a>
  );

  const menuOptions = [
    { pageName: 'adminDashboard' },
    { pageName: 'users' },
    { pageName: 'pendingIngredients' },

  ];

  return (
    <nav className="adminHeader">
      {menuOptions.map(option => renderMenuOption(option))}
    </nav>
  )
};
