'use strict';

console.log('presenter.js');

socket.onopen = () => {
  console.log('connected');
};

const vmRouter = {
  Message: msg => VM.pushMessage(msg),
  User: msg => VM.pushUser(msg),
  EstablishPacket: msg => VM.establishPacket(msg)
};

socket.onmessage = event => {
  // Write some valid validator of message classes
  const msg = JSON.parse(event.data);
  console.log(msg);
  try {
    vmRouter[msg.class](msg);
  } catch (err) {
    console.error(err);
  }
};
