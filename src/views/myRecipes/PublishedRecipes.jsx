import React from 'react'; 
import RecipeAccordion from 'views/myRecipes/RecipeAccordion';

const PublishedRecipes = ({ data: recipes }) => {

  return (
    <div className="publishedRecipes">
      {recipes.map((recipe, index) => (
        <RecipeAccordion 
          recipe={recipe} 
          key={index} 
          index={index} 
        />
      ))}
    </div>
  )
};

export default PublishedRecipes;

