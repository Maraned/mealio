import './profileSection.css';

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaSignOutAlt, 
  FaCogs, 
  FaUtensils, 
  FaListUl, 
  FaUsersCog,
  FaStar 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { UserContext } from 'contexts/user';
import { RouterContext } from 'contexts/router';
import { LoggedInContext } from 'contexts/login';

import Avatar from 'components/user/Avatar';
import MenuOption from 'components/core/MenuOption';

export default function ProfileSection({

}) {
  const { state: user } = useContext(UserContext);
  const { dispatch: route } = useContext(RouterContext)
  const { dispatch } = useContext(LoggedInContext);
  const { t } = useTranslation();

  return (
    <div className="profileSection box background">
      <div className="flex vcenter">
        <Avatar  />
        <div className="profileSection__userName">{user.displayName || user.email}</div>
      </div>
      <div className="boxDivider" />

      <div className="flex column">
        <MenuOption 
          text={t('Menu:Settings')}
          Icon={FaCogs}
          onClick={() => route({ type: 'settings', modalData: {
            headerTitle: t('Menu:Settings')
          }})}
        />

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

        <MenuOption
          onClick={() => route({ 
            type: 'groceryLists', 
            value: {
              headerTitle: t('GroceryList:Title'),
            } 
          })}
          text={t('Menu:GroceryLists')}
          Icon={FaListUl}
        />

        <MenuOption 
          onClick={() => dispatch({ type: 'logout' })}
          text={t('Menu:Logout')}
          Icon={FaSignOutAlt}
        />
      </div>
    </div>
  );
}