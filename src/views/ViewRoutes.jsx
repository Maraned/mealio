import React from 'react';

import { Switch, Route, useLocation } from 'react-router-dom';

import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import MyRecipes from 'views/myRecipes/MyRecipesWrapper';
import RecipeList from 'views/recipeList/RecipeListWrapper';
import RecipeDetail from 'views/recipeDetail/RecipeDetailWrapper';
import RecipeCollection from 'views/recipeCollection/RecipeCollection';
import WelcomePage from 'views/welcomePage/WelcomePage';
import Dashboard from 'views/admin/Dashboard';
import NewIngredients from 'views/admin/newIngredients/NewIngredients';

export default function ViewRoutes() {
  const location = useLocation();

  const isModal = location.state && location.state.modal;
  const previousLocation = location.state && location.state.previousLocation;

  return (
    <Switch location={isModal ? previousLocation : location}>
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

      <Route path="/dashboard">
        <Dashboard />
      </Route>

      <Route path="/newIngredients">
        <NewIngredients />
      </Route>

      <Route path="/">
        <WelcomePage />
      </Route>
    </Switch>
  );
}
