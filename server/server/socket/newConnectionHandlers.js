const {NewSocketSends, IncidentState, CitizenState} = require('./MsgType')
// const {  } = require('./citizenSenders');
const {sendTellHero, sendTellCitizen} = require('./newConnectionSenders')

const {Citizen, Hero, User} = require('../db/models')

const {
  deleteSocket,
  promoteSocketToHero,
  promoteSocketToCitizen
} = require('./socketMaps')

const {registerCitizenHandlers} = require('./citizenHandlers')
const {registerHeroHandlers} = require('./heroHandlers')

// Handle incoming messages from Citizens
module.exports.registerNewConnectionHandlers = socket => {
  socket.on(NewSocketSends.ASK_TO_BE_HERO, async ({emailAddr})=> {
    console.log('ASK_TO_BE_HERO received')
    try {
      //find hero by email, then find the hero entry in db and mark 'online'
      const user = await User.findOne({
        where: {email: emailAddr}
      })

      if (!user) {
        throw new Error('Unknown email:', emailAddr)
      }

      const hero = await Hero.findOne({
        where: {userId: user.id}
      })

      await hero.update({loginStatus: 'online'})

      //upgrade to hero
      promoteSocketToHero(socket.id, hero.id)
      registerHeroHandlers(socket)
      sendTellHero(socket)

    } catch (err) {
      //auth failed -- drop cxn
      console.log('ASK_TO_BE_HERO error encountered - dropping cxn', err)
      socket.disconnect()
      deleteSocket(socket.id)
    }
  })

  socket.on(NewSocketSends.ASK_TO_BE_CITIZEN, async ({citizenId}) => {
    console.log('ASK_TO_BE_CITIZEN received', citizenId)
    //find citizen by id -- if exists, great, if not, create one
    //note -- basically a somewhat less RESTful POST here ;-)
    let needNewCitizen = false

    if (!citizenId) {
      needNewCitizen = true
    }

    let citizen
    //note: try{} inside of if() statement because not a real error if not-found
    if (!needNewCitizen) {
      try {
        citizen = await Citizen.findById(citizenId)
        //note -- could be reconnecting so if citizen already dealing with incident, leave state alone through this function
        //null can also come back if not found
        if (citizen === null) {
          needNewCitizen=true;
        }
      } catch (err) {
        needNewCitizen = true
      }
    }

    try {
      if (needNewCitizen) {
        console.log('creating new citizen')
        citizen = await Citizen.create({state: CitizenState.IDLE})
      }
    } catch (err) {
      //db failure -- drop cxn
      console.log('ASK_TO_BE_CITIZEN error encountered - dropping cxn', err)
      socket.disconnect()
      deleteSocket(socket.id)
    }
    promoteSocketToCitizen(socket.id, citizen.id)
    registerCitizenHandlers(socket)
    sendTellCitizen(socket, citizen.id)
  })
}
