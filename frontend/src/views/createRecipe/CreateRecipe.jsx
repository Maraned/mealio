import 'views/recipe/recipe.css';
import './createRecipe.css';

import React, { useContext, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegClock, FaStar } from 'react-icons/fa';
import cc from 'classcat';
import { motion, AnimatePresence } from 'framer-motion';

import { EditableContext } from 'contexts/editable';
import { RecipeContext } from 'contexts/recipe';
import { UserContext } from 'contexts/user';
import { AlertBannerContext } from 'contexts/alertBanner';
import Loader from 'components/core/Loader';

import {
  GetRecipeNameFromDraftEditorContent,
  ShowResponseErrorToast,
  ShowSuccessToast,
} from 'utils/utils';

import IngredientListWrapper from 'components/ingredientList/IngredientListWrapper';
import StepList from 'components/stepList/StepList';
import EditableField from 'components/core/EditableField/EditableField';
import FullWidthContainer from 'components/core/FullWidthContainer';
import ImageUpload from 'components/core/imageUpload/ImageUpload';
import Author from 'components/core/Author';

import { postRequest, deleteRequest, imageUrl } from 'utils/request';
import UrlInput from './UrlInput';

const CreateRecipe = React.memo(({ publishedMode, onPublish }) => {
  const { t, i18n } = useTranslation();
  // CONTEXTS
  const { state: user, dispatch: userDispatch } = useContext(UserContext);
  const { dispatch, state: editState } = useContext(EditableContext);

  const { state: recipe, dispatch: updateRecipe } = useContext(RecipeContext);
  const { dispatch: alertBannerDispatch } = useContext(AlertBannerContext);

  const [pendingPublish, setPendingAction] = useState(false);

  const getLastSavedText = date => {
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
    return date.toLocaleDateString(locale, options);
  }

  // STATES
  const [lastSavedText, setLastSavedText] = useState(() => {
    return getLastSavedText(new Date(lastUpdate));
  });
  const [changed, setChanged] = useState(false);

  const updateLastSaved = date => {
    setLastSavedText(getLastSavedText(date));
  };

  // USE EFFECTS
  useEffect(() => {
    if (mounted.current) {
      setChanged(true);
    }
  }, [ingredients]);

  useEffect(() => {
    updateLastSaved(new Date(lastUpdate));
    // eslint-disable-next-line
  }, [i18n.language, lastUpdate]);

  useEffect(() => {
    if (changed) {
      if (recipe.draft == null) {
        onRecipeChange('draft', true);
      }
    }
    // eslint-disable-next-line
  }, [changed]);

  useEffect(() => {
    if (!publishedMode) {
      dispatch({ type: 'edit' });
    }
    mounted.current = true;
    // eslint-disable-next-line
  }, []);

  const mounted = useRef(false);


  if (!recipe) {
    updateRecipe({ type: 'reset', value: {} });
    return '';
  }

  const {
    id,
    name,
    description,
    images,
    time,
    ingredients,
    lastUpdate,
    origin,
    originUrl,
    author,
    authorUser,
    originalAuthorUser,
  } = recipe;

  const primaryImage = images && images.length && images[0];
  const primaryImageUrl = imageUrl(primaryImage);


  const onRecipeChange = (type, value) => {
    const author = value.author || user.id;

    updateRecipe({ type, value, author });
  }

  const toggleViewMode = () => {
    editState.editable
      ? dispatch({ type: 'view' })
      : dispatch({ type: 'edit' })
  };

  const deleteRecipe = async () => {
    setPendingAction(true);
    const response = await deleteRequest('recipes', {
      type: recipe.draft ? 'draftRecipes' : 'publishedRecipes',
      recipeId: recipe.id,
      id: user.id,
    }, false);

    if (response.statusCode !== 200) {
      setPendingAction(false);
      ShowResponseErrorToast(t, alertBannerDispatch, response, 'Recipe:DeleteFailed');
    } else {
      ShowSuccessToast(t, alertBannerDispatch, 'Recipe:DeleteSuccess')
    }
  };

  const publishRecipe = async () => {
    setPendingAction(true);
    const response = await postRequest('recipes/publish', {
      id: user.id,
      recipe: {
        ...recipe,
        name: GetRecipeNameFromDraftEditorContent(recipe.name),
        draft: false
      },
    }, false);

    if (response.statusCode !== 200) {
      setPendingAction(false);
      ShowResponseErrorToast(t, alertBannerDispatch, response, 'Recipe:PublishFailed');
    } else {
      if (recipe.draft) {
        if (onPublish) {
          onPublish(recipe.id);
        }
        ShowSuccessToast(t, alertBannerDispatch, 'Recipe:PublishSuccess')
      }
    }
  };

  const editRecipe = async () => {
    await postRequest('recipes/createUpdate', {
      id: user.id,
      recipe: { ...recipe, draft: false },
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

  const renderLastSaved = () => lastSavedText && (
    <div className="createRecipe__lastSaved margin--bottom">
      {t('Recipe:LastSaved')} {lastSavedText}
    </div>
  );

  const renderActionbar = () => (
    <FullWidthContainer spaceBetween className="margin--bottom--large">
      <div className="flex spaceBetween fullWidth wrap nowrapMedium">
        <button
          className="createRecipe__toggleModeBtn margin--right"
          onClick={toggleViewMode}
        >
          {editState.editable ? t('Recipe:View') : t('Recipe:Edit')}
        </button>

        <UrlInput onRecipeFetch={() => {}} />

        <AnimatePresence initial={false}>
          {pendingPublish ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex grow center"
            >
              <Loader />
            </motion.div>
          ) : (
            <>
              {recipe.draft && recipe.id && (
                <button
                  className="createRecipe__publish"
                  onClick={publishRecipe}
                >
                  {t('Recipe:Publish')}
                </button>
              )}

              {recipe.draft != null && !recipe.draft && (
                <button
                  className="createRecipe__update"
                  onClick={editRecipe}
                >
                  {t('Recipe:Update')}
                </button>
              )}

              <button
                className="createRecipe__delete remove"
                onClick={deleteRecipe}
              >
                {t('Recipe:Delete')}
              </button>
            </>
          )}
        </AnimatePresence>
      </div>

    </FullWidthContainer>
  );

  const renderBottomRow = () => (
    <>
      <div className="recipe__time margin--right">
        <FaRegClock />
        <EditableField
          onChange={changeTime}
          value={time}
          placeholder={t('Recipe:Time')}
          hideIfEmpty
        />
      </div>

      {author && (
        <Author authorUser={authorUser} originalAuthorUser={originalAuthorUser} origin={origin} originUrl={originUrl} />
      )}
    </>
  );

  const renderSaveRecipe = () => (
    <div className="margin--bottom">
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
  );

  return (
    <div className={cc(['createRecipe', 'recipe', {
      'createRecipe--editMode': editState.editable
    }])}>

      <div className="background box">
        {renderLastSaved()}

        {renderActionbar()}

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
              <img className="recipe__image image--rounded" src={primaryImageUrl} alt="" />
            )}
          </div>

          <div className="flex column vcenter vMediumLeft grow">
            <EditableField
              onChange={changeName}
              value={name}
              className="recipe__name margin--bottom"
              placeholder={t('Recipe:Name')}
              titleField
              type="text"
              textTag="h1"
            />

            {publishedMode && renderSaveRecipe()}

            <EditableField
              onChange={changeDescription}
              value={description}
              className="recipe__description margin--bottom"
              placeholder={t('Recipe:Description')}
              type="text"
            />

            {renderBottomRow()}
          </div>
        </div>
      </div>

      <FullWidthContainer
        center={!editState.editable}
        spaceBetween={editState.editable}
        wrapOnlyMobile
      >
        <IngredientListWrapper />
        <StepList />
      </FullWidthContainer>
    </div>
  );
});

export default CreateRecipe;
