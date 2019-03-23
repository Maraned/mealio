import React, { useContext, useState, useEffect } from 'react';

import { GunContext } from 'contexts/gun';
import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';

import IngredientList from 'components/ingredientList/IngredientList';
import StepList from 'components/stepList/StepList';
import EditableField from 'components/core/EditableField';
import FullWidthContainer from 'components/core/FullWidthContainer';
import ImageUpload from 'components/core/imageUpload/ImageUpload';
import ImageGallery from 'components/core/imageGallery/ImageGallery';
import ImageOrder from 'components/core/imageOrder/ImageOrder';

import 'views/recipe/recipe.css';

import { useTranslation } from 'react-i18next';
import { FaRegClock } from 'react-icons/fa';

import './createRecipe.css';

const CreateRecipe = () => {
  const Gun = useContext(GunContext);
  const { dispatch, state: editState } = useContext(EditableContext);
  const { state, dispatch: updateRecipe } = useContext(RecipeContext);
  const { t } = useTranslation();
  const { name, description, images, time } = state;

  useEffect(() => {
    dispatch({ type: 'edit' })
  }, []);

  const toggleViewMode = () => {
    editState.editable 
      ? dispatch({ type: 'view' })
      : dispatch({ type: 'edit' })
  }

  const changeName = event => {
    updateRecipe({ type: 'name', value: event.target.value });
  }

  const changeDescription = event => {
    updateRecipe({ type: 'description', value: event.target.value });
  }

  const addImages = files => {
    const newImages = [...images, ...Array.from(files)];
    updateRecipe({ type: 'images', value: newImages });
  }

  const updateImages = images => {
    updateRecipe({ type: 'images', value: images });
  }

  const changeTime = event => {
    updateRecipe({ type: 'time', value: event.target.value });
  }

  return (
    <div className="createRecipe recipe">
      <button 
        className="createRecipe__toggleModeBtn"
        onClick={toggleViewMode}
      >
        {editState.editable 
          ? t('Recipe:View') 
          : t('Recipe:Edit')}
      </button>

      <FullWidthContainer center stack>
        <EditableField 
          onChange={changeName} 
          value={name}
          className="recipe__name" 
          placeholder={t('Recipe.Name')}
        />

        {editState.editable && (
          <>
            <ImageUpload 
              onDrop={addImages} 
              className="recipe__imageUpload" 
              id="createRecipe"
            />
            <ImageOrder 
              onOrderChange={updateImages}
              className="recipe__imageGallery" 
              images={images}
            />
          </>
        )}

        {!editState.editable && (
          <ImageGallery
          className="recipe__imageGallery" 
            images={images} 
          />
        )}

        <EditableField 
          onChange={changeDescription} 
          value={description}
          className="recipe__description" 
          placeholder={t('Recipe:Description')}
          type="text"
        />

        <div className="recipe__time">
          <FaRegClock />
          <EditableField 
            onChange={changeTime} 
            value={time}
            placeholder={t('Recipe:Time')}
          />
        </div>
      </FullWidthContainer>

      <FullWidthContainer center>
        <IngredientList />
        <StepList />
      </FullWidthContainer>
    </div>
  )
}

export default CreateRecipe;
