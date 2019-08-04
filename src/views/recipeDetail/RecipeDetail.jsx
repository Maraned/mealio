import './recipeDetail.css';

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegClock, FaStar } from 'react-icons/fa'; 

import { postRequest } from 'utils/request';

import { RecipeContext } from 'contexts/recipe';
import { UserContext } from 'contexts/user';
import FullWidthContainer from 'components/core/FullWidthContainer';
import EditableField from 'components/core/EditableField';
import ImageGallery from 'components/core/imageGallery/ImageGallery';
import IngredientList from 'components/ingredientList/IngredientList';
import StepList from 'components/stepList/StepList';

const RecipeDetail = () => {
  const { state: recipe } = useContext(RecipeContext);
  const { state: user, dispatch: userDispatch } = useContext(UserContext);

  if (!recipe) {
    return '';
  }

  const { t } = useTranslation();

  const { 
    id,
    name, 
    images ,
    description,
    time,
  } = recipe;

  const addRecipeToMyCollection = async () => {
    const newUserData = await postRequest('recipes/saveToCollection', { 
      id, 
      userId: user.id 
    });
    if (newUserData.id) {
      userDispatch({ type: 'user', value: newUserData});
    }
  };

  const removeRecipeFromMyCollection = async () => {
    const newUserData = await postRequest('recipes/removeFromCollection', { 
      id, 
      userId: user.id 
    });
    if (newUserData.id) {
      userDispatch({ type: 'user', value: newUserData});
    }
  }

  console.log('recipedetail user', user) 

  return (
    <div className="createRecipe recipe">
      <FullWidthContainer center stack>
        <EditableField 
          value={name}
          className="recipe__name" 
          placeholder={t('Recipe.Name')}
          titleField
        />

        {user.recipeCollection
         && user.recipeCollection.includes(recipe.id) ? (
          <button className="recipe__savedInCollectionButton" onClick={removeRecipeFromMyCollection}>
            <FaStar className="recipe__saveToCollectionIcon" />
            {t('Recipe:RemoveFromMyCollection')}
          </button>
        ) : (
          <button onClick={addRecipeToMyCollection}>
            <FaStar className="recipe__saveToCollectionIcon" />
            {t('Recipe:AddToMyCollection')}
          </button>
        )}

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