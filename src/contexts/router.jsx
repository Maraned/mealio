import React, { createContext, useReducer } from 'react'; 

import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import Settings from 'views/settings/Settings';
import MyRecipes from 'views/myRecipes/MyRecipesWrapper';
import RecipeList from 'views/recipeList/RecipeListWrapper';
import RecipeDetail from 'views/recipeDetail/RecipeDetailWrapper';
import GroceryLists from 'views/groceryList/GroceryListsWrapper';
import NewIngredient from 'components/ingredientList/NewIngredientWrapper';
import AdminPage from 'views/admin/AdminPage';
import AdminDashboard from 'views/admin/Dashboard';
import RecipeCollection from 'views/recipeCollection/RecipeCollection';
import WelcomePage from 'views/welcomePage/WelcomePage';

const getPageData = action => {
  const pages = {
    closeModal: { ModalView: null },
    createRecipe: { ActiveView: CreateRecipeView },
    settings: { ModalView: Settings, ModalData: action.modalData },
    recipeCollection: { ActiveView: RecipeCollection },
    myRecipes: { ActiveView: MyRecipes },
    recipeList: { ActiveView: RecipeList },
    recipeDetail: { ActiveView: RecipeDetail },
    groceryLists: { ModalView: GroceryLists, ModalData: action.modalData },
    adminPage: { ActiveView: AdminPage },
    adminDashboard: { ActiveView: AdminDashboard },
    newIngredient: { 
      ModalView: NewIngredient, 
      ModalData: { 
        groups: action.value, 
        allIngredients: action.allIngredients 
      }, 
      ModalSize: action.size, 
    },
    welcomePage: { ActiveView: WelcomePage },
  }

  return pages[action.type];
}

const routerReducer = (state, action) => {
  let breadcrumbs = [...state.breadcrumbs];
  let pageData = getPageData(action, breadcrumbs);

  if (action.type === 'breadcrumbNavigation') {
    action.type = action.page;
    breadcrumbs = breadcrumbs.slice(0, breadcrumbs.indexOf(action.page) + 1);
    pageData = getPageData(action, breadcrumbs);
  } else if (!pageData.ModalView && action.type !== 'closeModal') {
    breadcrumbs.push(action.type);
  }

  return { ...state, ...pageData, breadcrumbs };
};

const initialState = { ActiveView: WelcomePage, ModalView: null, breadcrumbs: ['welcomePage'] };

export const RouterContext = createContext(initialState);

export const RouterProvider = props => {
  const [state, dispatch] = useReducer(routerReducer, initialState);

  return (
    <RouterContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RouterContext.Provider>
  ) 
};
