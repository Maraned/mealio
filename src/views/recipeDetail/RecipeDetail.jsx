import './recipeDetail.css';

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegClock, FaStar } from 'react-icons/fa'; 

import { postRequest, imageUrl } from 'utils/request';

import { RecipeContext } from 'contexts/recipe';
import { UserContext } from 'contexts/user';
import FullWidthContainer from 'components/core/FullWidthContainer';
import EditableField from 'components/core/EditableField/EditableField';
// import ImageGallery from 'components/core/imageGallery/ImageGallery';
import IngredientList from 'components/ingredientList/IngredientList';
import StepList from 'components/stepList/StepList';

const RecipeDetail = () => {
  const { state: recipe } = useContext(RecipeContext);
  const { state: user, dispatch: userDispatch } = useContext(UserContext);
  const { t } = useTranslation();

  if (!recipe) {
    return '';
  }

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

  return (
    <div className="createRecipe recipe viewMaxWidth">
      <FullWidthContainer className="background box flex">
        {!!images && !!images.length && (
          <img className="recipe__image image--rounded" src={imageUrl(images[0])} /> 
        )}

        <div className="flex column child-flex child-margins">
          <EditableField 
            value={name}
            className="recipe__name" 
            placeholder={t('Recipe.Name')}
            titleField
          />

          <div>
            {user.recipeCollection
            && user.recipeCollection.includes(recipe.id) ? (
              <button className="remove" onClick={removeRecipeFromMyCollection}>
                <FaStar className="recipe__saveToCollectionIcon" />
                {t('Recipe:RemoveFromMyCollection')}
              </button>
            ) : (
              <button className="favorite" onClick={addRecipeToMyCollection}>
                <FaStar className="recipe__saveToCollectionIcon" />
                {t('Recipe:AddToMyCollection')}
              </button>
            )}
          </div>


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