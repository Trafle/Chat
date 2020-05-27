'use strict';

const logic = require('../interactor/logic');

function route(app) {
  app.route('/').get(logic.initChatLogic);
  app.route('/signup').get((req, res) => {
    logic.initPage(res, 'signUpPage');
  });
  app.route('/signup').post(logic.signUpCheckLogic);
  app.route('/signin').get((req, res) => {
    logic.initPage(res, 'signInPage');
  });
  app.route('/signin').post(logic.signInCheckLogic);
}

module.exports = route;
