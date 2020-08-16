const request = require('request-promise');

const TastelineParser = require('./tasteline');

async function WebParser({ url, userId }) {
  try {
    console.log('url', url);
    // const domainRegex = /https?:\/\/(.*?)\//;

    const domainRegex = new RegExp(/https?:\/\/(.*?)\//);

    // const matches = url.match(domainRegex);
    const domain = domainRegex.exec(url)[1];

    const htmlPage = await request(url);

    if (domain.includes('tasteline')) {
      return TastelineParser(htmlPage, url, userId);
    }

    return {};
  } catch (err) {
    console.error(err);
    return {};
  }
};

module.exports = WebParser;
