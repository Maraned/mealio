import React, { useState, useContext } from 'react';
import { getRequest } from 'utils/request';
import { useTranslation } from 'react-i18next';
import { RecipeContext } from 'contexts/recipe';

export default function UrlInput() {
  const [showInput, setShowInput] = useState(false);
  const [url, setUrl] = useState('');
  const { t } = useTranslation();
  const { dispatch: setRecipe } = useContext(RecipeContext);
  
  const getRecipeFromUrl = async () => {
    const recipe = await getRequest(`parse`, { url });
    console.log('getRecipeFromUrl', recipe)
    setRecipe({ type: 'recipe', value: recipe });
  };

  return (
    <div className="createRecipe__fromUrl flex grow sideSpacing--extra">
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
    </div>
  );
};
