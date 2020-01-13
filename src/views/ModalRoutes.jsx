import React from 'react';

import { Switch, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NewIngredient from 'components/ingredientList/NewIngredientWrapper';
import Settings from 'views/settings/Settings';
import GroceryLists from 'views/groceryList/GroceryListsWrapper';

import Modal from 'components/modal/Modal';

export default function ModalRoutes({

}) {
  const location = useLocation();
  const { t } = useTranslation();

  console.log('location state data', location.state && location.state.data)

  return (
    <Switch>
      <Route path="/newIngredient">
        <Modal ModalSize="auto">
          <NewIngredient {...location.state ? location.state.data : {}} />
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