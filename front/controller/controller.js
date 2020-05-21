'use strict';

console.log('controller.js');
const str = obj => {
  obj.from = $.cookie('name');
  console.log(obj);
  return JSON.stringify(obj);
};

function sendMsgCon(to, text) {
  const msg = new Message(to, text, getTime());
  socket.send(str(msg));
}

function userSearchCon(user = new UserSearch('check')) {
  user = new UserSearch(user);
  socket.send(str(user));
}

function establishPacketCon(packet) {
  const pack = new EstablishPacket(packet.ID);
  socket.send(str(pack));
}
