const {NewSocketSends, IncidentState} = require('./MsgType')
// const {  } = require('./citizenSenders');
const {sendTellHero} = require('./newConnectionSenders')

const {Citizen,Hero} = require('../db/models')

// ule.exports.NewSocketSends = {
//   ASK_AS_HERO: "ASK_AS_HERO", //token passed to hero on 200 OK LOGIN
//   REGISTER_AS_CITIZEN: "REGISTER_AS_CITIZEN", //new instance
//   ASK_AS_CITIZEN: "ASK_AS_CITIZEN", //token saved by app instance
// }

// Handle incoming messages from Citizens
module.exports.registerNewConnectionHandlers = socket => {

  socket.on(NewSocketSends.ASK_TO_BE_HERO, (token) => {
    console.log('ASK_TO_BE_HERO received')
    try {
    //  const hero = await Hero.findOne({
        //where: {socketHash: token }
      //})

      //upgrade to hero
      sendTellHero(this);

    } catch (err) {
      console.error(err)
    }
  })

  socket.on(NewSocketSends.REGISTER_AS_CITIZEN, () => {
    console.log('REGISTER_AS_CITIZEN received');
  })

  socket.on(NewSocketSends.ASK_TO_BE_CITIZEN, (id) => {
    console.log('ASK_TO_BE_CITIZEN received');
  })

}
