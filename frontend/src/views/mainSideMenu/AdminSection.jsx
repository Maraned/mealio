import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import {
  FaTachometerAlt,
  FaCarrot,
} from 'react-icons/fa';

import { AllIngredientsContext } from 'contexts/allIngredients';
import MenuOption from 'components/core/MenuOption';

export default function AdminSection() {
  const { state: allIngredients } = useContext(AllIngredientsContext);
  const { t } = useTranslation();
  const location = useLocation();

  const newIngredientsCount = useMemo(() => {
    return allIngredients.filter(ingredient => ingredient.status === 'pending').length;
  }, [allIngredients]);

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
            notificationCount={newIngredientsCount}
          />
        </Link>
    </div>
  );
}