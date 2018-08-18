const {Citizen, Hero, User} = require('../db/models')

//socket maps, mapping with key socketid and {socket, owner.id (hero or citizen)}
//and vice-versa, but don't need that for new sockets
const newSocketMap = {} //no owner yet, pending assignment to citizen or hero
const heroSocketMap = {}
const citizenSocketMap = {}
const socketHeroMap = {}
const socketCitizenMap = {}

module.exports.getHeroIdFromSocket = socketId => {
  if (heroSocketMap.hasOwnProperty(socketId)) {
    return heroSocketMap[socketId].id
  }
  throw new Error('hero socket not found: ', socketId)
}

module.exports.getSocketFromHeroId = heroId => {
  console.log('getSocketFromHeroId',heroId)
  if (socketHeroMap.hasOwnProperty(heroId)) {
    const entry = socketHeroMap[heroId];
    return entry.socket
  }
  throw new Error('socket for hero not found: ',heroId)
}

module.exports.getCitizenIdFromSocket = socketId => {
  if (citizenSocketMap.hasOwnProperty(socketId)) {
    return citizenSocketMap[socketId].id
  }
  throw new Error('citizen socket not found: ', socketId)
}

module.exports.getSocketFromCitizenId = citizenId => {
  console.log('get socket from citizen',citizenId)
  if (socketCitizenMap.hasOwnProperty(citizenId)) {
    const entry = socketCitizenMap[citizenId];
    return entry.socket
  }
  throw new Error('socket for citizen not found: ',citizenId)
}

module.exports.newSocket = socket => {
  newSocketMap[socket.id] = {
    socket: socket
  }
}

module.exports.deleteSocket = async socket => {
  if (newSocketMap.hasOwnProperty(socket.id)) {
    delete newSocketMap[socket.id]
    printSockets('after deleteSocket - newSocketMap')
    return
  }
  if (heroSocketMap.hasOwnProperty(socket.id)) {
    //mark hero unavailable/offline
    let hero;
    try {
      hero = await Hero.findById(heroSocketMap[socket.id].id)
      await hero.update({
        loginStatus: 'offline',
        presenceStatus: 'unavailable',
        state: 'IDLE'
      })
      //TODO:  IDLE may not be best, should handle login after dropped cxn, also, how to handle the situation where superhero got offed on the way over and need to redispatch.....?????
    } catch (err) {
      console.log('error marking hero offline:', err)
      //fall through and at least try to clean up map
    }

    delete heroSocketMap[socket.id]
    delete socketHeroMap[hero.id]
    printSockets('after deleteSocket - hero')
    return
  }
  let citizen;
  if (citizenSocketMap.hasOwnProperty(socket.id)) {
    //mark citizen IDLE
    try {
      citizen = await Citizen.findById(citizenSocketMap[socket.id].id)
      await citizen.update({state: 'IDLE'})
      //TODO:  This doesn't take into account reconnection
    } catch (err) {
      console.log('error marking citizen IDLE:', err)
      //fall through and at least try to clean up map
    }

    delete citizenSocketMap[socket.id]
    delete socketCitizenMap[citizen.id]
    printSockets('after deleteSocket - citizen')
  }
}

//we know socket is a hero -- move it to appropriate map
module.exports.promoteSocketToHero = (socketId, heroId) => {
  if (newSocketMap.hasOwnProperty(socketId)) {
    heroSocketMap[socketId] = newSocketMap[socketId]
    heroSocketMap[socketId].id = heroId
    socketHeroMap[heroId]=newSocketMap[socketId]
    delete newSocketMap[socketId]
  } else {
    throw new Error('promoteSocketToHero: socket id ', socketId, ' not found')
  }
  printSockets('after promoteSocketToHero')
}

module.exports.promoteSocketToCitizen = (socketId, citizenId) => {
  if (newSocketMap.hasOwnProperty(socketId)) {
    citizenSocketMap[socketId] = newSocketMap[socketId]
    citizenSocketMap[socketId].id = citizenId
    socketCitizenMap[citizenId] = newSocketMap[socketId]
    delete newSocketMap[socketId]
  } else {
    throw new Error(
      'promoteSocketToCitizen: socket id ',
      socketId,
      ' not found'
    )
  }
  printSockets('after promoteSocketToCitizen')
}

function printSockets(desc) {
  console.log(desc)
  console.log('-newSocketMap: ', Object.keys(newSocketMap))
  console.log('-heroSocketMap: ', Object.keys(heroSocketMap))
  console.log('-citizenSocketMap: ', Object.keys(citizenSocketMap))
  console.log('-socketHeroMap: ', Object.keys(socketHeroMap))
  console.log('-socketCitizenMap: ', Object.keys(socketCitizenMap))
}
