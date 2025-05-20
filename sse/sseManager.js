const clients = new Map();

exports.addClient = (userId, res) => {
  clients.set(userId, res);
};

exports.removeClient = (userId) => {
  clients.delete(userId);
};

exports.sendToClient = (userId, message) => {
  const client = clients.get(userId);
  if (client) {
    client.write(`data: ${message}\n\n`);
  }
};

global.sendSSE = exports.sendToClient;
