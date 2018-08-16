import io from 'socket.io-client';
import { AsyncStorage } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { ENV_PATH } from '../secrets';
import {
  ServerSendsToNewSocket,
  NewSocketSends,
  ServerSendsToCitizen,
  ServerSendsToHero,
  HeroSends,
  CitizenSends,
  CitizenState,
  HeroState,
} from './MsgType';
import store from '../store';
import {
  gotNewIncident,
  changeIncidentStatus,
  incidentsInArea,
  statusEnrouteHero,
  statusDeciding,
  statusOnSiteHero,
} from '../store/heroes';
import {
  heroAssigned,
  heroArrived,
  incidentComplete,
  statusEnrouteCitizen,
  statusOnSiteCitizen,
  statusWait,
} from '../store/citizens';

// Verify that the Server websocket address is defined
if (!ENV_PATH) {
  console.log('You must specify ENV_PATH environment variable');
  process.exit(1);
}

// Of the form: http://55.5.5.5:8080
console.log('Creating a socket connection to server:', ENV_PATH);

const socket = io(ENV_PATH);


//special function on interval to send geoloation and available/unavailable
//status to server.
let heartbeatTimer={}
export const giveHeartbeat = async () => {
  try {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //assume they say yes
    let location = await Location.getCurrentPositionAsync({});
    socket.emit(HeroSends.GIVE_HEARTBEAT, {lat: location.coords.latitude, lon: location.coords.longitude, status:"available" });
  } catch (error) {
    console.error('Ask To Be Hero didnt send', error);
  }
};

socket.on('connect', () => {
  console.log('websocket Connected!');

  //New Socket establish connection and start heartbeating geolocation
  socket.on(ServerSendsToNewSocket.TELL_HERO, () => {
    console.log('received tell_hero');

    heartbeatTimer=setInterval(giveHeartbeat,5000)

  });

  //New Socket establish connection
  socket.on(ServerSendsToNewSocket.TELL_CITIZEN, async ({ citizenId }) => {
    console.log('received tell_citizen ', citizenId);
    try {
      await AsyncStorage.setItem('CITIZENID', citizenId.toString())
    } catch (err) {
      console.log('error saving citizenId', err)
    }
  });

  //Hero

  socket.on(ServerSendsToHero.ACK_RECEIVED_HEARTBEAT, ({ incidents }) => {
    console.log('received ack hb',incidents);
    store.dispatch(incidentsInArea(incidents));
  });

  socket.on(
    ServerSendsToHero.GIVE_DISPATCH,
    ({ lat, lon, incidentId, timeout, incidentInfo }) => {
      store.dispatch(
        gotNewIncident(lat, lon, incidentId, timeout, incidentInfo),
      );
    },
  );

  socket.on(ServerSendsToHero.HERO_ON_SITE, ({ incidentId }) => {
    store.dispatch(changeIncidentStatus(incidentId));
  });

  // socket.on(
  //   ServerSendsToHero.ACK_DISPATCH_DECISION,
  //   ({ lat, lon, incidentId }) => {
  //     store.dispatch(functionName(lat, lon, incidentId));
  //   },
  // );

  // socket.on(ServerSendsToHero.ACK_RESOLVE_INCIDENT, data => {
  //   store.dispatch(functionName(data));
  // });

  // socket.on(
  //   (ServerSendsToHero.GIVE_ERROR = data => {
  //     store.dispatch(functionName(data));
  //   }),
  // );

  // Hero Status

  socket.on(HeroState.DECIDING_ON_DISPATCH, status => {
    store.dispatch(statusDeciding(status));
  });

  socket.on(HeroState.ENROUTE, status => {
    store.dispatch(statusEnrouteHero(status));
  });

  socket.on(HeroState.ON_SITE, status => {
    store.dispatch(statusOnSiteHero(status));
  });

  //Citizen

  // socket.on(ServerSendsToCitizen.ACK_RECEIVED_HELP_REQUEST, () => {
  //   store.dispatch(changeIncidentStatus());
  // });

  socket.on(
    ServerSendsToCitizen.HERO_ENROUTE,
    ({ lat, lon, heroImage, heroName }) => {
      store.dispatch(heroAssigned(lat, lon, heroImage, heroName));
    },
  );

  // citizen status
  socket.on(ServerSendsToCitizen.HERO_ON_SITE, ({ lat, lon }) => {
    store.dispatch(heroArrived(lat, lon));
  });

  socket.on(ServerSendsToCitizen.INCIDENT_RESOLVED, () => {
    store.dispatch(incidentComplete());
  });

  socket.on(CitizenState.WAIT_FOR_HERO_DISPATCH, status => {
    store.dispatch(statusWait(status));
  });

  socket.on(CitizenState.KNOWS_HERO_ENROUTE, status => {
    store.dispatch(statusEnrouteCitizen(status));
  });

  socket.on(CitizenState.KNOWS_HERO_ON_SITE, status => {
    store.dispatch(statusOnSiteCitizen(status));
  });
});

//Hero
export const askToBeHero = ({ email }) => {
  try {
    socket.emit(NewSocketSends.ASK_TO_BE_HERO, { emailAddr: email });
  } catch (error) {
    console.error('Ask To Be Hero didnt send', error);
  }
};

export const isAvailable = ({ lat, lon, availabilityStatus }) => {
  try {
    socket.emit(HeroSends.GIVE_HEARTBEAT, { lat, lon, availabilityStatus });
  } catch (error) {
    console.error('Availability didnt send', error);
  }
};

export const sendDecision = ({ incidentId, decision }) => {
  try {
    socket.emit(HeroSends.TELL_DISPATCH_DECISION, { incidentId, decision });
  } catch (error) {
    console.error('Decision didnt send', error);
  }
};

export const resolveIncident = ({ incidentId }) => {
  try {
    socket.emit(HeroSends.ASK_RESOLVE_INCIDENT, { incidentId });
  } catch (error) {
    console.error('Incident didnt resolve', error);
  }
};

//Citizen
export const askToBeCitizen = (body) => {
  try {
    socket.emit(NewSocketSends.ASK_TO_BE_CITIZEN, body);
  } catch (error) {
    console.error('Ask To Be Citizen didnt send', error);
  }
};

export const pushHelp = ({ lat, lon }) => {
  try {
    socket.emit(CitizenSends.ASK_FOR_HERO_HELP, { lat, lon });
  } catch (error) {
    console.error('Didnt ask for help', error);
  }
};

// Dispatch to the appropriate handler
// socket.on(ClientListensFor.SERVER_UPDATE, serverMsg => {
//   console.log('Received socket msg from server:', serverMsg);
//   const data = serverMsg.data;

//   }
// });

export default socket;
