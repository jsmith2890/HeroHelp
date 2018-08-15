const {
  ServerSendsToNewSocket,
} = require('./MsgType');

const { sendToClient } = require('./util')

// ========== Send data to Hero via socket ========

module.exports.sendTellHero = (socket) => {
  sendToClient(socket, ServerSendsToNewSocket.TELL_HERO, {});
};

module.exports.sendTellCitizen = (socket,id) => {
  sendToClient(socket, ServerSendsToNewSocket.TELL_CITIZEN, {citizenId:id});
};
