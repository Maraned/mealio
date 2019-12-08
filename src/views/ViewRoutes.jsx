import React from 'react';

import { Switch, Route } from 'react-router-dom';

import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import MyRecipes from 'views/myRecipes/MyRecipesWrapper';
import RecipeList from 'views/recipeList/RecipeListWrapper';
import RecipeDetail from 'views/recipeDetail/RecipeDetailWrapper';
import GroceryLists from 'views/groceryList/GroceryListsWrapper';
import AdminPage from 'views/admin/AdminPage';
import AdminDashboard from 'views/admin/Dashboard';
import RecipeCollection from 'views/recipeCollection/RecipeCollection';
import WelcomePage from 'views/welcomePage/WelcomePage';

export default function ViewRoutes() {
  return (
    <Switch>
      <Route path="/recipes/create">
        <CreateRecipeView />
      </Route>

      <Route path="/myRecipes">
        <MyRecipes />
      </Route>

      <Route path="/savedRecipes">
        <RecipeCollection />
      </Route>

      <Route path="/recipes/:name">
        <RecipeDetail />
      </Route>

      <Route path="/recipes">
        <RecipeList />
      </Route>

      <Route path="/">
        <WelcomePage />
      </Route>
    </Switch>
  );
}