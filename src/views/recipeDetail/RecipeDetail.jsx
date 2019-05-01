import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegClock } from 'react-icons/fa'; 

import { RecipeContext } from 'contexts/recipe';
import FullWidthContainer from 'components/core/FullWidthContainer';
import EditableField from 'components/core/EditableField';
import ImageGallery from 'components/core/imageGallery/ImageGallery';
import IngredientList from 'components/ingredientList/IngredientList';
import StepList from 'components/stepList/StepList';

const RecipeDetail = () => {
  const { state: recipe } = useContext(RecipeContext);

  if (!recipe) {
    return '';
  }

  const { t } = useTranslation();

  const { 
    name, 
    images ,
    description,
    time,
  } = recipe;

  console.log('RecipeDetail')

  return (
    <div className="createRecipe recipe">
      <FullWidthContainer center stack>
        <EditableField 
          value={name}
          className="recipe__name" 
          placeholder={t('Recipe.Name')}
        />

        {images && (
          <ImageGallery
            className="recipe__imageGallery" 
            images={images} 
          />
        )}

        <EditableField 
          value={description}
          className="recipe__description" 
          placeholder={t('Recipe:Description')}
          type="text"
        />

        <div className="recipe__time">
          <FaRegClock />
          <EditableField 
            value={time}
            placeholder={t('Recipe:Time')}
          />
        </div>
      </FullWidthContainer>

      <FullWidthContainer 
        center={true} 
      >
        <IngredientList />
        <StepList />
      </FullWidthContainer>
    </div>
  );
}

export default RecipeDetail;