const cheerio = require('cheerio');
const { IngredientMatcher } = require('./ingredientMatcher');
const { capitalize, uuid } = require('../utils/stringUtils');

function TastelineParser(htmlPage, url) {
  const $ = cheerio.load(htmlPage);

  let ingredientGroups = [];

  const name = $('.recipe-description h1').text();
  const description = $('.recipe-ingress').text();
  const portions = $('.portions').data('portions');
  const portionsType = $('.portions').data('unit');
  const ingredientGroupElements = $('.ingredient-group');
  const image = $('.recipe-header-image img').attr('src');

  ingredientGroupElements.each(function(index, elem) {
    const ingredientGroupTitle = $(elem).find('h3').text();
    const ingredientElements = $(elem).find('ul').children();
    const ingredients = [];
    ingredientElements.each((i, ingredientElem) => {
      ingredients.push({
        amount: $(ingredientElem).find('.quantity').text(),
        unit: $(ingredientElem).find('.unit').text(),
        name: capitalize($(ingredientElem).find('.ingredient').text())
      });
    });
    ingredientGroups.push({ name: ingredientGroupTitle, ingredients, id: uuid() });
  });

  const stepGroupElements = $('.step-group');
  const steps = [];
  stepGroupElements.each((index, stepGroupElem) => {
    const stepTitle = $(stepGroupElem).find('h3').text();
    steps.push({ text: stepTitle });
    const stepElements = $(stepGroupElem).find('ul');
    stepElements.children().each((i, stepElem) => {
      const newlineAndWhitespaceRegex = /[\\n|\s]{3,}/g;
      const step = $(stepElem).text().replace(newlineAndWhitespaceRegex, '');
      steps.push({ text: step }); 
    })
  });

  const author = $('.recipe-author-text-inner span').text();
  const authorUrl = $('.recipe-author a').attr('href');

  IngredientMatcher(ingredientGroups);

  const recipe = {
    name,
    description,
    portions,
    portionsType,
    ingredientGroups,
    steps,
    author,
    authorUrl,
    origin: 'Tasteline',
    originUrl: url,
    images: [image]
  };

  console.log('recipe', recipe)

  return recipe;
};

module.exports = TastelineParser;