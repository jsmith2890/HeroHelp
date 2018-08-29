const { HeroSends, IncidentState, HeroState, CitizenState } = require('./MsgType')
const {

  sendHeroOnSiteToHero,
  sendAckResolveIncidentToHero,
  sendAckHeartbeatToHero
} = require('./heroSenders')
const {
  sendHeroOnSiteToCitizen,
  sendHeroEnrouteToCitizen,
  sendIncidentResolvedToCitizen
} = require('./citizenSenders')

const { getHeroIdFromSocket, getSocketFromCitizenId } = require('./socketMaps')

const { Citizen, Hero, Incident } = require('../db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { setIncidentDistance, distanceTwoPoints } = require('./util')

// Utility function
async function getHeroIncidentCitizen(heroSocketId) {
  const heroId = getHeroIdFromSocket(heroSocketId)
  const hero = await Hero.findById(heroId)
  const incident = await Incident.findOne({
    where: {
      state: { [Op.ne]: IncidentState.RESOLVED },
      heroId: hero.id
    }
  })
  if (!incident) {
    throw new Error('No open incident with heroId:', heroId)
  }
  const citizen = await Citizen.findById(incident.citizenId)
  return [hero, incident, citizen]
}

// Used when processing a Hero's Heartbeat message
async function getNearbyIncidents(heroId, lat, lon, maxResults = 10) {
  const heroIncidentList = []
  //find incidents nearby not assigned to hero and not closed
  const incidents = await Incident.findAll({
    where: {
      state: { [Op.ne]: IncidentState.RESOLVED },
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
    heroIncidentList.push({ lat: incidents[i].lat, lon: incidents[i].lon })
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
  const dist = distanceTwoPoints(lat, lon, incident.lat, incident.lon)
  console.log(
    `Hero is ENROUTE. Hero Pos: [${lat}, ${lon}]. Incident Pos [${incident.lat}, ${
    incident.lon
    }]`
  )
  if (dist <= distanceForOnSite) {
    console.log('Hero is on site. Updating DB.')
    // Update entities to reflect Hero is on site
    await hero.update({ state: HeroState.ON_SITE })
    await incident.update({ state: IncidentState.HERO_ON_SITE })
    const citizen = await Citizen.findById(incident.citizenId)
    await citizen.update({ state: CitizenState.KNOWS_HERO_ON_SITE })

    console.log('Hero is on site. Notifying hero and citizen.')
    // Notify hero and citizen
    sendHeroOnSiteToHero(socket)
    const citizenSocket = getSocketFromCitizenId(incident.citizenId)
    sendHeroOnSiteToCitizen(citizenSocket, lat, lon)
    return true
  }
  return false
}

module.exports.registerHeroHandlers = socket => {
  socket.on(HeroSends.GIVE_HEARTBEAT, async msgBody => {
    console.log('GIVE_HEARTBEAT received. ', msgBody)
    const { lat, lon, status } = msgBody

    let heroIncidentList = []
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
      heroIncidentList = await getNearbyIncidents(heroId, lat, lon, 10)

      // Check if hero is ENROUTE and close enough to the incident site
      const isOnSite = await processIfHeroOnSite(socket, hero, lat, lon)

      if (!isOnSite && hero.state === HeroState.ENROUTE) {
        const [, , citizen] = await getHeroIncidentCitizen(socket.id)
        // ****Does not take into account that citizen may have been disconnected while incident is in progress
        const citizenSocket = getSocketFromCitizenId(citizen.id)
        sendHeroEnrouteToCitizen(
          citizenSocket,
          lat,
          lon,
          hero.imageUrl,
          hero.name
        )
      }
    } catch (err) {
      console.log(' Error processing GIVE_HEARTBEAT', err)
    }
    sendAckHeartbeatToHero(socket, heroIncidentList)

  })

  socket.on(HeroSends.ASK_RESOLVE_INCIDENT, async payload => {
    try {
      console.log(
        'Received ASK_RESOLVE_INCIDENT msg from hero. payload:',
        payload
      )
      // Update Entities involved with incident (Citizen, Incident, Hero)
      const [hero, incident, citizen] = await getHeroIncidentCitizen(socket.id)
      await hero.update({ state: HeroState.IDLE })
      await incident.update({ state: IncidentState.RESOLVED })
      await citizen.update({ state: CitizenState.IDLE })

      // Notify Hero and Citizen
      sendAckResolveIncidentToHero(socket)
      const citizenSocket = getSocketFromCitizenId(incident.citizenId)
      sendIncidentResolvedToCitizen(citizenSocket)
    } catch (err) {
      console.error(err)
    }
  })
}
