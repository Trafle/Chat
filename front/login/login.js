'use strict';

$(document).ready(() => {
  $('#mainForm').submit(() => {
    const name = $('#username')
      .val()
      .trim();
    const password = $('#password')
      .val()
      .trim();

    const data = { name, password }; //asd

    if (validateSubmit(password, name)) {
      $.post('/signup', data, result => {
        result = JSON.parse(result);
        console.log('User data is being checked...');
        console.dir(result);
        if (result.exists) {
          alert('There already exists a user with this name');
        } else {
          alert('You are successfully signed Up');
          window.location = '/';
        }
      });
    }

    clear();

    return false;
  });
});

function validateSubmit(password, username) {
  if (password === '' || username === '') {
    alert('You didn\'t fill in both fields');
    return false;
  }
  if (/[<>/\\!^*$ _]/g.test(username)) {
    alert(
      'please, don\'t use symbols like " \' < > / " " \\ _ ! ^ * $ in the name'
    );
    clear();
    return false;
  }
  if (name.length >= 25) {
    alert('The name must not consist of more than 25 characters');
    return false;
  }
  return true;
}

function clear() {
  $('#username').val('');
  $('#password').val('');
  $('#username').focus();
  return false;
}
