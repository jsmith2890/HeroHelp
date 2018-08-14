const {CitizenSends, IncidentState} = require('./MsgType')
// const {  } = require('./citizenSenders');
const {sendDispatchToHero} = require('./heroSenders')


// Handle incoming messages from Citizens
module.exports.registerCitizenHandlers = socket => {

  socket.on(CitizenSends.ASK_FOR_HERO_HELP, (citizenId, lat, lon) => {
    try {
      console.log('ASK_FOR_HERO_HELP received.');
      // Find available heroes in the area based on geoLoc
      // Send dispatch to hero
      //
      const heroSocket = ''
      const incidentData = ''
      sendDispatchToHero(heroSocket, incidentData)
    } catch (err) {
      console.error(err)
    }
  })

}
