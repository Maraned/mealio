import React, { useState, useContext } from 'react';
import posed, { PoseGroup } from 'react-pose';
import { useTranslation } from 'react-i18next';

import { getRequest } from 'utils/request';
import { RecipeContext } from 'contexts/recipe';
import Loader from 'components/core/Loader';

import { FadeIn } from 'utils/animations';

export default function UrlInput() {
  const [showInput, setShowInput] = useState(false);
  const [url, setUrl] = useState('');
  const { t } = useTranslation();
  const { dispatch: setRecipe } = useContext(RecipeContext);
  const [showLoader, setShowLoader] = useState(false);
  
  const getRecipeFromUrl = async () => {
    setShowLoader(true);
    const recipe = await getRequest(`parse`, { url });
    setShowLoader(false);
    console.log('getRecipeFromUrl', recipe)
    setRecipe({ type: 'recipe', value: recipe });
  };

  return (
    <div className="createRecipe__fromUrl flex grow sideSpacing--extra">
      <PoseGroup>
        {showLoader ? (
          <FadeIn key="recipe-url-loader" className="flex grow center">
            <Loader />
          </FadeIn>
        ) : (
          <FadeIn key="recipe-url-input" className="flex grow">
            {showInput ? (
              <>
                <input 
                  className="sideSpacing--normal flex grow  margin--right"
                  value={url} 
                  onChange={event => setUrl(event.target.value)} 
                  placeholder={t('Recipe:Url')} 
                />
                <button onClick={getRecipeFromUrl}>{t('Recipe:Create')}</button>
              </>
            ) : (
              <button onClick={() => setShowInput(!showInput)}>
                {t('Recipe:CreateFromUrl')}
              </button>
            )}
        </FadeIn>
        )}
      </PoseGroup>
    </div>
  );
};
