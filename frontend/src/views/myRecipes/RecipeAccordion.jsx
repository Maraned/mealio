import './recipeAccordion.css';

import React, { useState, useEffect } from 'react';
// import posed from 'react-pose';
import CreateRecipeView from 'views/createRecipe/CreateRecipeView';
import cc from 'classcat';
import { motion, AnimatePresence } from 'framer-motion';

import { useTranslation } from 'react-i18next';

// const Content = posed.div({
//   enter: {
//     y: 0,
//     height: 'auto'
//   },
//   exit: {
//     y: "-100%",
//     height: '0px'
//   }
// })

const RecipeAccordion = ({ recipe }) => {
  const [open, setOpen] = useState(false);
  const [delayedOpen, setDelayedOpen] = useState(false);
  const { t } = useTranslation();

  // // This delay is to allow the conditional rendering to work with the pose animation
  // useEffect(() => {
  //   setTimeout(() => setDelayedOpen(open), 300);
  // }, [open]);

  // const useDelay = !open ? delayedOpen : open;

  return (
      <div
        className={cc(['recipeAccordion', {
          boxShadow: !open
        }])}
        key={recipe.id}
      >
        <motion.header
          // layout
          onClick={() => setOpen(!open)}
          initial={false}
        >
          <div
            className={cc(['recipeAccordion__header', {
              'recipeAccordion__header--draft': recipe.draft
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
              // layout
              // initial={{ opacity: 0, y: '-20px'}}
              // animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, y: '-20px' }}
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="recipeAccordion__content"
            >
              <CreateRecipeView recipe={recipe} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
  );
};

export default RecipeAccordion;
