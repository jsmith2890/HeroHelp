const {Citizen,Hero,User,Incident} = require('../db/models')
const {setHeroDistance} = require('./util')

// map of incidents currently dispatching
const dispatchingIncidents = {}

//dispatch processing
async function doDispatch (incidentId) {
  console.log('doDispatch invoked with incidentId',incidentId)

  //get a copy of the incident
  const incident = await Incident.findById(incidentId)

  //first see if incident has a hero queue in dispatch
  if (dispatchingIncidents.hasOwnProperty(incidentId)) {
    //pick off next hero and ask them to take incident
  }

  //need to get a list of available superheros
  const availableHeros = await Hero.findAll({where: {
      state: 'IDLE'
    }
  });

  availableHeros.forEach(hero=>setHeroDistance(hero,incident.lat,incident.lon))

      availableHeros.sort((a,b)=>{
        if (a.distance<b.distance) {return -1}
        if (a.distance>b.distance) {return 1}
        return 0;
      })

}

module.exports.queueIncidentDispatch = (incidentId) => {
  setTimeout(()=>{doDispatch(incidentId)},0)
}
