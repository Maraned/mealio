const cheerio = require('cheerio');

function TastelineParser(htmlPage, url) {
  const $ = cheerio.load(htmlPage);

  const ingredientGroups = [];

  const name = $('.recipe-description h1').text();
  const description = $('.recipe-ingress').text();
  const portions = $('.portions').data('portions');
  const ingredientGroupElements = $('.ingredient-group');
  ingredientGroupElements.each(function(index, elem) {
    const ingredientGroupTitle = $(elem).find('h3').text();
    const ingredientElements = $(elem).find('ul').children();
    const ingredients = [];
    ingredientElements.each((i, ingredientElem) => {
      ingredients.push({
        quantity: $(ingredientElem).find('.quantity').text(),
        unit: $(ingredientElem).find('.unit').text(),
        name: $(ingredientElem).find('.ingredient').text()
      });
    });
    ingredientGroups.push({ name: ingredientGroupTitle, ingredients });
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

  console.log('authorUrl', authorUrl)
  

  const recipe = {
    name,
    description,
    portions,
    ingredientGroups,
    steps,
    author,
    authorUrl,
    origin: 'Tasteline',
    originUrl: url,
  };

  console.log('recipe', recipe)

  return recipe;
};

module.exports = TastelineParser;