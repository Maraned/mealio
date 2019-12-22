import './createRecipe.css';
import 'views/recipe/recipe.css';

import React, { useContext, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegClock } from 'react-icons/fa';
import cc from 'classcat';

import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';
import { UserContext } from 'contexts/user';
import { AlertBannerContext } from 'contexts/alertBanner';

import IngredientList from 'components/ingredientList/IngredientList';
import StepList from 'components/stepList/StepList';
import EditableField from 'components/core/EditableField';
import FullWidthContainer from 'components/core/FullWidthContainer';
import ImageUpload from 'components/core/imageUpload/ImageUpload';

import FetchMyRecipes from 'utils/fetchMyRecipes';
import { postRequest, deleteRequest, imageUrl } from 'utils/request';

const CreateRecipe = () => {
  // CONTEXTS
  const { state: user } = useContext(UserContext);
  const { dispatch, state: editState } = useContext(EditableContext);
  const { state, dispatch: updateRecipe } = useContext(RecipeContext);
  const { dispatch: alertBannerDispatch } = useContext(AlertBannerContext);

  const { t, i18n } = useTranslation();
  const { name, description, images, time, id } = state;

  const primaryImage = images && images.length && images[0];
  const primaryImageUrl = imageUrl(primaryImage);

  // STATES
  const autoSave = useRef(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [lastSavedText, setLastSavedText] = useState('');
  const [changed, setChanged] = useState(false);

  const {
    getDraftRecipes,
    getPublishedRecipes
  } = FetchMyRecipes();

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

  const autoSaveDraft = async () => {
    const newSavedDate = new Date();
    setLastSaved(newSavedDate);
    updateLastSaved(newSavedDate);
    setChanged(false);

    const response = await postRequest('recipes/createUpdate', {
      recipe: { ...state, draft: true },
      id: user.id,
    });

    const { status, draftId, recipe } = response;
    if (status === 'created') {
      updateRecipe({ type: 'id', value: draftId });      
    }

    getDraftRecipes(user.id);
    getPublishedRecipes(user.id);

    updateRecipe({ type: 'recipe', value: recipe });
  };

  const resetAutoSaveTimeout = () => {
    if (autoSave.current) {
      clearTimeout(autoSave.current);
    }
    autoSave.current = setTimeout(autoSaveDraft, 5000);
  };

  useEffect(() => {
    updateLastSaved();
  }, [i18n.language]);

  useEffect(() => {
    if (changed) {
      resetAutoSaveTimeout();
    }
  }, [changed, state])

  useEffect(() => {
    if (changed) {
      if (state.draft == null) {
        updateRecipe({ type: 'draft', value: true });
      } 
    }
  }, [changed]);

  useEffect(() => {
    dispatch({ type: 'edit' })
  }, []);

  const toggleViewMode = () => {
    editState.editable 
      ? dispatch({ type: 'view' })
      : dispatch({ type: 'edit' })
  };

  const deleteRecipe = async () => {
    const responseStatus = await deleteRequest('recipes', {
      type: state.draft ? 'draftRecipes' : 'publishedRecipes',
      recipeId: state.id,
      id: user.id,
    }, false);

    if (state.draft) {
      getDraftRecipes(user.id);
    } else {
      getPublishedRecipes(user.id);
    }
    if (responseStatus === 200) {
      updateRecipe({ type: 'reset' });
    }
  };

  const publishRecipe = async () => {
    const response = await postRequest('recipes/publish', {
      id: user.id,
      recipe: { ...state, draft: false, author: {
        id: user.id,
        name: user.displayName
      } },
    }, false);

    if (!isNaN(response) && response !== 200) {
      alertBannerDispatch({ type: 'add', value: { 
        text: t('Recipe:FailedToPublish'), 
        type: 'error', 
      } });
    } else {
      if (state.draft) {
        alertBannerDispatch({ type: 'add', value: { 
          text: t('Recipe:PublishSuccess'), 
          type: 'success', 
        } });
        updateRecipe({ type: 'draft', value: false });
        getDraftRecipes(user.id);
        getPublishedRecipes(user.id);
      }
    }
  };

  const editRecipe = async () => {
    await postRequest('recipes/createUpdate', {
      id: user.id,
      recipe: { ...state, draft: false },
    }, false);
  };
  
  const changeName = event => {
    updateRecipe({ type: 'name', value: event.target.value });
    resetAutoSaveTimeout();
    setChanged(true);
  };

  const changeDescription = event => {
    updateRecipe({ type: 'description', value: event.target.value });
    resetAutoSaveTimeout();
    setChanged(true);
  };

  const readImage = image => {
    let reader = new FileReader();
    return new Promise(resolve => {
      reader.addEventListener('load', () => {
        const source = reader.result;
        resolve(source)
      });
      reader.readAsDataURL(image);
    })
  }

  const addImages = async files => {
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      promises.push(readImage(files[i]))
    }

    const uploadedImages = await Promise.all(promises);

    const newImages = [...images, ...uploadedImages];
    updateRecipe({ type: 'images', value: newImages });
    resetAutoSaveTimeout();
    setChanged(true);
  };

  const addImageUrl = async imageUrl => {
    const newImages = [...images, imageUrl];
    updateRecipe({ type: 'images', value: newImages });
    resetAutoSaveTimeout();
    setChanged(true);
  }

  const updateImages = images => {
    updateRecipe({ type: 'images', value: images });
    resetAutoSaveTimeout();
    setChanged(true);
  };

  const changeTime = event => {
    updateRecipe({ type: 'time', value: event.target.value });
    resetAutoSaveTimeout();    
    setChanged(true);
  };

  const renderLastSaved = () => lastSaved && lastSavedText && (
    <div className="createRecipe__lastSaved margin--bottom">
      {t('Recipe:LastSaved')} {lastSavedText}
    </div>
  );

  return (
    <div className={cc(['createRecipe', 'recipe', {
      'createRecipe--editMode': editState.editable
    }])}>

      <div className="background box">
        {renderLastSaved()}

        <FullWidthContainer spaceBetween className="margin--bottom--large">
          <div className="flex">
            <button 
              className="createRecipe__toggleModeBtn margin--right"
              onClick={toggleViewMode}
            >
              {editState.editable 
                ? t('Recipe:View') 
                : t('Recipe:Edit')}
            </button>
            
            {state.draft && state.id && (
              <button 
                className="createRecipe__publish"
                onClick={publishRecipe}
              >
                {t('Recipe:Publish')}
              </button>
            )}

            {state.draft != null && !state.draft && (
              <button 
                className="createRecipe__update"
                onClick={editRecipe}
              >
                {t('Recipe:Update')}
              </button>
            )}
          </div>

          <button
            className="createRecipe__delete remove"
            onClick={deleteRecipe}
          >
            {t('Recipe:Delete')}
          </button>

        </FullWidthContainer>

        <div className="flex wrap nowrapMedium">
          <div className="fullWidth autoWidthMedium center">
            {editState.editable && (
              <>
                <ImageUpload 
                  onDrop={addImages} 
                  onUrl={addImageUrl}
                  className="recipe__imageUpload" 
                  id="createRecipe"
                  uploadedImage={primaryImageUrl}
                  size={300}
                />
              </>
            )}

            {!editState.editable && !!primaryImageUrl && (
              <img className="recipe__image image--rounded" src={primaryImageUrl} /> 
            )}
          </div>

          <div className="flex column vcenter vMediumLeft">
            <EditableField 
              onChange={changeName} 
              value={name}
              className="recipe__name margin--bottom" 
              placeholder={t('Recipe.Name')}
              titleField
            />

            <EditableField 
              onChange={changeDescription} 
              value={description}
              className="recipe__description margin--bottom" 
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
          </div>
        </div>
      </div>

      <FullWidthContainer 
        center={!editState.editable} 
        spaceBetween={editState.editable}
      >
        <IngredientList />
        <StepList />
      </FullWidthContainer>
    </div>
  );
}

export default CreateRecipe;
