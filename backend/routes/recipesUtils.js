/* eslint-disable linebreak-style */
const rdb = require('../lib/rethink');
const sharp = require('sharp');
const fs = require('fs');

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
      const imgBuffer = Buffer.from(uri, 'base64');
      const folderPath = `images/${id}`;
      const imagePath = `${folderPath}/${imageId}.webp`;
      if (!fs.existsSync(folderPath)) {
        await fs.mkdirSync(folderPath);
      }
      await sharp(imgBuffer)
        .resize(350)
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
};

const transformRecipeNameToUrl = name => {
  if (!name) {
    return name;
  }

  const transformedName = name
    .toLowerCase()
    .replace(/å|ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s/g, '-');
  return transformedName;
}

const createOrUpdateRecipe = async (recipe, id) => {
  if (recipe && id) {
    if (recipe.id) {
      const images = await getImages(recipe.images, id);
      await rdb.edit('draftRecipes', recipe.id, { ...recipe, images });
      return {
        createdOrUpdated: true,
        dataToSendBack: { status: 'updated', recipe: { ...recipe, images }}
      };
    }
    const images = await getImages(recipe.images, id);
    const lastUpdate = new Date();
    recipe.lastUpdate = lastUpdate;

    if (recipe.name && !recipe.url) {
      recipe.url = transformRecipeNameToUrl(recipe.name);
    }

    const response = await rdb.save('draftRecipes', { ...recipe, images });
    const draftId = response.generated_keys[0];
    recipe.id = draftId;
    await rdb.addToArray('users', id, 'draftRecipes', draftId);
    return {
      createdOrUpdated: true,
      dataToSendBack: { draftId, status: 'created', recipe: { ...recipe, images } }
    };
  }
};

const publishRecipe = async (recipe, id) => {
  if (recipe && id) {
    try {
      const existingRecipeWithName = await rdb.findBy(
        'publishedRecipes',
        'url',
        recipe.url
      );

      if (existingRecipeWithName.length) {
        return { error: { status: 'error', message: 'Recipe:RecipeWithNameExists'} };
      }

      await rdb.save('publishedRecipes', {
        ...recipe,
        collectionCount: 0,
        publishedDate: new Date(),
      });
      await rdb.addToArray('users', id, 'publishedRecipes', recipe.id);
      await rdb.destroy('draftRecipes', recipe.id);
      await rdb.removeFromArray('users', id, 'draftRecipes', recipe.id);
      return { published: true };
    } catch (error) {
      console.error(error);
      return { error: error && error.toString() };
    }
  }
};

module.exports = {
  createOrUpdateRecipe,
  getImages,
  publishRecipe,
};

