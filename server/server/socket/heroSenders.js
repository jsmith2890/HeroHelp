const socketio = require('socket.io')

const {ServerSendsToHero} = require('./MsgType')

const {sendToClient} = require('./util')

// ========== Send data to Hero via socket ========

module.exports.sendAckHeartbeatToHero = (socket, incidents) => {
  console.log(JSON.stringify({incidents}))
  sendToClient(socket, ServerSendsToHero.ACK_RECEIVED_HEARTBEAT, {incidents})
}

module.exports.sendDispatchToHero = (socket, lat, lon, incidentId, timeout) => {
  sendToClient(socket, ServerSendsToHero.GIVE_DISPATCH, {
    lat,
    lon,
    incidentId,
    timeout
  })
}

module.exports.sendAckDispatchDecisionToHero = (
  socket,
  incidentLat,
  incidentLon,
  incidentId
) => {
  sendToClient(socket, ServerSendsToHero.ACK_DISPATCH_DECISION, {
    incidentLat,
    incidentLon,
    incidentId
  })
}

module.exports.sendHeroOnSiteToHero = (socket) => {
  sendToClient(socket, ServerSendsToHero.HERO_ON_SITE, {})
}

module.exports.sendAckResolveIncidentToHero = socket => {
  sendToClient(socket, ServerSendsToHero.ACK_RESOLVE_INCIDENT, {})
}
