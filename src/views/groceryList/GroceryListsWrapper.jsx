import React from 'react';

import { GroceryListProvider } from 'contexts/groceryList';
import GroceryLists from './GroceryLists';

const GroceryListsWrapper = ({ data }) => {
  return (
    <GroceryListProvider>
      <GroceryLists data={data} />
    </GroceryListProvider>
  )
};

export default GroceryListsWrapper;
