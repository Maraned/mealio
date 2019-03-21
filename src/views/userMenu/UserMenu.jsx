import React, { useState, useEffect, useContext, useRef } from 'react';
import posed from 'react-pose';
import { useTranslation } from 'react-i18next';
import { FaSignOutAlt, FaCogs } from 'react-icons/fa';

import Avatar from 'components/user/Avatar';
import { LoggedInContext } from 'contexts/login';
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
  }

  const routeToSettings = () => {
    setMenuOpen(false);
    route({ type: 'settings' });
  }

  return (
    <div className="userMenu" ref={menuRef}>
      <Avatar onClick={() => setMenuOpen(!menuOpen)} />

      <Menu pose={menuOpen ? 'open' : 'closed'} className="userMenu__menu">
        <div className="userMenu__menu__option" onClick={logout}>
          <FaSignOutAlt />
          <span>{t('Menu:Logout')}</span>
        </div>

        <div className="userMenu__menu__option" onClick={routeToSettings}>
          <FaCogs />
          <span>{t('Menu:Settings')}</span>
        </div>
      </Menu>
    </div>
  );
}

export default UserMenu;
