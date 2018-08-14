const {HeroSends, IncidentState} = require('./MsgType')
// const {  } = require('./citizenSenders');
const {sendDispatchToHero} = require('./heroSenders')

module.exports.registerHeroHandlers = socket => {

  // availabilityStatus ("available", "unavailable")
  socket.on(HeroSends.GIVE_HEARTBEAT, (lat, lon, availabilityStatus) => {
    try {
      // Save the heartbeat info for the hero (check if available)
      // Check if the hero is associated with an Incident and what's the status of that incident
      const incidentState = 'todo'
      const heroIsCloseToIncident = false
      if (incidentState === IncidentState.HERO_ENROUTE && heroIsCloseToIncident) {
        // Transition incident to next state (prob go to DB)
        incident.state = IncidentState.HERO_ON_SITE

        // Notify both the hero and citizen that HERO_IS_ON_SITE

      } else {
        // Just update hero's location and availability (in the DB)
      }
    } catch (err) {
      console.error(err)
    }
  })

  // decision ("accepted", "declined")
  socket.on(HeroSends.TELL_DISPATCH_DECISION, (incidentId, decision) => {
    try {
      console.log('Received TELL_DISPATCH_DECISION msg from hero. incidentId:', incidentId, 'decision:', decision)
      //
      // handleAskForHeroHelp(socket, citizenId, lat, lon)
    } catch (err) {
      console.error(err)
    }
  })

  socket.on(HeroSends.ASK_RESOLVE_INCIDENT, (citizenId, lat, lon) => {
    try {
      // handleAskForHeroHelp(socket, citizenId, lat, lon)
    } catch (err) {
      console.error(err)
    }
  })

}
