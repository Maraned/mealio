const WebSocket = require('ws');

// list of currently connected clients (users)
const clients = [];

const initWsServer = server => {
  var wsServer = new WebSocket.Server({
    server,
  });

  wsServer.on('connection', ws => {
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });

    clients.push(ws);
  });
};

const broadcast = data => {
  for (const client of clients) {
    client.send(JSON.stringify(data));
  }
};


module.exports = {
  initWsServer,
  broadcast,
};
