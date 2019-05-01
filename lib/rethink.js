var rdb = require('rethinkdb');
var dbConfig = require('../config/database');
let connection;
const initConnection = async () => {
  connection = await rdb.connect(dbConfig);
}
initConnection();

module.exports.find = async (tableName, id) => {
  const result = await rdb
    .table(tableName)
    .get(id)
    .run(connection);
  return result;
};

module.exports.findAll = async tableName => {
  const cursor = await rdb
    .table(tableName)
    .run(connection);
  return cursor.toArray();
};

module.exports.findBy = async (tableName, fieldName, value) => {
  const cursor = await rdb
    .table(tableName)
    .filter(rdb
      .row(fieldName)
      .eq(value)
    )
    .run(connection);
  return cursor.toArray();
};

module.exports.save = async (tableName, object) => {
  const result = await rdb
    .table(tableName)
    .insert(object)
    .run(connection);
  return result;
};

module.exports.edit = async (tableName, id, object) => {
  const result = await rdb
    .table(tableName)
    .get(id)
    .update(object)
    .run(connection);
  return result;
};


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports.appendToRow = async (tableName, id, row, object) => {
  const result = await rdb
    .table(tableName)
    .get(id)
    .update({
      [row]: rdb.row(row).append({ ...object, id: uuidv4() }),
    })
    .run(connection);
  return result;
}

module.exports.addToArray = async (tableName, id, row, item) => {
  const result = await rdb
    .table(tableName)
    .get(id)
    .update({
      [row]: rdb.row(row).append(item)
    })
    .run(connection);
  return result;
};

module.exports.removeFromArray = async (tableName, id, rowName, itemId) => {
  const result = await rdb
    .table(tableName)
    .get(id)
    .update(row => {
      return {[rowName]: row(rowName).setDifference([itemId])}
    })
    .run(connection);
  return result;
}

module.exports.deleteRow = async (tableName, id, row, rowId) => {
  const indexToRemove = await rdb
    .table(tableName)
    .get(id)(row)
    .offsetsOf(
      rdb.row('id')
      .match(rowId)
    )
    .run(connection);

  const result = await rdb
    .table(tableName)
    .get(id)(row)
    .deleteAt(indexToRemove[0])
    .run(connection);
  return result;
};

module.exports.destroy = async (tableName, id) => {
  const result = await rdb
    .table(tableName)
    .get(id)
    .delete()
    .run(connection);
  return result;
};

module.exports.userRecipes = async (tableName, id) => {
  const recipeIds = await rdb
    .table('users')
    .get(id)(tableName)
    .run(connection);

  const cursor = await rdb
    .table(tableName)
    .getAll(rdb.args(recipeIds))
    .run(connection);
    
  const recipes = await cursor.toArray();
  return recipes;
};

module.exports.groceryLists = async (id) => {
  const groceryListIds = await rdb
    .table('users')
    .get(id)('groceryLists')
    .run(connection);

  const cursor = await rdb
    .table('groceryLists')
    .getAll(rdb.args(groceryListIds))
    .run(connection);
    
  const groceryLists = await cursor.toArray();
  return groceryLists;
}

module.exports.getRecipeImages = async (tableName, id) => {
  const imageIds = await rdb
    .table(tableName)
    .get(id)('images')
    .run(connection);
  return imageIds;
}