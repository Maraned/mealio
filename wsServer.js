const WebSocket = require('ws');
const Connections = require('./utils/Connections');
var rdb = require('./lib/rethink');

const initConnection = async client => {
  
  console.log('initconnections')
  const draftRecipes = await rdb.findAll('draftRecipes');
  client.send(JSON.stringify({ type: 'draft', data: draftRecipes }));

  const publishedRecipes = await rdb.findAll('publishedRecipes');
  client.send(JSON.stringify({ type: 'published', data: publishedRecipes }));

  const ingredients = await rdb.findAll('ingredients');
  client.send(JSON.stringify({ type: 'ingredient', data: ingredients }));

  const ingredientGroups = await rdb.findAll('ingredientGroups');
  client.send(JSON.stringify({ type: 'ingredientGroup', data: ingredientGroups }));
}

const initWsServer = server => {
  var wsServer = new WebSocket.Server({
    server,
  });

  wsServer.on('connection', ws => {
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });

    Connections.addClient(ws);
    initConnection(ws);
  });
};

module.exports = {
  initWsServer,
};
