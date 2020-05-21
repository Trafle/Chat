'use strict';

console.log('RequestModel.js');

// For simple messages
class Message {
  constructor(to, text, time) {
    this.to = to;
    this.text = text;
    this.time = time;
    this.class = 'Message';
  }
}

// For the edit button events in the future
class Edit {
  constructor(msgID, newVal) {
    this.msgID = msgID;
    this.newVal = newVal;
    this.class = 'Edit';
  }
}

// For search input events
class UserSearch {
  constructor(user) {
    this.name = user;
    this.class = 'UserSearch';
  }
}

class EstablishPacket {
  constructor(ID) {
    this.ID = ID;
    this.class = 'EstablishPacket';
  }
}

const reqClasses = { Message, Edit, UserSearch, EstablishPacket };

if (typeof window === 'undefined') {
  module.exports = reqClasses;
} else {
  define(reqClasses);
}
