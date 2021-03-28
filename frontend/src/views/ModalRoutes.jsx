import React from 'react';

import { Switch, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NewIngredient from 'components/ingredientList/NewIngredientWrapper';
import RemoveIngredients from 'components/ingredientList/RemoveIngredients';
import Settings from 'views/settings/Settings';
import GroceryLists from 'views/groceryList/GroceryListsWrapper';

import Modal from 'components/modal/Modal';

export default function ModalRoutes() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Switch>
      <Route path="/newIngredient">
        <Modal ModalSize="auto">
          <NewIngredient {...location.state ? location.state.data : {}} />
        </Modal>
      </Route>

      <Route path={`/removeIngredients`}>
        <Modal ModalSize="auto" headerTitle={t('RemoveIngredients:Title')}>
          <RemoveIngredients {...location.state} />
        </Modal>
      </Route>

      <Route path="/settings">
        <Modal>
          <Settings />
        </Modal>
      </Route>

      <Route path="/grocerylists">
        <Modal headerTitle={t('GroceryList:Title')}>
          <GroceryLists data={location.state && location.state.data} />
        </Modal>
      </Route>
    </Switch>
  );
}