'use strict';

const logic = require('../interactor/logic');

const classes = {
  Message: msg => logic.messageLogic(msg),
  UserSearch: msg => logic.userSearchLogic(msg),
  Connection: msg => logic.userSearchLogic(msg),
  EstablishPacket: msg => logic.wrapConnectionLogic(msg)
};

function route(msg) {
  // Write a validator of message classes using request model
  msg = JSON.parse(msg.utf8Data);
  try {
    classes[msg.class](msg);
  } catch (err) {
    console.log('err');
    console.log(err);
    logic.badRequest(msg);
  }
}

function saveConnection(connection) {
  logic.saveConnectionLogic(connection);
}

module.exports = { route, saveConnection };
