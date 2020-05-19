'use strict';

const http = require('http');
const express = require('express');
const WebSocket = require('websocket').server;
const router = require('./back/Irequest/httpRouter.js');
const bodyParser = require('body-parser');
const socketRouter = require('./back/Irequest/SocketRouter');

const app = express();

const PORT = process.env.PORT || 5000;

app
  .use(express.static(__dirname + '/front'))
  .use(express.json())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .set('view engine', 'ejs');

// CHECK IF WORKS WITHOUT WRAPPING NEXT THINGS

const server = http.createServer(app); // wrap the app

const ws = new WebSocket({
  httpServer: server,
  autoAcceptConnections: false
}); // wrap the WS

ws.on('request', req => {
  if (!originIsAllowed(req.origin)) {
    req.reject();
    console.log(
      new Date() + ' Connection from origin ' + req.origin + ' rejected.'
    );
    return;
  }

  const connection = req.accept('', req.origin);

  socketRouter.saveConnection(connection);

  console.log(req.origin + ' Connection accepted.');
  // Hang some middleware handlers on the connection
  // to be executed when a message is sent through the socket
  connection.on('message', msg => {
    socketRouter.route(msg);
  });

  connection.on('close', () => {});
});

router(app);

server.listen(PORT, () => {
  console.log('listening on the port', PORT);
});

//deploy automatically

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
