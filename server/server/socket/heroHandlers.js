const {HeroSends, IncidentState} = require('./MsgType')
// const {  } = require('./citizenSenders');
const {sendDispatchToHero,sendAckHeartbeatToHero} = require('./heroSenders')

const { getHeroIdFromSocket } = require('./socketMaps')

const {Citizen,Hero,User,Incident,setIncidentDistance} = require('../db/models')

module.exports.registerHeroHandlers = socket => {

  // availabilityStatus ("available", "unavailable")
  socket.on(HeroSends.GIVE_HEARTBEAT, async (msgBody) => {

    let hero;
    try {
      //get hero
      const heroId = getHeroIdFromSocket(socket.id);
      hero = await Hero.findById(heroId);

      //update hero location/status in db
      await hero.update({lat:msgBody.lat,lon:msgBody.lon,presenceStatus:status})

      //find incidents
      const incidents = Incident.findAll();
      //incidents.forEach(incident=>setIncidentDistance(incident,msgBody.lat,msgBody.lon))
    } catch (err) {

    }



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






    //   // Save the heartbeat info for the hero (check if available)
    //   // Check if the hero is associated with an Incident and what's the status of that incident
    //   const incidentState = 'todo'
    //   const heroIsCloseToIncident = false
    //   if (incidentState === IncidentState.HERO_ENROUTE && heroIsCloseToIncident) {
    //     // Transition incident to next state (prob go to DB)
    //     incident.state = IncidentState.HERO_ON_SITE

    //     // Notify both the hero and citizen that HERO_IS_ON_SITE

    //   } else {
    //     // Just update hero's location and availability (in the DB)
    //   }
    // } catch (err) {
    //   console.error(err)
    //}
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
