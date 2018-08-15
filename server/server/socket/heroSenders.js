const socketio = require('socket.io')

const {
  ServerSendsToHero,
} = require('./MsgType');

const sendToClient = (socket, event, data) => {
  socket.emit(event, data);
};

// ========== Send data to Hero via socket ========

module.exports.sendAckHeartbeatToHero = (socket,incidents) => {
  sendToClient(socket, ServerSendsToHero.ACK_RECEIVED_HEARTBEAT, incidents)
}

module.exports.sendDispatchToHero = (socket, incidentData) => {
  sendToClient(socket, ServerSendsToHero.GIVE_DISPATCH, incidentData);
};
