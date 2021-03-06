import React, { useState, useContext } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { useTranslation } from 'react-i18next';

import { getRequest } from 'utils/request';
import { RecipeContext } from 'contexts/recipe';
import { UserContext } from 'contexts/user';
import Loader from 'components/core/Loader';

export default function UrlInput({ onRecipeFetch }) {
  const { state: user } = useContext(UserContext);
  const [showInput, setShowInput] = useState(false);
  const [url, setUrl] = useState('');
  const { t } = useTranslation();
  const { dispatch: setRecipe } = useContext(RecipeContext);
  const [showLoader, setShowLoader] = useState(false);

  const getRecipeFromUrl = async () => {
    setShowLoader(true);
    const { recipe, originalAuthorUser } = await getRequest(`parse`, { url, userId: user.id });
    setShowLoader(false);
    setRecipe({ type: 'recipe', value: recipe, authorUser: user, originalAuthorUser });
    if (onRecipeFetch) {
      onRecipeFetch();
    }
  };

  return (
    <div className="createRecipe__fromUrl flex grow sideSpacing--extra">
      <AnimatePresence initial={false}>
        {showLoader ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex grow center"
          >
            <Loader />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex grow"
          >
            {showInput ? (
              <>
                <input
                  className="sideSpacing--normal flex grow  margin--right"
                  value={url}
                  onChange={event => setUrl(event.target.value)}
                  placeholder={t('Recipe:Url')}
                />
                <button onClick={getRecipeFromUrl}>{t('Recipe:Import')}</button>
              </>
            ) : (
              <button onClick={() => setShowInput(!showInput)}>
                {t('Recipe:ImportFromUrl')}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
