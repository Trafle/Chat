'use strict';

const { MongoClient, ObjectID } = require('mongodb');
const { DBUser, DBMessage } = require('./DBModel');
const uri = require('./dbUrl');
const dbName = 'mess';
const CLIENTS = new Array();
const dbClient = new MongoClient(uri, { useNewUrlParser: true });
const fs = require('fs');

// Initializing the db client
dbClient.connect((err, client) => {
  if (err) throw err;
  global.db = client.db(dbName);
});

module.exports.CLIENTS = CLIENTS;
module.exports.chatPage = fs.readFileSync('front/chat/chat.html', 'utf8');
module.exports.signUpPage = fs.readFileSync('front/login/login.html', 'utf8');
module.exports.signInPage = fs.readFileSync('front/login/signIn.html', 'utf8');

const dbCollectionRouter = {
  users: msg => handleSave([msg.name, msg.password], 'users'),
  messages: msg =>
    handleSave([msg.from, msg.to, msg.text, msg.time], 'messages')
};

const schemas = {
  users: () => DBUser,
  messages: () => DBMessage
};

module.exports.saveToDB = (msg, colName) => dbCollectionRouter[colName](msg);

module.exports.getClientByName = name => {
  for (const connection in CLIENTS) {
    if (CLIENTS[connection].name === name) {
      return CLIENTS[connection].client;
    }
  }
};

module.exports.dbFindMany = (colName, obj) =>
  new Promise((res, rej) => {
    obj = makeIDCorrect(obj);
    db.collection(colName)
      .find(obj)
      .toArray((err, docs) => {
        if (err) throw err;
        if (docs === null) rej(null);
        res(docs);
      });
  });

module.exports.inServerID = name => {
  if (name)
    CLIENTS.forEach((client, index) => {
      if (client.name === name) {
        return index;
      }
    });
  if (!name) return CLIENTS.length;
};

module.exports.dbFindOne = (colName, obj) =>
  new Promise((res, rej) => {
    obj = makeIDCorrect(obj);
    db.collection(colName).findOne(obj, (err, doc) => {
      if (err) rej(err);
      if (doc === null) rej(null);
      res(doc);
    });
  });

function makeIDCorrect(obj) {
  for (const field in obj) {
    if (field === '_id') {
      obj[field] = ObjectID(obj[field]);
    }
  }
  return obj;
}

function handleSave(msg, colName) {
  return new Promise((res, rej) => {
    db.collection(colName).insertOne(
      new (schemas[colName]())(...msg),
      (err, doc) => {
        // if (err) throw err;
        if (err) rej(err);
        res(doc.ops[0]);
      }
    );
  });
}
