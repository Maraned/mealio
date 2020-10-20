const express = require('express');
const router = express.Router();
const fs = require('fs');

const rdb = require('../lib/rethink');
const logger = require('../utils/logger');
const { create } = require('domain');
const { createOrUpdateRecipe, publishRecipe } = require('./recipesUtils');

const removeImages = async (images, id) => {
  for (const image of images) {
    const imagePath = `images/${image}`;
    fs.unlinkSync(imagePath);
  }
}

router.get('/', async (req, res, next) => {
  try {
    const response = await rdb.findAll('publishedRecipes');
    res.status(200);
    return res.send(response);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.get('/url/:url', async (req, res, next) => {
  try {
    const recipes = await rdb.findBy('publishedRecipes', 'url', req.params.url);
    res.status(200);
    return res.send(recipes[0]);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.post('/createUpdate', async (req, res, next) => {
  try {
    const { recipe, id } = req.body;
    const { createdOrUpdated, dataToSendBack } = await createOrUpdateRecipe(recipe, id);
    if (createdOrUpdated) {
      res.status(200);
      return res.send(dataToSendBack);
    }
    return res.sendStatus(400);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.post('/publish', async (req, res, next) => {
  const { recipe, id } = req.body;

  const { published, error } = await publishRecipe(recipe, id);
  if (published) {
    return res.sendStatus(200);
  }
  return res.sendStatus(400);
});

router.delete('/', async (req, res, next) => {
  const { id, type, recipeId } = req.body;

  if (recipeId && id && type) {
    try {
      const recipeImages = await rdb.getRecipeImages(type, recipeId);
      const recipeImageFiles = recipeImages.filter(image => !image.startsWith('http'));

      if (recipeImageFiles.length) {
        await removeImages(recipeImageFiles, id);
      }
      await rdb.removeFromArray('users', id, type, recipeId);
      await rdb.destroy(type, recipeId);
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  }
  return res.sendStatus(400);
});

router.post('/saveToCollection', async (req, res) => {
  const { id, userId } = req.body;

  if (id && userId) {
    try {
      const addToArrayResponse = await rdb.addToArray('users', userId, 'recipeCollection', id);

      if (!addToArrayResponse.unchanged) {
        try {
          const collectionCountResponse = await rdb.increment('publishedRecipes', id, 'collectionCount');
        } catch (error) {
          logger('POST /saveToCollection increment recipe collectionCount', {
            id
          }, error);
        }

        const userResponse = await rdb.find('users', userId);
        return res.send(userResponse);
      }
    } catch (error) {
      logger('POST /saveToCollection addToRecipeCollection', { userId, id }, error);
    }
  } else {
    logger('POST /saveToCollection', { id, userId }, 'No id or userId provided');
    return res.sendStatus(400);
  }
});

router.post('/removeFromCollection', async (req, res) => {
  const { id, userId } = req.body;

  if (id && userId) {
    try {
      const removeFromArrayResponse = await rdb.removeFromArray('users', userId, 'recipeCollection', id);

      if (!removeFromArrayResponse.unchanged) {
        try {
          const collectionCountResponse = await rdb.decrement('publishedRecipes', id, 'collectionCount');
        } catch (error) {
          logger('POST /saveToCollection increment recipe collectionCount', {
            id
          }, error);
        }

        const userResponse = await rdb.find('users', userId);
        return res.send(userResponse);
      }
    } catch (error) {
      logger('POST /saveToCollection addToRecipeCollection', { userId, id }, error);
    }
  } else {
    logger('POST /saveToCollection', { id, userId }, 'No id or userId provided');
    return res.sendStatus(400);
  }
});

module.exports = router;
