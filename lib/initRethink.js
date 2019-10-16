const initMealio = async (r, connection) => {
  r.dbList().contains('mealio')
    .do(function (databaseExists) {
      return r.branch(
        databaseExists,
        { dbs_created: 0 },
        r.dbCreate('mealio')
      );
    }).run(connection);
};

const createTableIfNotExists = async (r, connection, tables, tableName) => {
  if (!tables.includes(tableName)) {
    r.tableCreate(tableName).run(connection);
  }
};

const createTables = async (r, connection) => {
  const tables = await r.tableList().run(connection); 
  await createTableIfNotExists(r, connection, tables, 'users');
  await createTableIfNotExists(r, connection, tables, 'publishedRecipes');
  await createTableIfNotExists(r, connection, tables, 'draftRecipes');
  await createTableIfNotExists(r, connection, tables, 'ingredients');
  await createTableIfNotExists(r, connection, tables, 'ingredientGroups');
  await createTableIfNotExists(r, connection, tables, 'groceryLists');
};

module.exports = async (r, connection) => {
  await initMealio(r, connection);
  connection.use('mealio');
  await createTables(r, connection)
};
