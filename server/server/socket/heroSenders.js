const socketio = require('socket.io')

const {
  ServerSendsToHero,
} = require('./MsgType');

const { sendToClient } = require('./util')

// ========== Send data to Hero via socket ========

module.exports.sendAckHeartbeatToHero = (socket,incidents) => {
  sendToClient(socket, ServerSendsToHero.ACK_RECEIVED_HEARTBEAT, incidents)
}

module.exports.sendDispatchToHero = (socket, incidentData) => {
  sendToClient(socket, ServerSendsToHero.GIVE_DISPATCH, incidentData);
};

module.exports.sendAckDispatchDecisionToHero = (socket, incidentLat, incidentLon, incidentId) => {
  sendToClient(socket, ServerSendsToHero.ACK_DISPATCH_DECISION, {incidentLat, incidentLon, incidentId});
};

module.exports.sendHeroOnSiteToHero = (socket, lat, lon) => {
  sendToClient(socket, ServerSendsToHero.HERO_ON_SITE, { lat, lon });
};

module.exports.sendAckResolveIncidentToHero = (socket) => {
  sendToClient(socket, ServerSendsToHero.ACK_RESOLVE_INCIDENT, {});
};
