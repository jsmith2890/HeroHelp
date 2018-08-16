const socketio = require('socket.io')

const {
  ServerSendsToCitizen,
} = require('./MsgType');

const { sendToClient } = require('./util')

// ========== Send data to Hero via socket ========

module.exports.sendAckHelpRequestToCitizen= (socket) => {
  sendToClient(socket, ServerSendsToCitizen.ACK_RECEIVED_HELP_REQUEST)
}
