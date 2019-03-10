import React, { useContext, useEffect, useState } from 'react';

import { GunContext } from 'contexts/gun';

const RecipeList = () => {
  const gun = useContext(GunContext);
  const [recipes, setRecipes] = useState([]);

  const listenForRecipes = async () => {
    gun.get('recipes').on((recipes, key) => {
      setRecipes(recipes);
    });
  }

  useEffect(() => {
    listenForRecipes();
  }, []);

  return (
    <div className="recipeList">

    </div>
  )
}

export default RecipeList;
