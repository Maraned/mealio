class Connections {
  constructor() {
    this.clients = [];
  }

  setClients(clients) {
    this.clients = clients;
  }
  
  addClient(client) {
    this.clients.push(client);
  }

  broadcast(data) {
    for (const client of this.clients) {
      client.send(JSON.stringify(data));
    }
  }
};

const connections = new Connections();

module.exports = connections;
