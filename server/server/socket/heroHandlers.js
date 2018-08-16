const {HeroSends, IncidentState, HeroState, CitizenState} = require('./MsgType')
const {
  sendDispatchToHero,
  sendAckDispatchDecisionToHero,
  sendAckHeartbeatToHero,
  sendHeroOnSiteToHero,
  sendAckResolveIncidentToHero
} = require('./heroSenders')
const {
  sendHeroOnSiteToCitizen,
  sendHeroEnrouteToCitizen,
  sendIncidentResolvedToCitizen
} = require('./citizenSenders')

const {getHeroIdFromSocket, getSocketFromCitizenId} = require('./socketMaps')

const {Citizen, Hero, User, Incident} = require('../db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const {setIncidentDistance, distanceTwoPoints} = require('./util')

// Utility function
async function getHeroIncidentCitizen(heroSocketId) {
  const heroId = getHeroIdFromSocket(heroSocketId)
  const hero = await Hero.findById(heroId)
  const incident = await Incident.findOne({
    where: {
      state: {[Op.ne]: IncidentState.RESOLVED},
      heroId: hero.id
    }
  })
  const citizen = await Citizen.findOne(incident.citizenId)
  return [hero, incident, citizen]
}

// Used when processing a Hero's Heartbeat message
async function getNearbyIncidents(heroId, lat, lon, maxResults = 10) {
  const heroIncidentList = []
  //find incidents nearby not assigned to hero and not closed
  const incidents = await Incident.findAll({
    where: {
      state: {[Op.ne]: IncidentState.RESOLVED},
      heroId: {
        [Op.or]: {
          [Op.ne]: heroId,
          [Op.eq]: null
        }
      }
    }
  })
  incidents.forEach(incident => setIncidentDistance(incident, lat, lon))

  incidents.sort((a, b) => {
    if (a.distance < b.distance) {
      return -1
    }
    if (a.distance > b.distance) {
      return 1
    }
    return 0
  })

  //generate output for hero's phone, just N closest incidents
  const limit = Math.min(incidents.length, maxResults)

  for (let i = 0; i < limit; i++) {
    heroIncidentList.push({lat: incidents[i].lat, lon: incidents[i].lon})
  }
  return heroIncidentList
}

// Used when processing a Hero's Heartbeat message
async function processIfHeroOnSite(socket, hero, lat, lon) {
  // Only process is hero is en-route
  if (hero.state !== HeroState.ENROUTE) {
    return
  }

  const distanceForOnSite = 0.1 // .1 km is 100 meters
  console.log(`Retrieving hero's incident...`)
  // Get the incident associated with the hero
  const incident = await Incident.findOne({
    where: {
      state: IncidentState.HERO_ENROUTE,
      heroId: hero.id
    }
  })
  const dist = Math.abs(distanceTwoPoints(lat, lon, incident.lat, incident.lon))
  console.log(
    `Hero on site? Hero Pos: [${lat}, ${lon}]. Incident Pos [${incident.lat}, ${
      incident.lon
    }]`
  )
  if (dist <= distanceForOnSite) {
    // Update entities to reflect Hero is on site
    await hero.update({state: HeroState.ON_SITE})
    await incident.update({state: IncidentState.HERO_ON_SITE})
    const citizen = await Citizen.findById(incident.citizenId)
    await citizen.update({state: CitizenState.KNOWS_HERO_ON_SITE})

    // Notify hero and citizen
    sendHeroOnSiteToHero(socket, lat, lon)
    const citizenSocket = getSocketFromCitizenId(incident.citizenId)
    sendHeroOnSiteToCitizen(citizenSocket, lat, lon)
  }
}

module.exports.registerHeroHandlers = socket => {
  socket.on(HeroSends.GIVE_HEARTBEAT, async msgBody => {
    console.log('GIVE_HEARTBEAT received.')
    const {lat, lon, status} = msgBody

    const heroIncidentList = []
    try {
      //get hero
      const heroId = getHeroIdFromSocket(socket.id)
      const hero = await Hero.findById(heroId)

      //update hero location/status in db
      await hero.update({
        presenceLat: lat,
        presenceLon: lon,
        presenceStatus: status
      })

      //find incidents nearby not assigned to hero and not closed
      heroIncidentList.concat(getNearbyIncidents(heroId, lat, lon, 10))

      // Check if hero is ENROUTE and close enough to the incident site
      processIfHeroOnSite(socket, hero, lat, lon)
    } catch (err) {
      console.log(' Error processing GIVE_HEARTBEAT', err)
    }
    sendAckHeartbeatToHero(socket, heroIncidentList)

    //       superhero-hb
    // -set location and status in db
    // -if superhero is not servicing an incident (dispatch/en-route/on-site)
    // --send superhero-hb-ack with 10 nearest active incidents to display
    // -if superhero is dispatched or assigned in db
    // --send superhero-hb-ack with current incident
    // --if not on-site and within epsilon distance of incident
    // ---transition superhero to arrived in db
    // ---send 'superhero-arriving' to subscribed civilians
    // ---send ‘on-site’ to superhero
    // --else
    // ---send 'superhero-on-the-way' with new location to subscribed civilians
  })

  // decision ("accepted", "declined")
  socket.on(HeroSends.TELL_DISPATCH_DECISION, async (incidentId, decision) => {
    try {
      console.log(
        'Received TELL_DISPATCH_DECISION msg from hero. incidentId:',
        incidentId,
        'decision:',
        decision
      )
      if (decision !== 'reject' && decision !== 'accept') {
        throw new Error('Unknown decision:', decision)
      }
      if (decision === 'reject') {
        throw new Error('Not implemented yet')
      }
      // Update Entities involved with incident (Citizen, Incident, Hero)
      const [hero, incident, citizen] = getHeroIncidentCitizen(socket.id)
      await hero.update({state: HeroState.ENROUTE})
      await incident.update({state: IncidentState.HERO_ENROUTE})
      await citizen.update({state: CitizenState.KNOWS_HERO_ENROUTE})

      // Notify Hero and Citizen
      sendAckDispatchDecisionToHero(
        socket,
        incident.lat,
        incident.lon,
        incident.id
      )
      const citizenSocket = getSocketFromCitizenId(incident.citizenId)
      sendHeroEnrouteToCitizen(
        citizenSocket,
        hero.presenceLat,
        hero.presenceLon,
        hero.imageUrl,
        hero.name
      )
    } catch (err) {
      console.error(err)
    }
  })

  socket.on(HeroSends.ASK_RESOLVE_INCIDENT, async incidentId => {
    try {
      console.log(
        'Received ASK_RESOLVE_INCIDENT msg from hero. incidentId:',
        incidentId
      )
      // Update Entities involved with incident (Citizen, Incident, Hero)
      const [hero, incident, citizen] = getHeroIncidentCitizen(socket.id)
      await hero.update({state: HeroState.IDLE})
      await incident.update({state: IncidentState.RESOLVED})
      await citizen.update({state: CitizenState.IDLE})

      // Notify Hero and Citizen
      sendAckResolveIncidentToHero(socket)
      const citizenSocket = getSocketFromCitizenId(incident.citizenId)
      sendIncidentResolvedToCitizen(citizenSocket)
    } catch (err) {
      console.error(err)
    }
  })
}
