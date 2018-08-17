const { registerNewConnectionHandlers } = require('./newConnectionHandlers');

const { newSocket,deleteSocket } = require('./socketMaps')

module.exports = io => {
  io.on('connection', serverSocket => {
    console.log(
      `A socket connection to the server has been made: ${serverSocket.id}`
    )

    // We don't know who the client is exactly.
    // Need for client to either authenticate or ask to be given a clientID
    // Each listener may have to check if the user is authenticated or not
    registerNewConnectionHandlers(serverSocket)

    // Save this socket to the new socket map, pending further identification
    newSocket(serverSocket)

    serverSocket.on('disconnect', () => {
      console.log(`Connection ${serverSocket.id} has disconnected.`)
      // Remove socket from the socketIdMap
      deleteSocket(serverSocket);
    })
  })
}
