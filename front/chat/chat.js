'use strict';

$(document).ready(() => {
  $('#msgText').focus();

  console.log('chat.js');

  // Bind the view as a plugin to the application
  VM.onPushMessage = addMessage;
  VM.onPushUser = addUser;
  VM.onSetActiveRoom = activeRoom;
  VM.user = $.cookie('name');

  activeRoom(VM.activeRoom);

  $('#messageForm').submit(e => {
    console.time('hell');
    e.preventDefault();
    const text = $('#msgText').val();
    if (text.length !== 0) {
      VM.sendMessage(text);
      clear();
    }
    return false;
  });
});

function clear() {
  $('#msgText')
    .val('')
    .focus();
}

function getTime() {
  return (
    new Date().getHours() +
    ':' +
    (() =>
      (new Date().getMinutes() < 10 ?
        '0' + new Date().getMinutes() :
        new Date().getMinutes()))()
  );
}

function activeRoom(room) {
  $('#chatFriendName').text(room);
}

function userSearch(user) {
  VM.userSearch(user);
}

function addUser(user) {
  $('.contacts').append(
    '<li class="barChat"><div class="d-flex bd-highlight"><div class="img_cont"><img src="https://scontent.fdnk1-1.fna.fbcdn.net/v/t1.0-9/14495295_184976548596176_4973533060545737799_n.png?_nc_cat=104&_nc_ht=scontent.fdnk1-1.fna&oh=312abdec8c94d604abcebfb5e49a5399&oe=5D245688" class="rounded-circle user_img"/>' +
      '<span class="online_icon"></span></div>' +
      '<div class="user_info"><span>' +
      user.name +
      '</span><p class="userBoxStatus" id="' +
      user.name +
      'StatusBox" style="margin-bottom: 0px">status: ' +
      user.status +
      '</p></div></div></li><hr>'
  );
}

function addMessage(msg) {
  const gen = whoseMes(msg);
  $('#msgs').append(
    $(
      '<div id="' +
        msg.id +
        '" class="d-flex justify-content-' +
        gen.next().value +
        ' mb-4">' +
        gen.next().value +
        '<text>' +
        msg.text +
        '</text>' +
        gen.next().value +
        msg.time +
        gen.next().value
    )
  );
  $('#msgs').scrollTop($('#msgs')[0].scrollHeight);
}

function* whoseMes(msg) {
  if (msg.from === $.cookie('name')) {
    yield 'end';
    yield '<div class="mes msg_cotainer_send">';
    yield '<span class="msg_time_send" >';
    yield '</span ></div ><div class="img_cont_msg"><img src="https://www.facephi.com/uploads/imagenes/paginas/galeria/201607/galeria-me.png"class="rounded-circle user_img_msg"/><div class="edit">edit</div></div></div>';
  } else {
    yield 'start';
    yield '<div class="img_cont_msg">' +
      '<img src="https://scontent.fdnk1-1.fna.fbcdn.net/v/t1.0-9/14495295_184976548596176_4973533060545737799_n.png?_nc_cat=104&_nc_ht=scontent.fdnk1-1.fna&oh=312abdec8c94d604abcebfb5e49a5399&oe=5D245688" class="rounded-circle user_img_msg"/></div>' +
      '<div class="msg_cotainer">';
    yield '<span class="msg_time" ><div class="time">';
    yield '</div></span></div >';
  }
}
