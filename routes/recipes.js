const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const fs = require('fs');

const rdb = require('../lib/rethink');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const handleImage = async (image, id) => {
  if (image.indexOf(';base64') !== -1) {
    try {
      const imageId = uuidv4();
      const uri = image.split(';base64,').pop();
      let imgBuffer =  Buffer.from(uri, 'base64');
      const folderPath = `images/${id}`;
      const imagePath = `${folderPath}/${imageId}.webp`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      await sharp(imgBuffer)
        .resize(600)
        .webp({ lossless: true })
        .toFile(imagePath);

      return `${id}/${imageId}.webp`;
    } catch (error) {
      console.error('Sharp error: ', error);
    }
  } else {
    return image;
  }
}

const getImages = async (images, id) => {
  const promises = [];

  for (let i = 0; i < images.length; i++) {
    promises.push(handleImage(images[i], id))
  }

  const handledImages = await Promise.all(promises);
  return handledImages;
}

const removeImages = async (images, id) => {
  for (const image of images) {
    const imagePath = `images/${image}`;
    fs.unlinkSync(imagePath);
  }
}

router.get('/', async (req, res, next) => {
  const response = await rdb.findAll('publishedRecipes');
  res.status(200);
  return res.send(response);
});

router.post('/createUpdate', async (req, res, next) => {
  const { recipe, id } = req.body;

  if (recipe && id) {
    if (recipe.id) {
      const images = await getImages(recipe.images, id);
      await rdb.edit('draftRecipes', recipe.id, { ...recipe, images });
      res.status(200);
      return res.send({ status: 'updated', recipe: { ...recipe, images }});
    } else {
      const images = await getImages(recipe.images, id);
      const response = await rdb.save('draftRecipes', { ...recipe, images });
      const draftId = response.generated_keys[0];
      await rdb.addToArray('users', id, 'draftRecipes', draftId);

      res.status(200);
      return res.send({ draftId, status: 'created', recipe: { ...recipe, images } });
    }
  }
  return res.sendStatus(400);
});

router.post('/publish', async (req, res, next) => {
  const { recipe, id } = req.body;

  if (recipe && id) {
    await rdb.save('publishedRecipes', recipe);

    try {
      await rdb.addToArray('users', id, 'publishedRecipes', recipe.id);
      await rdb.destroy('draftRecipes', recipe.id);
      await rdb.removeFromArray('users', id, 'draftRecipes', recipe.id);
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
  return res.sendStatus(400);
});

router.post('/delete', async (req, res, next) => {
  const { id, type, recipeId } = req.body;

  if (recipeId && id && type) {
    try {
      const recipeImages = await rdb.getRecipeImages(type, recipeId);
      await removeImages(recipeImages, id);
      await rdb.removeFromArray('users', id, type, recipeId);
      await rdb.destroy(type, recipeId);
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
  return res.sendStatus(400);

})

module.exports = router;
