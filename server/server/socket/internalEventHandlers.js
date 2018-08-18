const {Citizen,Hero,User,Incident} = require('../db/models')
const {setHeroDistance} = require('./util')
const Sequelize = require('sequelize')
const {sendHeroEnrouteToCitizen} = require('./citizenSenders')
const {sendDispatchToHero} = require('./heroSenders')
const {getSocketFromHeroId,getSocketFromCitizenId} = require('./socketMaps')
const {IncidentState,HeroState,CitizenState} = require('./MsgType.js')

module.exports.queueIncidentDispatch = (incidentId,timeout /*ms*/) => {
  setTimeout(()=>{doDispatch(incidentId)},timeout)
}

//dispatch processing
async function doDispatch (incidentId) {
  console.log('doDispatch invoked with incidentId',incidentId)

  let incident;
  let availableHeros;
  let citizen;
  //try-catch for reading everything from db
  try {
    //get the incident
    incident = await Incident.findById(incidentId)

    //need to get a list of available superheros
    availableHeros = await Hero.findAll({where: {
      state: 'IDLE',
      presenceStatus: 'available'
    }})

    //go ahead and get citizen now, assuming all will be well
    citizen = await Citizen.findById(incident.citizenId);

  } catch (err) {
    console.error('dispatch - error getting heros or incident from db', err);
    module.exports.queueIncidentDispatch(incidentId,1000);
    return
  }

  //if no heros, then lets just queue up another event giving
  //the rest of the world a chance to catch up and hopefully
  //there's an event coming soon from a hero becoming available
  if (availableHeros.length===0) {
    console.log('no available heros - sleep(1000)')
    module.exports.queueIncidentDispatch(incidentId,1000);
    return
  }

  //ok - we have everything we need - let's assign the hero
  //to the incident and tell everyone that needs to know

  //sort heros by distance to find closest one
  availableHeros.forEach(hero=>setHeroDistance(hero,incident.lat,incident.lon))

  availableHeros.sort((a,b)=>{
    if (a.distance<b.distance) {return -1}
    if (a.distance>b.distance) {return 1}
    return 0;
  })
  //again, we know we have at least 1
  const hero=availableHeros[0];

  //first hero is closest, assign to incident, use transaction
  //let transaction;
  try {
    //transaction = await Sequelize.transaction();
    await incident.update({heroId:hero.id, state:IncidentState.HERO_ENROUTE},/*{transaction}*/)
    await hero.update({state:HeroState.ENROUTE},/*{transaction}*/)
    await citizen.update({state:CitizenState.KNOWS_HERO_ENROUTE},/*{transaction}*/)
    //await transaction.commit();
  } catch (err) {
    //await transaction.rollback();
    //try again later......
    module.exports.queueIncidentDispatch(incidentId,1000);
    return
  }

  //database succeeded -- now send out to hero and citizen
  //heroSocketId = findHeroSocket()

  sendHeroEnrouteToCitizen(getSocketFromCitizenId(citizen.id), hero.presenceLat, hero.presenceLon, hero.imageUrl,hero.name);

  console.log('hero:',hero)
  console.log('-->sending dispatch')
  sendDispatchToHero(getSocketFromHeroId(hero.id),incident.lat,incident.lon)

}
