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

import 'views/recipe/recipe.css';

import { useTranslation } from 'react-i18next';

import './createRecipe.css';

const CreateRecipe = () => {
  const Gun = useContext(GunContext);
  const { dispatch, state: editState } = useContext(EditableContext);
  const { state, dispatch: updateRecipe } = useContext(RecipeContext);
  const { t } = useTranslation();
  const { name, description, images } = state;

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

  const onFileDrop = files => {
    const newImages = [...images, ...Array.from(files)];
    updateRecipe({ type: 'images', value: newImages });
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
          <ImageUpload 
            onDrop={onFileDrop} 
            className="recipe__imageUpload" 
          />
        )}

        <ImageGallery
          className="recipe__imageGallery" 
          images={images} 
        />

        <EditableField 
          onChange={changeDescription} 
          value={description}
          className="recipe__description" 
          placeholder={t('Recipe.Description')}
        />
      </FullWidthContainer>

      <FullWidthContainer>
        <IngredientList />
        <StepList />
      </FullWidthContainer>
    </div>
  )
}

export default CreateRecipe;
