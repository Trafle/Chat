'use strict';

// Initializing requests and response handlers
console.log('VM.js');

const socket = new WebSocket('ws://127.0.0.1:5000');
//wss://wetok.herokuapp.com

class ViewModel {
  constructor() {
    this.messages = [];
    this.users = [];
    this.activeRoom = 'WetOK example chat';
    this.user = '';
  }

  onPushMessage() {}

  pushMessage(msg) {
    this.onPushMessage(msg);
    this.messages.push(msg);
    console.timeEnd('hell');
  }

  onPushUser() {}

  pushUser(user) {
    this.onPushUser(user);
    this.users.push(user);
  }

  onSetActiveRoom() {}

  setActiveRoom(room) {
    onSetActiveRoom(room);
    this.activeRoom = room;
  }

  sendMessage(text) {
    sendMsgCon(this.activeRoom, text);
  }

  userSearch(user) {
    userSearchCon(user);
  }

  establishPacket(packet) {
    establishPacketCon(packet);
  }
}

const VM = new ViewModel();

define({ VM, socket });
