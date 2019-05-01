import React, { useContext, useState, useEffect, useRef } from 'react';

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

import FetchMyRecipes from 'utils/fetchMyRecipes';

import { postRequest, deleteRequest } from 'utils/request';

import 'views/recipe/recipe.css';

import { useTranslation } from 'react-i18next';
import { FaRegClock } from 'react-icons/fa';

import './createRecipe.css';

const CreateRecipe = () => {
  const { state: user } = useContext(UserContext);
  const { dispatch, state: editState } = useContext(EditableContext);
  const { state, dispatch: updateRecipe } = useContext(RecipeContext);
  const { t, i18n } = useTranslation();
  const { name, description, images, time, id } = state;
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
    if (state.draft) {
      updateRecipe({ type: 'draft', value: false });
    }
    await postRequest('recipes/publish', {
      id: user.id,
      recipe: { ...state, draft: false, author: {
        id: user.id,
        name: user.displayName
      } },
    }, false);
    getDraftRecipes(user.id);
    getPublishedRecipes(user.id);
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

        <div>
          {state.draft && (
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

          <button
            className="createRecipe__delete"
            onClick={deleteRecipe}
          >
            {t('Recipe:Delete')}
          </button>
        </div>

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

        {!editState.editable && images && (
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
  );
}

export default CreateRecipe;
