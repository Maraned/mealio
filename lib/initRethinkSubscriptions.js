const broadcast = require('../wsServer').broadcast;

const initSubscription = async (tableName, rdb, connection) => {
  const feed = await rdb.table(tableName).changes().run(connection);
  feed.each((error, cursor) => {
    if (!error) {
      broadcast({ type: 'draft', data: cursor });
    }
  });
};

module.exports = async (rdb, connection) => {
  await initSubscription('draftRecipes', rdb, connection);
}
