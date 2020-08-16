var express = require('express');
var router = express.Router();

var rdb = require('../lib/rethink');

router.get('/', async (req, res) => {
  try {
    const ingredientGroups = await rdb.findAll('ingredientGroups');
    res.status(200);
    return res.send(ingredientGroups);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
