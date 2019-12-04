import React from 'react';

import { GroceryListProvider } from 'contexts/groceryList';
import { EditableProvider } from 'contexts/editable';
import GroceryLists from './GroceryLists';

const GroceryListsWrapper = ({ data }) => {
  return (
    <GroceryListProvider>
      <EditableProvider>
        <GroceryLists data={data} />
      </EditableProvider>
    </GroceryListProvider>
  )
};

export default GroceryListsWrapper;
