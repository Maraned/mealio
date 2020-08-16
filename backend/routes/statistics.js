var express = require('express');
var router = express.Router();
var logger = require('../utils/logger');

var rdb = require('../lib/rethink');

const { isEmpty } = require('lodash');

const statistics = (stat) => {
  let rdbFunc;
  if (stat === 'count') {
    rdbFunc = rdb.count;
  } else if (stat === 'month') {
    rdbFunc = rdb.from;
  } else {
    rdbFunc = () => [];
  }
  
  return {
    users: async (stats) => {
      const results = {};
      if (stats.includes('registered')) {
        results['registered'] = await rdbFunc('users');
      }
      return results;
    },
    recipes: async (stats) => {
      let results = {};
      if (stats.includes('published')) {
        results['published'] = await rdbFunc('publishedRecipes');
      }
      if (stats.includes('draft')) {
        results['draft'] = await rdbFunc('draftRecipes');
      }
      return results;
    }
  }
}

const getPieModeStats = async reqPieModeStats => {
  const stats = {};

  for (const group of Object.keys(reqPieModeStats)) {
    const { include, stat } = reqPieModeStats[group];
    stats[group] = await statistics(stat)[group](include);
  }

  return stats;
};

const getGridModeStats = reqGridModeStats => {
  if (isEmpty(reqGridModeStats)) {
    return [];
  }

  return [];
};

router.get('/', async (req, res) => {
  try {
    const { pieMode, gridMode } = req.query.settings || {};

    response = {
      pieStats: await getPieModeStats(pieMode),
      gridStats: await getGridModeStats(gridMode)
    };

    return res.json(response);
  } catch (error) {
    logger('GET /statistics', {}, error);
    return res.sendStatus(500);
  }
});


module.exports = router;

