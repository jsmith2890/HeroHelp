const newSocketMap = {}

const heroSocketMap = {}

const citizenSocketMap = {}

module.exports.newSocket = socket => {
  newSocketMap[socket.id] = {
    socket: socket,
  }
}

module.exports.deleteSocket = socket => {
  if (newSocketMap.hasOwnProperty(socket.id)) {
    delete newSocketMap[socket.id];
    return;
  }
  //otherwise this is in hero or citizen and need to update their states
  //along with cleaning up socket map
}

//we know socket is a hero -- move it to appropriate map
module.exports.promoteSocketToHero = socketId => {
  if (newSocketMap.hasOwnProperty(socketId)) {
    heroSocketMap[socketId]=newSocketMap[socketId];
    delete newSocketMap[socketId];
  } else {
    console.log('promoteSocketToHero: socket id ',socketId,' not found')
  }
}

module.exports.promoteSocketToCitizen = socketId => {
  if (newSocketMap.hasOwnProperty(socketId)) {
    citizenSocketMap[socketId]=newSocketMap[socketId];
    delete newSocketMap[socketId];
  } else {
    console.log('promoteSocketToCitizen: socket id ',socketId,' not found')
  }
}
