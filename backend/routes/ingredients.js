var express = require('express');
var router = express.Router();

var rdb = require('../lib/rethink');

const replaceIngredientInRecipes = async (
  ingredientId,
  replacementIngredient,
  recipeType,
) => {
  const lookupFunc = recipeType === 'draftRecipes'
    ? rdb.getDraftRecipesWithIngredient
    : rdb.getPublishedRecipesWithIngredient;

  const recipes = await lookupFunc(ingredientId);
  for (const recipe of recipes) {
    let updatedIngredientGroups = recipe.ingredientGroups;
    const updatedIngredientIds = recipe.ingredientIds.filter((id) => id !== ingredientId);
    if (replacementIngredient) {
      recipe.ingredientIds.push(replacementIngredient.id);
    }
    updatedIngredientGroups = recipe.ingredientGroups.map((ingredientGroup) => {
      const existingIngredient = ingredientGroup.ingredients.find((ingredient) => {
        return ingredient.id === ingredientId;
      });
      if (!existingIngredient) {
        return ingredientGroup;
      }
      const ingredientIndex = ingredientGroup.ingredients.findIndex((ingredient) => {
        return ingredient.id === ingredientId;
      });
      ingredientGroup.ingredients[ingredientIndex] = {
        ...replacementIngredient,
        amount: existingIngredient.amount,
        unit: existingIngredient.unit,
      };
      return ingredientGroup;
    });

    await rdb.edit(recipeType, recipe.id, {
      ingredientGroups: updatedIngredientGroups,
      ingredientIds: updatedIngredientIds
    });
  }
}

router.get('/', async (req, res) => {
  try {
    const ingredients = await rdb.findAll('ingredients');
    res.status(200);
    return res.send(ingredients);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, group, userId, alternatives } = req.body;

    const user = await rdb.find('users', userId);
    const status = user.isAdmin ? 'active' : 'pending';
    const response = await rdb.save('ingredients', { name, group, status, alternatives });
    const ingredientId = response.generated_keys[0];
    res.status(201);
    return res.send(ingredientId);
  } catch (error) {
    console.error('/ingredients', error);
    return res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log('updated')
    const { id } = req.params;
    const updatedAttributes = req.body;
    await rdb.edit('ingredients', id, updatedAttributes);
    return res.sendStatus(200);
  } catch (error) {
    console.error('/ingredients', error);
    return res.sendStatus(500);
  }
});

const removeIngredient = async (id, replacementId) => {
  try {
    if (!id || !replacementId) {
      return;
      // TODO: Add error message so frontend knows what went wrong
    }

    const replacementIngredient = await rdb.find('ingredients', replacementId);
    await replaceIngredientInRecipes(
      id,
      replacementIngredient,
      'publishedRecipes',
    );

    await replaceIngredientInRecipes(
      id,
      replacementIngredient,
      'draftRecipes',
    );

    await rdb.destroy('ingredients', id);
  } catch (err) {
    console.error('removeIngredient error', err);
  }
};

router.post('/delete', async (req, res) => {
  try {
    const { ingredients } = req.body;
    console.log('req.body', req.body);

    for (const ingredient of ingredients) {
      const { id, replacementId } = ingredient;
      await removeIngredient(id, replacementId);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('DELETE /ingredients', error);
    return res.sendStatus(500);
  }
});

router.get('/pending', async (req, res) => {
  try {
    const pendingIngredients = await rdb.findBy('ingredients', 'status', 'pending');
    res.status(200);
    return res.send(pendingIngredients);
  } catch (error) {
    console.error('/ingredients/pending', error);
    return res.sendStatus(500);
  }
});

router.get('/groups', async (req, res) => {
  try {
    const groups = await rdb.findAll('ingredientGroups');
    res.status(200);
    return res.send(groups);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.post('/groups', async (req, res) => {
  try {
    const { name } = req.body;
    const response = await rdb.save('ingredientGroups', { name });
    const groupId = response.generated_keys[0];
    res.status(201);
    return res.send(groupId);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
