import React from 'react';
import RecipeAccordion from 'views/myRecipes/RecipeAccordion'

import './draftRecipes.css';

const DraftRecipes = ({ draftRecipes }) => {
  return (
    <div className="draftRecipes" key="draftRecipes">
      {draftRecipes && draftRecipes.map((recipe, index) => (
        <RecipeAccordion 
          recipe={recipe} 
          key={index} 
          index={index} 
        />
      ))}
    </div>
  )
};

export default DraftRecipes;