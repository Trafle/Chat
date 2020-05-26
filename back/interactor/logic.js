'use strict';

const crypto = require('crypto');
const dataAccess = require('./dataAccess');
const Cookies = require('cookies');
const ires = require('../Iresponse/Ires');

module.exports.wrapConnectionLogic = packet => {
  dataAccess.CLIENTS[packet.ID] = {
    client: dataAccess.CLIENTS[packet.ID],
    name: packet.from
  };
};

module.exports.saveConnectionLogic = connection => {
  const ID = dataAccess.inServerID();
  dataAccess.CLIENTS[ID] = connection;
  ires.saveConnection(connection, ID);
};

module.exports.userSearchLogic = user => {
  const regUser = new RegExp(user.name, 'gi');
  const client = dataAccess.getClientByName(user.from);
  if (client) {
    const iresFound = docs => {
      ires.userFound(docs, client);
    };
    // Make a try/catch cz of regexp troubles
    dataAccess
      .dbFindMany('users', { name: regUser })
      .then(iresFound, iresFound);
  }
};

module.exports.messageLogic = msg => {
  dataAccess.saveToDB(msg, 'messages').then(doc => {
    sendEverybody(msg, doc);
  });
};

module.exports.signInCheckLogic = (req, res) => {
  dataAccess
    .dbFindOne('users', {
      name: req.body.name,
      password: bhash(req.body.password)
    })
    .then(doc => {
      setCookies(req, res, 'sesID', doc['_id']);
      setCookies(req, res, 'name', req.body.name);
      ires.signInCheckRes(res, true);
    })
    .catch(() => {
      ires.signInCheckRes(res, false);
    });
};

module.exports.signUpCheckLogic = (req, res) => {
  const regBody = '^' + req.body.name + '$';
  const regName = new RegExp(regBody, 'i');

  dataAccess
    .dbFindOne('users', { name: regName })
    .then(() => {
      ires.signUpCheckRes(res, true);
    })
    .catch(error => {
      if (error) throw error;
      dataAccess
        .saveToDB(
          { name: req.body.name, password: bhash(req.body.password) },
          'users'
        )
        .then(doc => {
          setCookies(req, res, 'sesID', doc['_id']);
          setCookies(req, res, 'name', req.body.name);
          ires.signUpCheckRes(res, false);
        })
        .catch(console.err);
    });
};

module.exports.initChatLogic = (req, res) => {
  const cookies = new Cookies(req, res);
  if (cookies.get('sesID') && cookies.get('name')) {
    validateUser(req, res).then(document => {
      document ? initPage(res, 'chatPage') : redirectTo(res, '/signin');
    });
  } else {
    redirectTo(res, '/signin');
  }
};

function initPage(res, page) {
  res.write(dataAccess[page]);
  res.end();
}

module.exports.initPage = initPage;

module.exports.badRequest = msg => {
  const client = dataAccess.getClientByName(msg.from);
  if (client) {
    client.send(400);
  }
};

function setCookies(req, res, name, value) {
  const cookies = new Cookies(req, res);
  cookies.set(name, value, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false
  });
  return cookies;
}

function redirectTo(res, url) {
  res.send(`<script>window.location = '${url}'</script>`);
  res.end();
}

async function validateUser(req, res) {
  // Rewrite as a Promise
  const cookies = new Cookies(req, res);
  const accessCookie = cookies.get('sesID');
  const nameCookie = cookies.get('name');

  const document = await dataAccess.dbFindOne('users', {
    _id: accessCookie,
    name: nameCookie
  });
  return !!document;
}

function sendEverybody(msg, doc) {
  dataAccess.CLIENTS.forEach(connection => {
    if (connection.client.readyState === connection.client.OPEN)
      ires.messageRes(connection.client, msg, doc);
  });
}

function bhash(secret) {
  return crypto
    .createHmac('sha256', secret)
    .update('I love cupcakes')
    .digest('hex');
}
