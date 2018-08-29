const {
  CitizenSends,
  IncidentState,
  CitizenState
} = require('./MsgType')
const {sendAckHelpRequestToCitizen} = require('./citizenSenders')

const {queueIncidentDispatch} = require('./internalEventHandlers')
const {getCitizenIdFromSocket } = require('./socketMaps')

const {Citizen, Incident} = require('../db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// Handle incoming messages from Citizens
module.exports.registerCitizenHandlers = socket => {
  socket.on(CitizenSends.ASK_FOR_HERO_HELP, async msgBody => {
    console.log('ASK_FOR_HERO_HELP received.')
    const {lat, lon} = msgBody
    const citizenId = getCitizenIdFromSocket(socket.id)

    let incident
    let needNewIncident = true
    try {
      //check if citizen is already linked to an incident
      incident = await Incident.findOne({
        where: {
          state: {[Op.ne]: IncidentState.RESOLVED},
          citizenId
        }
      })
      console.log('found active incident for citizen', incident)
      if (incident) {
        needNewIncident = false
      }
    } catch (err) {
      //fall through, try to create incident and have error happen there
    }

    //if need new incident, then create it and queue dispatching
    try {
      if (needNewIncident) {
        console.log('need new incident')
        incident = await Incident.create({
          citizenId,
          lat,
          lon,
          state: IncidentState.WAITING_FOR_DISPATCH
        })
      }
      queueIncidentDispatch(incident.id,0)

      // Update entities in DB
      const citizen = await Citizen.findById(citizenId)
      await citizen.update({state: CitizenState.WAIT_FOR_HERO_DISPATCH})

      // Notify Citizen
      sendAckHelpRequestToCitizen(socket)

    } catch (err) {
      console.log('unable to create incident', err)
      //citizen won't get response if can't create incident
    }
  })
}
