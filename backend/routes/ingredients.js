var express = require('express');
var router = express.Router();

var rdb = require('../lib/rethink');

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
    console.log('response', response)
    const groupId = response.generated_keys[0];
    res.status(201);
    return res.send(groupId);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
