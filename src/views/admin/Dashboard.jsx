import './dashboard.css';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getRequest } from 'utils/request';

import Pie from 'components/statistics/pie';

export default function Dashboard() {
  const [statistics, setStatistics] = useState({});
  const [pieMode, setPieMode] = useState(true);
  const { t, i18n } = useTranslation();

  const fetchStatistics = async () => {
    const response = await getRequest('statistics');
    console.log('response', response)
    setStatistics(response);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);


  const renderPieMode = () => {
    const pieSize = 10;
    const userPieSegments = [{
      value: 100,
      label: t('statistics:users', { percent: 100 }),
    }];

    const totalRecipes = statistics.publishedRecipesCount + statistics.draftRecipesCount;
    let recipeSegments = [
      { 
        value: (statistics.publishedRecipesCount / totalRecipes) * 100, 
        label: t('statistics:publishedRecipes', { percent: (statistics.publishedRecipesCount / totalRecipes) * 100 })
      },  
      { 
        value: (statistics.draftRecipesCount / totalRecipes) * 100,
        label: t('statistics:publishedRecipes', { percent: (statistics.draftRecipesCount / totalRecipes) * 100 })
      },
    ];

    return (
      <div className="adminDashboard__pieMode">
        <Pie size={pieSize} segments={userPieSegments} />
        <Pie size={pieSize} segments={recipeSegments} />
      </div>  
    );
  };



  return (
    <div className="adminDashboard">
      {pieMode && renderPieMode()}
    </div>
  );
};
