import { useContext } from 'react';
import { DraftRecipesContext } from 'contexts/draftRecipes';
import { PublishedRecipesContext } from 'contexts/publishedRecipes';
import { getRequest } from 'utils/request'; 


const FetchMyRecipes = () => {
  const { 
    state: draftRecipes, 
    dispatch: draftRecipesDispatch 
  } = useContext(DraftRecipesContext);

  const {
    state: publishedRecipes,
    dispatch: publishedRecipesDispatch
  } = useContext(PublishedRecipesContext);


  const getDraftRecipes = async (userId) => {
    const recipes = await getRequest(`users/${userId}/draftRecipes`);
    console.log('getDraftRecipes', recipes)
    draftRecipesDispatch({ type: 'update', value: Object.values(recipes) })
  };

  const getPublishedRecipes = async (userId) => {
    const recipes = await getRequest(`users/${userId}/publishedRecipes`);
    console.log('getPublishedRecipes', recipes)
    publishedRecipesDispatch({ type: 'update', value: Object.values(recipes) })
  };

  return {
    draftRecipes, 
    publishedRecipes,
    getDraftRecipes,
    getPublishedRecipes,
  }
}

export default FetchMyRecipes;