import './dashboard.css';

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChartPie, FaGripHorizontal } from 'react-icons/fa'; 
import cc from 'classcat';
import { postRequest, getRequest } from 'utils/request';
import { UserContext } from 'contexts/user';
import { get } from 'lodash';

import Pie from 'components/statistics/Pie';

export default function Dashboard() {
  const [settings, setSettings] = useState({
    pieMode: false,
    gridMode: false,
    settings: {
      pieMode: {
        users: {
          include: ['registered'],
          stat: 'count'
        },
        recipes: {
          include: ['published',  'draft'],
          stat: 'count'
        },
      },
      gridMode: {
        users: ['month'],
        publishedRecipes: ['count'],
        authors: ['count'],
      }
    }
  });
  const [statistics, setStatistics] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const { t, i18n } = useTranslation();
  const { state: user, dispatch: userDispatch } = useContext(UserContext);

  const fetchStatistics = async () => {
    const response = await getRequest('statistics', settings);
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

      <div 
        className="adminDashboard__toggleSettings" 
        onClick={() => setShowSettings(!showSettings)}
      >
        <a role="button">{t('Dashboard:Settings')}</a>
      </div>
    </div>
  );

  const renderPieMode = () => {
    const pieStats = get(statistics, 'pieStats', {});

    const pieSize = 10;

    const registeredUsers = get(pieStats, 'users.registered', 0);
    const userPieSegments = [{
      value: registeredUsers * 100,
      label: t('statistics:users', { percent: 100 }),
    }];

    const publishedRecipes = get(pieStats, 'recipes.published', 0);
    const draftRecipes = get(pieStats, 'recipes.draft', 0);
    const totalRecipes = publishedRecipes + draftRecipes;

    let recipeSegments = [
      { 
        value: (publishedRecipes / totalRecipes) * 100, 
        label: t('statistics:publishedRecipes', { percent: (publishedRecipes / totalRecipes) * 100 })
      },  
      { 
        value: (draftRecipes / totalRecipes) * 100,
        label: t('statistics:draftRecipes', { percent: (draftRecipes / totalRecipes) * 100 })
      },
    ];

    return (
      <div className="adminDashboard__pieMode">
        <Pie size={pieSize} segments={userPieSegments} />
        <Pie size={pieSize} segments={recipeSegments} />
      </div>  
    );
  };

  const renderSettingOption = (label, viewMode, toggleMode) => (
    <div className="adminDashboard__settingsOption">
      <div className="adminDashboard__settingsOption__viewMode">
        <button 
          className={cc(['adminDashboard__viewModeOption', {
            'adminDashboard__viewModeOption--disabled': !viewMode
          }])}
          onClick={() => toggleMode(!viewMode)}
        >
          {t(`Dashboard:${label}`)}
        </button>
      </div>
    </div>
  );

  const renderSettings = () => {
    return (
      <div className="adminDashboard__settings">

      </div>
    )
  }


  return (
    <div className="adminDashboard">
      {renderViewModeOptions()}
      {renderSettings()}
      {settings.pieMode && renderPieMode()}
    </div>
  );
};

