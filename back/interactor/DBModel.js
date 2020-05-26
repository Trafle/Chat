'use strict';

class DBUser {
  constructor(name, password) {
    this.name = name;
    this.password = password;
    this.colNames = [];
    this.status = 'offline';
  }
}

class DBMessage {
  constructor(from, to, text, time) {
    this.from = from;
    this.to = to;
    this.text = text;
    this.time = time;
  }
}

module.exports = { DBUser, DBMessage };
