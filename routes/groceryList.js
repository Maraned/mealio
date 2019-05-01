var express = require('express');
var router = express.Router();

var rdb = require('../lib/rethink');

router.post('/create', async (req, res) => {
  try {
    const { items, name, userId } = req.body;
    
    const response = await rdb.save('groceryLists', { items, name, createdAt: new Date() });
    const groceryListId = response.generated_keys[0];
    await rdb.addToArray('users', userId, 'groceryLists', groceryListId);
    const groceryList = await rdb.find('groceryLists', groceryListId);
    res.status(201);
    res.send(groceryList);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await rdb.edit('groceryLists', id, req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const response = await rdb.destroy('groceryLists', id);
    await rdb.removeFromArray('users', userId, 'groceryLists', id);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;