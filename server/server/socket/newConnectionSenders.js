const socketio = require('socket.io')

const {
  ServerSendsToNewSocket,
} = require('./MsgType');

const sendToClient = (socket, event, data) => {
  console.log("event",event,"data",data)
  socket.emit(event, data);
};

// ========== Send data to Hero via socket ========

module.exports.sendTellHero = (socket) => {
  sendToClient(socket, ServerSendsToNewSocket.TELL_HERO, {});
};
