import React from 'react'; 
import RecipeAccordion from 'views/myRecipes/RecipeAccordion';

const RecipeAccordionList = ({ data: recipes }) => (
  <div className="recipeAccordionList">
    {recipes.map((recipe, index) => (
      <RecipeAccordion 
        recipe={recipe} 
        key={index} 
        index={index} 
      />
    ))}
  </div>
);

export default RecipeAccordionList;

