import './profileSection.css';

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaSignOutAlt,
  FaCogs,
  FaUtensils,
  FaListUl,
  FaStar
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

import { UserContext } from 'contexts/user';
import { LoggedInContext } from 'contexts/login';

import Avatar from 'components/user/Avatar';
import MenuOption from 'components/core/MenuOption';

export default function ProfileSection() {
  const { state: user } = useContext(UserContext);
  const { dispatch } = useContext(LoggedInContext);
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="profileSection box background">
      <div className="flex vcenter">
        <Avatar  />
        <div className="profileSection__userName">{user.displayName || user.email}</div>
      </div>
      <div className="boxDivider" />

      <div className="flex column">
        <Link to={{ pathname: '/settings', state: { modal: true, previousLocation: location}}}>
          <MenuOption
            text={t('Menu:Settings')}
            Icon={FaCogs}
          />
        </Link>

        <Link to="/savedRecipes">
          <MenuOption
            text={t('Menu:MyRecipeCollection')}
            Icon={FaStar}
          />
        </Link>

        <Link to="/myRecipes">
          <MenuOption
            text={t('Menu:MyRecipes')}
            Icon={FaUtensils}
          />
        </Link>

        <Link to={{ pathname: '/grocerylists', state: { modal: true, previousLocation: location }}}>
          <MenuOption
            text={t('Menu:GroceryLists')}
            Icon={FaListUl}
          />
        </Link>

        <MenuOption
          onClick={() => dispatch({ type: 'logout' })}
          text={t('Menu:Logout')}
          Icon={FaSignOutAlt}
        />
      </div>
    </div>
  );
}