const CLIENTS = [{ s: 2 }, { k: 9 }];

module.exports.CLIENTS = CLIENTS;

module.exports.getClients = getClients;

function getClients() {
  console.log('CLIENTS');
  console.log(CLIENTS);
  return CLIENTS;
}
