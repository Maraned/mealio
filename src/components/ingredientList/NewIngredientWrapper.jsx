import React from 'react';

import { EditableProvider } from 'contexts/editable';

import NewIngredient from './NewIngredient';

const NewIngredientWrapper = ({ data }) => (
  <EditableProvider editable={true}>
    <NewIngredient {...data} />
  </EditableProvider>
);

export default NewIngredientWrapper;

