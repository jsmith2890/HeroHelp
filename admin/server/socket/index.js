const {Hero, Citizen, Incident} = require('../db/models')

// socketId => socket
const socketMap = {}

// Global data to send to client
let heroes = []
let citizens = []
let incidents = []

// Global timer loop that polls the db and sends the data to all listening clients
const pollDBForData = async () => {
  try {
    heroes = await Hero.findAll()
    citizens = await Citizen.findAll()
    incidents = await Incident.findAll({ include: [{all: true, nested: true}]})
    console.log(`Polled DB for data. Got ${heroes.length} heroes, ${citizens.length} citizens, ${incidents.length} incidents`)

    // Send to all clients
    Object.values(socketMap).forEach(socket => {
      try {
        socket.emit('DATA', { heroes, citizens, incidents })
      } catch (err) {
        // If sending to a client produces an error, still want to try
        // sending to other clients
        console.error(err)
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const pollHandle = setInterval(pollDBForData, 1000)

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    // Save this socket
    socketMap[socket.id] = socket

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
      // Remove them from the socketMap
      delete socketMap[socket.id]
    })
  })
}
