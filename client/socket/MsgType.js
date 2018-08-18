// ========== New Socket Client ==========
// messages that app will send to identify as citizen or hero
module.exports.NewSocketSends = {
  ASK_TO_BE_HERO: 'ASK_TO_BE_HERO', //token passed to hero on 200 OK LOGIN
  ASK_TO_BE_CITIZEN: 'ASK_TO_BE_CITIZEN', //token saved by app instance
};

// ======== Server to New Socket Client ============
// messages sent in response to new socket client requests
module.exports.ServerSendsToNewSocket = {
  TELL_HERO: 'TELL_HERO', //hero confirmed
  TELL_CITIZEN: 'TELL_CITIZEN', //citizenId
};

// =========== Citizen Client ===========
// Msgs that Citizen will send to server
module.exports.CitizenSends = {
  ASK_FOR_HERO_HELP: 'ASK_FOR_HERO_HELP', // citizenId, lat, lon
};

// =========== Hero Client ===========
module.exports.HeroSends = {
  GIVE_HEARTBEAT: 'GIVE_HEARTBEAT', // lat, lon, availabilityStatus ('available', 'unavailable')
  //note -not worried about a handshake on MVP when hero is dispatched
  ASK_RESOLVE_INCIDENT: 'ASK_RESOLVE_INCIDENT', // incidentId
};

// =========== Server To Citizen ===========
// Msgs that server will send to client
module.exports.ServerSendsToCitizen = {
  ACK_RECEIVED_HELP_REQUEST: 'ACK_RECEIVED_HELP_REQUEST', // No payload -- change state to CitizenState.WAIT_FOR_HERO_DISPATCH
  HERO_ENROUTE: 'HERO_ENROUTE', // lat, lon, heroImage, heroName -- change state to CitizenState.KNOWS_HERO_ENROUTE
  HERO_ON_SITE: 'HERO_ON_SITE', // lat, lon -- change state to CitizenState.KNOWS_HERO_ON_SITE
  INCIDENT_RESOLVED: 'INCIDENT_RESOLVED', // No payload  -- change state to CitizenState.IDLE
};

// =========== Server To Hero ===========
module.exports.ServerSendsToHero = {
  ACK_RECEIVED_HEARTBEAT: 'ACK_RECEIVED_HEARTBEAT', // incidentsArr[{lat, lon}] -- no state change
  GIVE_DISPATCH: 'GIVE_DISPATCH', // lat, lon, //incidentId, timeout(sec), incidentInfo -change state to HeroState.ENROUTE
  HERO_ON_SITE: 'HERO_ON_SITE', //nothing -- just notification to allow client to render CLOSE button -- change state to HeroStatea.ON_SITE
  //no ack dispatch decision -- see cancel-dispatch comment
  ACK_RESOLVE_INCIDENT: 'ACK_RESOLVE_INCIDENT', // No payload -- change state to HeroState.IDLE
};

// ========= Incident States =========
//CLIENT AND SERVER USE
module.exports.HeroState = {
  IDLE: 'IDLE', // (will not receive a dispatch)
  ENROUTE: 'ENROUTE', // (accepted dispatch and on the way)
  ON_SITE: 'ON_SITE', // (made it on site)
};

//CLIENT AND SERVER USE
module.exports.CitizenState = {
  IDLE: 'IDLE', // (can push help button)
  WAIT_FOR_HERO_DISPATCH: 'WAIT_FOR_HERO_DISPATCH', // (waiting for a succesful dispatch to a hero)
  KNOWS_HERO_ENROUTE: 'KNOWS_HERO_ENROUTE', // (hero has accepted and is on the way)
  KNOWS_HERO_ON_SITE: 'KNOWS_HERO_ON_SITE', // (hero has made it on site)
};
