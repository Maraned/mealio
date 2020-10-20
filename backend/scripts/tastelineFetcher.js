/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');
const request = require('request-promise');
const rdb = require('../lib/rethink');

const WebParser = require('../parsers/webParser');
const { createOrUpdateRecipe, publishRecipe } = require('../routes/recipesUtils');

const sleep = async (timeout) => new Promise(resolve => setTimeout(resolve, timeout))

const getRecipeLink = async ($, elem) => {
  const recipeLink = $(elem).find('.recipe-header-image a').attr('href');
  const existingRecipe = await rdb.findBy('publishedRecipes', 'originUrl', recipeLink);
  if (!existingRecipe.length) {
    return recipeLink;
  }
  return null;
};

const getRecipeLinksFromPage = async ($) => {
  try {
    const allPageRecipes = $('.recipe-list .recipe-header');
    const recipePromises = [];
    allPageRecipes.each((index, elem) => {
      recipePromises.push(getRecipeLink($, elem));
    });
    let allRecipeLinks = await Promise.all(recipePromises);
    allRecipeLinks = allRecipeLinks.filter((link) => !!link);
    return allRecipeLinks;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const fetchRecipeLinks = async (page) => {
  await sleep(250);
  const url = `https://www.tasteline.com/recept/?sida=${page}`;
  const htmlPage = await request(url);
  const $ = cheerio.load(htmlPage);
  return await getRecipeLinksFromPage($);
};

const createRecipesFromRecipeLinks = async (recipeLinks, allRecipeLinks) => {
  const createdRecipes = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const link of recipeLinks) {
    if (!allRecipeLinks.includes(link)) {
      const recipeResult = await WebParser({ url: link, userId: 'mealio' });
      const { dataToSendBack } = await createOrUpdateRecipe(
        recipeResult.recipe,
        recipeResult.originalAuthorUser.id
      );

      await publishRecipe(dataToSendBack.recipe, recipeResult.originalAuthorUser.id);
      await sleep(250);
      createdRecipes.push(link);
    }
  }

  return createdRecipes;
}

async function TastelineFetcher(maxRecipes) {
  const start = new Date().getTime();
  const url = 'https://www.tasteline.com/recept/?sida=1';
  const htmlPage = await request(url);
  const $ = cheerio.load(htmlPage);

  let remainingRecipes = maxRecipes;

  let amountOfRecipes = $('.list-filter-old__total-count').text();
  amountOfRecipes = parseInt(amountOfRecipes.replace(/[^\d]/g, ''), 10);
  // console.log('runnign')
  let recipeLinks = await getRecipeLinksFromPage($);
  const allRecipeLinks = await rdb.findIfHasFields('publishedRecipes', 'originUrl');
  let createdRecipes = await createRecipesFromRecipeLinks(recipeLinks, allRecipeLinks);

  remainingRecipes -= createdRecipes.length;
  const amountOfPages = Math.ceil((maxRecipes || amountOfRecipes) / recipeLinks.length);

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < amountOfPages; i++) {
    // eslint-disable-next-line no-await-in-loop
    const fetchedRecipeLinks = await fetchRecipeLinks(i);
    createdRecipes = await createRecipesFromRecipeLinks(
      fetchedRecipeLinks,
      allRecipeLinks,
    );
    remainingRecipes -= createdRecipes.length;
    if (remainingRecipes <= 0) {
      break;
    }
    recipeLinks = [...recipeLinks, ...fetchedRecipeLinks];
  }
  const end = new Date().getTime();

  const executionTime = (end - start) / 1000;
  console.log('executionTime', `${executionTime} seconds`)
  return;
};

module.exports = (async function() {
  const maxRecipes = process.argv ? parseInt(process.argv[process.argv.length - 1], 10) : 100;

  await TastelineFetcher(maxRecipes);
  process.exit();
})();
