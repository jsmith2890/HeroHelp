const {NewSocketSends, IncidentState} = require('./MsgType')
// const {  } = require('./citizenSenders');
const {sendTellHero,sendTellCitizen} = require('./newConnectionSenders')

const {Citizen,Hero,User} = require('../db/models')

const {deleteSocket,promoteSocketToHero,promoteSocketToCitizen} = require ('./socketMaps')

const { registerCitizenHandlers } = require('./citizenHandlers')
const { registerHeroHandlers } = require('./heroHandlers');

// Handle incoming messages from Citizens
module.exports.registerNewConnectionHandlers = socket => {

  socket.on(NewSocketSends.ASK_TO_BE_HERO, async (msgBody) => {
    console.log('ASK_TO_BE_HERO received')
    try {

      //find hero by email, then find the hero entry in db and mark 'online'
      const user = await User.findOne({where:
        {email: msgBody.emailAddr}
      })

      const hero = await Hero.findOne({where:
        {userId: user.id}
      })

      await hero.update({loginStatus: 'online'})

      //upgrade to hero
      promoteSocketToHero(socket.id,hero.id)
      sendTellHero(socket);
      registerHeroHandlers(socket);

    } catch (err) {
      //auth failed -- drop cxn
      console.log('ASK_TO_BE_HERO error encountered - dropping cxn', err)
      socket.disconnect()
      deleteSocket(socket.id);
    }
  })

  socket.on(NewSocketSends.ASK_TO_BE_CITIZEN, async (msgBody) => {
    console.log('ASK_TO_BE_CITIZEN received',msgBody);
    //find citizen by id -- if exists, great, if not, create one
    //note -- basically a somewhat less RESTful POST here ;-)
    let needNewCitizen = false;

    if (msgBody.hasOwnProperty('citizenId')===false) {
      needNewCitizen = true;
    }

    let citizen;
    //note: try{} inside of if() statement because not a real error if not-found
    if (needNewCitizen===false) {
      try {
        citizen = await Citizen.findById(msgBody.citizenId)
        await citizen.update({state:'IDLE'})
      } catch (err) {
        needNewCitizen = true;
      }
    }

    try {
      if (needNewCitizen) {
        citizen = await Citizen.create({state:'IDLE'})
      }
    } catch (err) {
      //db failure -- drop cxn
      console.log('ASK_TO_BE_CITIZEN error encountered - dropping cxn', err)
      socket.disconnect();
      deleteSocket(socket.id);
    }
    promoteSocketToCitizen(socket.id,citizen.id)
    sendTellCitizen(socket,citizen.id);
    registerCitizenHandlers(socket);
  })
}
