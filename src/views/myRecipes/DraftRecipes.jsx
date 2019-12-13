import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from 'contexts/user';
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