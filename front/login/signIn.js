'use strict';

$(document).ready(() => {
  $('#mainForm').submit(() => {
    const name = $('#username').val();
    const password = $('#password').val();

    if (validateSubmit(password, name)) {
      const data = { name, password };

      console.log('User data is being checked...');

      $.post('/signin', data, result => {
        result = JSON.parse(result);
        console.dir(result);
        if (result.exists) {
          window.location = '/';
        } else {
          alert('the username or password is wrong');
          clear();
        }
      });
      return false;
    } else {
      return false;
    }
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
