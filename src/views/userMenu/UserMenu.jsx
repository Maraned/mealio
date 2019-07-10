import React, { useState, useEffect, useContext, useRef } from 'react';
import posed from 'react-pose';
import { useTranslation } from 'react-i18next';
import { FaSignOutAlt, FaCogs, FaUtensils, FaListUl, FaUsersCog } from 'react-icons/fa';

import Avatar from 'components/user/Avatar';
import { LoggedInContext } from 'contexts/login';
import { UserContext } from 'contexts/user';
import { removeTokens } from 'utils/token';

import './userMenu.css';
import { RouterContext } from 'contexts/router';

const Menu = posed.div({
  closed: {
    height: 0,
    opacity: 0,
  },
  open: {
    height: 'auto',
    opacity: 1
  }
});

const UserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { state: user } = useContext(UserContext);
  const { dispatch } = useContext(LoggedInContext);
  const { dispatch: route } = useContext(RouterContext)
  const { t, i18n } = useTranslation();
  const menuRef = useRef(null);

  const clickHandler = event => {
    if (!menuRef.current || !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    } 
  }

  useEffect(() => {
    window.addEventListener('click', clickHandler);

    return () => window.removeEventListener('click', clickHandler);
  }, [menuOpen]);

    
  const logout = () => {
    removeTokens();
    dispatch({ type: 'logout' });
  };

  const routeToView = view => () => {
    setMenuOpen(false);
    route({ type: view });
  };

  const renderMenuOption = ({ onClick, text, Icon }) => (
    <div className="userMenu__menu__option" onClick={onClick}>
      <Icon />
      <span>{text}</span>
    </div>
  );

  return (
    <div className="userMenu" ref={menuRef}>
      {user.isAdmin && (
        <FaUsersCog className="userMenu__adminDashboard" onClick={routeToView('adminPage')} />
      )}

      <Avatar onClick={() => setMenuOpen(!menuOpen)} />

      <Menu pose={menuOpen ? 'open' : 'closed'} className="userMenu__menu">
        {renderMenuOption({ 
          onClick: routeToView('settings'), 
          text: t('Menu:Settings'),
          Icon: FaCogs
        })}

        {renderMenuOption({ 
          onClick: routeToView('myRecipes'), 
          text: t('Menu:MyRecipes'),
          Icon: FaUtensils
        })}

        {renderMenuOption({
          onClick: routeToView('groceryLists'),
          text: t('Menu:GroceryLists'),
          Icon: FaListUl
        })}

        {renderMenuOption({ 
          onClick: logout, 
          text: t('Menu:Logout'),
          Icon: FaSignOutAlt
        })}
      </Menu>
    </div>
  );
}

export default UserMenu;
