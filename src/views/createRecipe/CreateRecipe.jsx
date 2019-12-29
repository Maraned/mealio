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

import { postRequest, deleteRequest, imageUrl } from 'utils/request';

const CreateRecipe = () => {
  // CONTEXTS
  const { state: user } = useContext(UserContext);
  const { dispatch, state: editState } = useContext(EditableContext);
  const { state, dispatch: updateRecipe } = useContext(RecipeContext);
  const { dispatch: alertBannerDispatch } = useContext(AlertBannerContext);
  const mounted = useRef(false);

  const { t, i18n } = useTranslation();
  const { name, description, images, time, id, ingredients, lastUpdate } = state;

  const primaryImage = images && images.length && images[0];
  const primaryImageUrl = imageUrl(primaryImage);

  // STATES
  const [lastSavedText, setLastSavedText] = useState('');
  const [changed, setChanged] = useState(false);

  const onRecipeChange = (type, value) => {
    const author = {
      id: user.id,
      name: user.displayName
    };

    updateRecipe({ type, value, author });
  }

  useEffect(() => {
    if (mounted.current) {
      setChanged(true);
    }
  }, [ingredients]);

  console.log('render state', state)

  const updateLastSaved = date => {
    console.log('date', date, date instanceof Date, isNaN(date))
    if (!date || (date instanceof Date && isNaN(date))) {
      return;
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

  useEffect(() => {
    updateLastSaved(new Date(lastUpdate));
  }, [i18n.language, lastUpdate]);

  useEffect(() => {
    if (changed) {
      if (state.draft == null) {
        onRecipeChange('draft', true);
      } 
    }
  }, [changed]);

  useEffect(() => {
    dispatch({ type: 'edit' });
    mounted.current = true;
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
  };

  const publishRecipe = async () => {
    const response = await postRequest('recipes/publish', {
      id: user.id,
      recipe: { ...state, draft: false },
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
      }
    }
  };

  const editRecipe = async () => {
    await postRequest('recipes/createUpdate', {
      id: user.id,
      recipe: { ...state, draft: false },
    }, false);
  };
  
  const changeName = value => {
    onRecipeChange('name', value);
    setChanged(true);
  };

  const changeDescription = value => {
    onRecipeChange('description', value);
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
    onRecipeChange('images', newImages);
    setChanged(true);
  };

  const addImageUrl = async imageUrl => {
    const newImages = [...images, imageUrl];
    onRecipeChange('images', newImages);
    setChanged(true);
  }

  const changeTime = event => {
    onRecipeChange('time', event.target.value);
    setChanged(true);
  };

  const renderLastSaved = () => lastSavedText && (
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
                  className="recipe__imageUpload image--rounded" 
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
