import './recipeCollection.css';

import React, { useState, useEffect, useContext } from 'react';
import { getRequest } from 'utils/request';
import { UserContext } from 'contexts/user';
import RecipeList from 'views/recipeList/RecipeList';

export default function RecipeCollection({

}) {
  const { state: user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);

  const fetchRecipeCollection = async () => {
    if (user.id) {
      const recipeCollection = await getRequest(`users/${user.id}/recipeCollection`);
      setRecipes(recipeCollection);
    }
};

  useEffect(() => {
    fetchRecipeCollection();
  }, []);

  return (
    <div className="recipeCollection">
      <RecipeList recipes={recipes} />
    </div>
  );
}

