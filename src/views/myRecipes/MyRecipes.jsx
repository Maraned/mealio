import React, { useState } from 'react';
import DraftRecipes from './DraftRecipes';
import { useTranslation } from 'react-i18next';
import SideMenuLayout from 'components/layouts/SideMenuLayout';
import PublishedRecipes from './PublishedRecipes';

const MyRecipes = () => {
  const [activeView, setActiveView] = useState('draftRecipes');
  const { t } = useTranslation();

  const views = [{
    View: DraftRecipes,
    name: 'draftRecipes',
    text: t('MyRecipes:DraftRecipes'),
  }, {
    View: PublishedRecipes,
    name: 'publishedRecipes',
    text: t('MyRecipes:PublishedRecipes')
  }];
  

  return (
    <SideMenuLayout views={views} defaultView="draftRecipes" />
  );
};

export default MyRecipes;
