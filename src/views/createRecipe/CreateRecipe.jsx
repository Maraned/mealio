import React, { useContext, useState, useEffect, useRef } from 'react';

import { GunContext } from 'contexts/gun';
import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';
import { UserContext } from 'contexts/user';

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
  const { state: userState } = useContext(UserContext);
  const { dispatch, state: editState } = useContext(EditableContext);
  const { state, dispatch: updateRecipe } = useContext(RecipeContext);
  const { t, i18n } = useTranslation();
  const { name, description, images, time, id } = state;
  const autoSave = useRef(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [lastSavedText, setLastSavedText] = useState('');

  const updateLastSaved = date => {
    if (!date) {
      if (!lastSaved) {
        return;   
      }
      date = lastSaved;
    }
    var options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
      second: 'numeric'
    };
    const locale = i18n.language === 'sv' ? 'sv-SE' : 'en-GB';
    setLastSavedText(date.toLocaleDateString(locale, options));
  };

  const parseRecipeForGun = async () => {
    const { images, ingredients, steps, ...rest } = state;
    if (id) {
      userState.user.get(`draftRecipes/${id}`).put(rest);
    } else {
      userState.user.get('draftRecipes').set(rest);
    }
  }

  const autoSaveDraft = () => {
    const newSavedDate = new Date();
    setLastSaved(newSavedDate);
    updateLastSaved(newSavedDate);
    parseRecipeForGun();
  };

  useEffect(() => {
    updateLastSaved();
  }, [i18n.language])

  useEffect(() => {
    if (autoSave.current) {
      clearTimeout(autoSave.current);
    }
    autoSave.current = setTimeout(autoSaveDraft, 5000);
  }, [state]);

  useEffect(() => {
    dispatch({ type: 'edit' })
  }, []);

  const toggleViewMode = () => {
    editState.editable 
      ? dispatch({ type: 'view' })
      : dispatch({ type: 'edit' })
  };

  const publishRecipe = async () => {
    const { images, ingredients, steps, ...rest } = state;
    // console.log('unsetting draft');
    // userState.user.get(`draftRecipes/${id}`).unset(state);
    // console.log('adding to recipes')
    // Gun.get('recipes').set(rest);
    // Gun.get(`recipes/${publishedRecipe.id}`).get('author').put(userState.user);
    // console.log('adding recipe to published')

    userState.user.get('publishedRecipes').set(userState.user.get(`draftRecipes/${id}`));
    userState.user.get('publishedRecipes').on(data => {
      console.log('published', data)
    })
  };

  const changeName = event => {
    updateRecipe({ type: 'name', value: event.target.value });
  };

  const changeDescription = event => {
    updateRecipe({ type: 'description', value: event.target.value });
  };

  const addImages = files => {
    const newImages = [...images, ...Array.from(files)];
    updateRecipe({ type: 'images', value: newImages });
  };

  const updateImages = images => {
    updateRecipe({ type: 'images', value: images });
  };

  const changeTime = event => {
    updateRecipe({ type: 'time', value: event.target.value });
  };

  const renderLastSaved = () => lastSaved && lastSavedText && (
    <div className="createRecipe__lastSaved">
      {t('Recipe:LastSaved')} {lastSavedText}
    </div>
  );

  return (
    <div className="createRecipe recipe">
      {renderLastSaved()}

      <FullWidthContainer spaceBetween>
        <button 
          className="createRecipe__toggleModeBtn"
          onClick={toggleViewMode}
        >
          {editState.editable 
            ? t('Recipe:View') 
            : t('Recipe:Edit')}
        </button>

        {state.draft && (
          <button 
            className="createRecipe__publish"
            onClick={publishRecipe}
          >
            {t('Recipe:Publish')}
          </button>
        )}
      </FullWidthContainer>

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

      <FullWidthContainer 
        center={!editState.editable} 
        spaceBetween={editState.editable}
      >
        <IngredientList />
        <StepList />
      </FullWidthContainer>
    </div>
  )
}

export default CreateRecipe;
