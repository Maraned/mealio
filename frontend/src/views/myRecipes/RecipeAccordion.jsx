import './recipeAccordion.css';

import React, { useState, useEffect } from 'react';
// import posed from 'react-pose';
import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import cc from 'classcat';
import { motion, AnimatePresence } from 'framer-motion';

import { useTranslation } from 'react-i18next';

const RecipeAccordion = React.memo(({ recipe, defaultOpenState, onPublish }) => {
  const [open, setOpen] = useState(() => defaultOpenState || false);
  useEffect(() => setOpen(defaultOpenState), [defaultOpenState])
  const { t } = useTranslation();

  return (
    <div
      className="recipeAccordion"
      key={recipe.id}
    >
      <motion.header
        onClick={() => setOpen(!open)}
        initial={false}
      >
        <div
          className={cc(['recipeAccordion__header boxShadow', {
            'recipeAccordion__header--draft': recipe.draft,
          }])}
        >
          <label className="recipeAccordion__recipeStatus">
            {recipe.draft ? t('Recipe:Draft') : t('Recipe:Published')}
          </label>
          {recipe.name}
        </div>
      </motion.header>

      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            key={`content-${recipe.id}`}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{
              duration: 0.8,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
            className="recipeAccordion__content"
          >
            <CreateRecipeView recipe={recipe} onPublish={onPublish} />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
});

export default RecipeAccordion;
