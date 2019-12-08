import React from 'react';

import { EditableProvider } from 'contexts/editable';

import NewIngredient from './NewIngredient';

const NewIngredientWrapper = ({ data, closeModal }) => (
  <EditableProvider editable={true}>
    <NewIngredient {...data} closeModal={closeModal} />
  </EditableProvider>
);

export default NewIngredientWrapper;

