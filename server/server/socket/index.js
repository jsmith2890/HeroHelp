const { registerCitizenHandlers } = require('./citizenHandlers')
const { registerHeroHandlers } = require('./heroHandlers');
const { registerNewConnectionHandlers } = require('./newConnectionHandlers');

const { newSocket,deleteSocket } = require('./socketMaps')

/*
States for an Incident (Server tracks this):
CREATED (citizen requested help)
WAITING_FOR_HERO_DECISION (ask hero to accept or reject)
HERO_ENROUTE (hero has accepted and is on the way)
HERO_ON_SITE (hero has made it on site)
RESOLVED (hero has resolved the incident)

States for Hero:
UNAVAILABLE (will not receive a dispatch)
AVAILABLE (waiting for dispatch)
DECIDING_ON_DISPATCH (can accept or reject)
ENROUTE (accepted dispatch and on the way)
ON_SITE (made it on site)
RESOLVED_INCIDENT (marked the incident as resolved)

States for Citizen:
IDLE (can push help button)
WAIT_FOR_HERO_DISPATCH (waiting for a succesful dispatch to a hero)
KNOWS_HERO_ENROUTE (hero has accepted and is on the way)
KNOWS_HERO_ON_SITE (hero has made it on site)
KNOWS_INCIDENT_RESOLVED (hero has resolved incident) => IDLE

*/



module.exports = io => {
  io.on('connection', serverSocket => {
    console.log(
      `A socket connection to the server has been made: ${serverSocket.id}`
    )

    // We don't know who the client is exactly.
    // Need for client to either authenticate or ask to be given a clientID
    // Each listener may have to check if the user is authenticated or not
    registerNewConnectionHandlers(serverSocket)

    // We should register these based on what the client ends up being
    // registerCitizenHandlers(serverSocket)
    // registerHeroHandlers(serverSocket)

    // Save this socket to the new socket map, pending further identification
    newSocket(serverSocket)

    serverSocket.on('disconnect', () => {
      console.log(`Connection ${serverSocket.id} has disconnected.`)
      // Remove socket from the socketIdMap
      deleteSocket(serverSocket);
    })
  })
}
