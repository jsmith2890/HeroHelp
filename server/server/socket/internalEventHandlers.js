const {Citizen,Hero,User,Incident} = require('../db/models')

// map of incidents currently dispatching
const dispatchingIncidents = {}

//dispatch processing
async function doDispatch (incidentId) {
  console.log('doDispatch invoked with incidentId',incidentId)

  //first see if incident has a hero queue in dispatch
  if (dispatchingIncidents.hasOwnProperty(incidentId)) {
    //pick off next hero and ask them to take incident
  }

  //need to get a list of available superheros
  const availableHeros = await Hero.findAll();
}

module.exports.queueIncidentDispatch = (incidentId) => {
  setTimeout(()=>{doDispatch(incidentId)},0)
}
