import './dashboard.css';

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChartPie, FaGripHorizontal } from 'react-icons/fa'; 
import cc from 'classcat';
import { postRequest, getRequest } from 'utils/request';
import { UserContext } from 'contexts/user';

import Pie from 'components/statistics/pie';

export default function Dashboard() {
  const [settings, setSettings] = useState({
    pieMode: false,
    pieSettings: [],
    gridMode: false,
    gridSettings: [],
  });
  const [statistics, setStatistics] = useState({});
  const { t, i18n } = useTranslation();
  const { state: user, dispatch: userDispatch } = useContext(UserContext);

  const fetchStatistics = async () => {
    const response = await getRequest('statistics');
    setStatistics(response);
  };

  useEffect(() => {
    if (user && user.dashboardSettings) {
      setSettings(user.dashboardSettings);
    }
  }, [user]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const viewModeOption = (toggleMode, viewMode, Icon) => (
    <button 
      className={cc(['adminDashboard__viewModeOption', {
        'adminDashboard__viewModeOption--disabled': !viewMode
      }])}
      onClick={() => toggleMode(!viewMode)}
    >
      <Icon />
    </button>
  );

  const updateSettings = setting => value => {
    const modifiedSettings = { ...settings };
    modifiedSettings[setting] = value;
    setSettings(modifiedSettings);
  };

  const saveSettings = async () => {
    const newUserData = await postRequest(`users/${user.id}/dashboardSettings`, { 
      dashboardSettings: settings  
    });
    if (newUserData.id) {
      userDispatch({ type: 'user', value: newUserData});
    }
  };

  const renderViewModeOptions = () => (
    <div className="adminDashboard__viewModeOptions">
      {viewModeOption(updateSettings('pieMode'), settings.pieMode, FaChartPie)}
      {viewModeOption(updateSettings('gridMode'), settings.gridMode, FaGripHorizontal)}

      <button onClick={saveSettings}>
        {t('Dashboard:SaveSettings')}
      </button>
    </div>
  )

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
        label: t('statistics:draftRecipes', { percent: (statistics.draftRecipesCount / totalRecipes) * 100 })
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
      {renderViewModeOptions()}
      {settings.pieMode && renderPieMode()}
    </div>
  );
};

