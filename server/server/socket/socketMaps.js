const {Citizen,Hero,User} = require('../db/models')

const newSocketMap = {}

const heroSocketMap = {}

const citizenSocketMap = {}

module.exports.newSocket = socket => {
  newSocketMap[socket.id] = {
    socket: socket,
  }
}

module.exports.deleteSocket = async (socket) => {
  if (newSocketMap.hasOwnProperty(socket.id)) {
    delete newSocketMap[socket.id];
    dumpSockets('after deleteSocket - newSocketMap');
    return;
  }
  if (heroSocketMap.hasOwnProperty(socket.id)) {
    //mark hero unavailable/offline
    try {
      const hero = await Hero.findById(heroSocketMap[socket.id].id);
      await hero.update({loginStatus: 'offline', presenceStatus: 'unavailable', state: 'IDLE'})
    } catch (err) {
      console.log('error marking hero offline:', err)
      //fall through and at least try to clean up map
    }

    delete heroSocketMap[socket.id];
    dumpSockets('after deleteSocket - hero');
    return;
  }
  if (citizenSocketMap.hasOwnProperty(socket.id)) {
    //mark citizen IDLE
    try {
      const citizen = await Citizen.findById(citizenSocketMap[socket.id].id);
      await citizen.update({state: 'IDLE'})
    } catch (err) {
      console.log('error marking citizen IDLE:', err)
      //fall through and at least try to clean up map
    }

    delete citizenSocketMap[socket.id];
    dumpSockets('after deleteSocket - citizen')
  }
}

//we know socket is a hero -- move it to appropriate map
module.exports.promoteSocketToHero = (socketId,heroId) => {
  if (newSocketMap.hasOwnProperty(socketId)) {
    heroSocketMap[socketId]=newSocketMap[socketId];
    heroSocketMap[socketId].id=heroId;
    delete newSocketMap[socketId];
  } else {
    throw new Error('promoteSocketToHero: socket id ',socketId,' not found')
  }
  dumpSockets('after promoteSocketToHero');
}

module.exports.promoteSocketToCitizen = (socketId,citizenId) => {
  if (newSocketMap.hasOwnProperty(socketId)) {
    citizenSocketMap[socketId]=newSocketMap[socketId];
    citizenSocketMap[socketId].id=citizenId;
    delete newSocketMap[socketId];
  } else {
    throw new Error('promoteSocketToCitizen: socket id ',socketId,' not found')
  }
  dumpSockets('after promoteSocketToCitizen')
}

function dumpSockets(desc) {
  console.log(desc)
  console.log('-newSocketMap: ',Object.keys(newSocketMap));
  console.log('-heroSocketMap: ',Object.keys(heroSocketMap));
  console.log('-citizenSocketMap: ',Object.keys(citizenSocketMap));
}
