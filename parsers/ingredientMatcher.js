var rdb = require('../lib/rethink');

const newIngredient = async ingredientName => {
  const alternatives = [];
  const group = null;
  const name = ingredientName;
  const status = 'pending';
  
  const response = await rdb.save('ingredients', { name, group, status, alternatives });
  const ingredientId = response.generated_keys[0];
  const ingredient = await rdb.find('ingredients', ingredientId);
  return ingredient;
};

const IngredientMatcher = async (ingredientGroups) => {
  const allIngredients = await rdb.findAll('ingredients');
  
  for (const ingredientGroup of ingredientGroups) {
    for (let i = 0; i < ingredientGroup.ingredients.length; i++) {
      const ingredient = ingredientGroup.ingredients[i];
      const matchedIngredient = allIngredients.find(storedIngredient => {
        return storedIngredient.name === ingredient.name;
      });

      if (matchedIngredient) {
        ingredientGroup.ingredients[i] = matchedIngredient;
      } else {
        const createdIngredient = await newIngredient(ingredient.name);
        ingredientGroup.ingredients[i] = createdIngredient;
      }
    }
  }
};

module.exports = {
  IngredientMatcher
};
