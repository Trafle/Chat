'use strict';

const {
  User,
  Message,
  SignUpCheck,
  SignInCheck,
  EstablishPacket
} = require('./ResponseModel');

module.exports.signUpCheckRes = (res, bool) => {
  res.send(JSON.stringify(new SignUpCheck(bool)));
  res.end();
};

module.exports.signInCheckRes = (res, bool) => {
  res.send(JSON.stringify(new SignInCheck(bool)));
  res.end();
};

module.exports.messageRes = (client, msg, doc) => {
  let message = new Message(msg.from, msg.to, msg.text, msg.time, doc._id);
  message = JSON.stringify(message);
  client.send(message);
};

module.exports.userFound = (docs, client) => {
  if (docs) {
    docs.forEach(doc => {
      const user = new User(doc.name, doc.status);
      client.send(JSON.stringify(user));
    });
  } else {
    client.send(JSON.stringify(new User()));
  }
};

module.exports.saveConnection = (connection, ID) => {
  const establishPacket = new EstablishPacket(ID);
  if (connection.state === 'open') {
    connection.send(JSON.stringify(establishPacket));
  }
};
