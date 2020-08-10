const rdb = require('../lib/rethink');

module.exports.mapRecipeUsers = async (recipes) => {
    return Promise.all(recipes.map(async recipe => {
      let originalAuthorUser = null;
      console.log('mapping user', recipe.originalAuthor)
      if (recipe.originalAuthor) {
        originalAuthorUser = await rdb.find('users', recipe.originalAuthor);
      }

      let authorUser = null;
      if (recipe.author) {
        authorUser = await rdb.find('users', recipe.author);
      }

      return { ...recipe, originalAuthorUser, authorUser };
    }));
};
