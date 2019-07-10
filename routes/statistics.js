var express = require('express');
var router = express.Router();

var rdb = require('../lib/rethink');

router.get('/', async (req, res) => {
  try {
    const usersCount = await rdb.count('users');
    const publishedRecipesCount = await rdb.count('publishedRecipes');
    const draftRecipesCount = await rdb.count('draftRecipes');
    const pendingIngredientsCount = await rdb.countBy('ingredients', 'status', 'pending');

    return res.send({
      usersCount,
      publishedRecipesCount,
      draftRecipesCount,
      pendingIngredientsCount,
    })
  } catch (error) {
    console.error('/statistics', error);
    return res.sendStatus(500);
  }
});

module.exports = router;

