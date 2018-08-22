const socketio = require('socket.io')

const {ServerSendsToCitizen} = require('./MsgType')

const {sendToClient} = require('./util')

// ========== Send data to Hero via socket ========

module.exports.sendAckHelpRequestToCitizen = socket => {
  sendToClient(socket, ServerSendsToCitizen.ACK_RECEIVED_HELP_REQUEST)
}

module.exports.sendHeroEnrouteToCitizen = (
  socket,
  lat,
  lon,
  heroImage,
  heroName
) => {
  sendToClient(socket, ServerSendsToCitizen.HERO_ENROUTE, {
    lat,
    lon,
    heroImage,
    heroName
  })
}

module.exports.sendHeroOnSiteToCitizen = (socket, lat, lon) => {
  sendToClient(socket, ServerSendsToCitizen.HERO_ON_SITE, {lat, lon})
}

module.exports.sendIncidentResolvedToCitizen = (socket) => {
  console.log('send incident resolve to citizen')
  sendToClient(socket, ServerSendsToCitizen.INCIDENT_RESOLVED, {})
}
