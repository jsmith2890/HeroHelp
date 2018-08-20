import io from 'socket.io-client'
import {AsyncStorage} from 'react-native'
import {Constants, Location, Permissions} from 'expo'
import {ENV_PATH} from '../secrets'
import {
  ServerSendsToNewSocket,
  NewSocketSends,
  ServerSendsToCitizen,
  ServerSendsToHero,
  HeroSends,
  CitizenSends,
  CitizenState,
  HeroState
} from './MsgType'
import store from '../store'
import {
  gotNewIncident,
  statusHero,
  incidentsInArea,
  updatedHeroLocation
} from '../store/heroes'
import {heroEnroute, heroArrived, statusCitizen} from '../store/citizens'

// Verify that the Server websocket address is defined
if (!ENV_PATH) {
  console.log('You must specify ENV_PATH environment variable')
  process.exit(1)
}

// Of the form: http://55.5.5.5:8080
console.log('Creating a socket connection to server:', ENV_PATH)

const socket = io(ENV_PATH)

let availability = false //button to set available/unavailable

//special function on interval to send geoloation and available/unavailable
//status to server.
let heartbeatTimer = {}
export const giveHeartbeat = async () => {
  try {
    let {status} = await Permissions.askAsync(Permissions.LOCATION)
    //assume they say yes
    let location = await Location.getCurrentPositionAsync({})
    socket.emit(HeroSends.GIVE_HEARTBEAT, {
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      status: availability ? 'available' : 'unavailable'
    })
    store.dispatch(updatedHeroLocation(location.coords))
  } catch (error) {
    console.error('Ask To Be Hero didnt send', error)
  }
}

socket.on('connect', () => {
  console.log('websocket Connected!')
  //////////////////////////////////////////////////////////////////
  //New Socket establish connection and start heartbeating geolocation
  socket.on(ServerSendsToNewSocket.TELL_HERO, () => {
    console.log('received tell_hero')

    heartbeatTimer = setInterval(giveHeartbeat, 5000)
  })

  //New Socket establish connection
  socket.on(ServerSendsToNewSocket.TELL_CITIZEN, async ({citizenId}) => {
    console.log('received tell_citizen ', citizenId)
    try {
      await AsyncStorage.setItem('CITIZENID', citizenId.toString())
    } catch (err) {
      console.log('error saving citizenId', err)
    }
  })
  /////////////////////////////////////////////////////////////
  //Hero
  //no state change
  socket.on(ServerSendsToHero.ACK_RECEIVED_HEARTBEAT, ({incidents}) => {
    console.log('received ack hb', incidents)
    store.dispatch(incidentsInArea(incidents))
  })

  //hero is taking this, MVP has no accept or reject=> state: ENROUTE
  socket.on(ServerSendsToHero.GIVE_DISPATCH, ({lat, lon}) => {
    store.dispatch(gotNewIncident(lat, lon, HeroState.ENROUTE))
  })

  //=>state: ON_SITE
  socket.on(ServerSendsToHero.HERO_ON_SITE, () => {
    availability = false;
    store.dispatch(statusHero(HeroState.ON_SITE))
  })

  //=>state: IDLE
  socket.on(ServerSendsToHero.ACK_RESOLVE_INCIDENT, () => {
    store.dispatch(statusHero(HeroState.IDLE))
  })

  //////////////////////////////////////////////////////////
  //Citizen

  //=> state: WAIT_FOR_HERO_DISPATCH
  socket.on(ServerSendsToCitizen.ACK_RECEIVED_HELP_REQUEST, () => {
    store.dispatch(statusCitizen(CitizenState.WAIT_FOR_HERO_DISPATCH))
  })

  //=> state: KNOWS_HERO_ENROUTE
  socket.on(
    ServerSendsToCitizen.HERO_ENROUTE,
    ({lat, lon, heroImage, heroName}) => {
      store.dispatch(
        heroEnroute(
          lat,
          lon,
          heroImage,
          heroName,
          CitizenState.KNOWS_HERO_ENROUTE
        )
      )
    }
  )

  //=> state: KNOWS_HERO_ON_SITE
  socket.on(ServerSendsToCitizen.HERO_ON_SITE, ({lat, lon}) => {
    store.dispatch(heroArrived(lat, lon, CitizenState.KNOWS_HERO_ON_SITE))
  })

  //=> state: IDLE
  socket.on(ServerSendsToCitizen.INCIDENT_RESOLVED, () => {
    store.dispatch(statusCitizen(CitizenState.IDLE))
  })
})

////////////////////////////////////////////////////////////////
//Hero
export const askToBeHero = ({email}) => {
  try {
    socket.emit(NewSocketSends.ASK_TO_BE_HERO, {emailAddr: email})
  } catch (error) {
    console.error('Ask To Be Hero didnt send', error)
  }
}

export const isAvailable = availabilityStatus => {
  availability = availabilityStatus
  giveHeartbeat()
}

export const resolveIncident = () => {
  try {
    socket.emit(HeroSends.ASK_RESOLVE_INCIDENT, {})
  } catch (error) {
    console.error('Incident didnt resolve', error)
  }
}

///////////////////////////////////////////////////////////////////
//Citizen
export const askToBeCitizen = body => {
  try {
    socket.emit(NewSocketSends.ASK_TO_BE_CITIZEN, body)
  } catch (error) {
    console.error('Ask To Be Citizen didnt send', error)
  }
}

export const pushHelp = ({lat, lon}) => {
  try {
    socket.emit(CitizenSends.ASK_FOR_HERO_HELP, {lat, lon})
  } catch (error) {
    console.error('Didnt ask for help', error)
  }
}

export default socket
