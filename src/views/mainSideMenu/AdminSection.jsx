import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { 
  FaTachometerAlt,
  FaCarrot,
} from 'react-icons/fa';

import { RouterContext } from 'contexts/router';
import MenuOption from 'components/core/MenuOption';

export default function AdminSection() {
  const { dispatch: route } = useContext(RouterContext)
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="adminSection box background">

        <Link to="/dashboard">
          <MenuOption 
            text={t('Menu:Dashboard')}
            Icon={FaTachometerAlt}
          />
        </Link>

        <Link to="/newIngredients">
          <MenuOption 
            text={t('Menu:NewIngredients')}
            Icon={FaCarrot}
          />
        </Link>
    </div>
  );
}