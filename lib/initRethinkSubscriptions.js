const Connections = require('../utils/Connections');

console.log('Connections', Connections)

const initSubscription = async (tableName, eventName, rdb, connection) => {
  const feed = await rdb.table(tableName).changes().run(connection);
  feed.each((error, cursor) => {
    if (!error) {
      Connections.broadcast({ type: eventName, data: cursor });
    }
  });
};

module.exports = async (rdb, connection) => {
  await initSubscription('draftRecipes', 'draft', rdb, connection);
  await initSubscription('publishedRecipes', 'published', rdb, connection);
  await initSubscription('ingredients', 'ingredient', rdb, connection);
}
