// ========== New Socket Client ==========
// messages that app will send to identify as citizen or hero
module.exports.NewSocketSends = {
  ASK_TO_BE_HERO: 'ASK_TO_BE_HERO', //token passed to hero on 200 OK LOGIN
  //REGISTER_AS_CITIZEN: "REGISTER_AS_CITIZEN", //new instance
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
  // ASK_TO_LOG_IN: "ASK_TO_LOG_IN",
  // ASK_TO_REGISTER: "ASK_TO_REGISTER",
  GIVE_HEARTBEAT: 'GIVE_HEARTBEAT', // lat, lon, availabilityStatus ('available', 'unavailable')
  //TELL_DISPATCH_DECISION: 'TELL_DISPATCH_DECISION', // incidentId, decision ('accepted', 'declined')
  //note -not worried about a handshake on MVP when hero is dispatched
  ASK_RESOLVE_INCIDENT: 'ASK_RESOLVE_INCIDENT', // incidentId
};

// =========== Server To Citizen ===========
// Msgs that server will send to client
module.exports.ServerSendsToCitizen = {
  //GIVE_CITIZEN_ID: "GIVE_CITIZEN_ID",
  ACK_RECEIVED_HELP_REQUEST: 'ACK_RECEIVED_HELP_REQUEST', // No payload -- change state to CitizenState.WAIT_FOR_HERO_DISPATCH
  HERO_ENROUTE: 'HERO_ENROUTE', // lat, lon, heroImage, heroName -- change state to CitizenState.KNOWS_HERO_ENROUTE
  HERO_ON_SITE: 'HERO_ON_SITE', // lat, lon -- change state to CitizenState.KNOWS_HERO_ON_SITwE
  INCIDENT_RESOLVED: 'INCIDENT_RESOLVED', // No payload  -- change state to CitizenState.IDLE
  //GIVE_ERROR: "GIVE_ERROR",
};

// =========== Server To Hero ===========
module.exports.ServerSendsToHero = {
  //GIVE_HERO_ID: "GIVE_HERO_ID",
  ACK_RECEIVED_HEARTBEAT: 'ACK_RECEIVED_HEARTBEAT', // incidentsArr[{lat, lon}] -- no state change
  GIVE_DISPATCH: 'GIVE_DISPATCH', // lat, lon, //incidentId, timeout(sec), incidentInfo -change state to HeroState.ENROUTE
  HERO_ON_SITE: 'HERO_ON_SITE', //nothing -- just notification to allow client to render CLOSE button -- change state to HeroStatea.ON_SITE
  //CANCEL_DISPATCH: 'CANCEL_DISPATCH', // incidentId
  //no cancel dispatch with mvp because we're not uber offering
  //ACK_DISPATCH_DECISION: 'ACK_DISPATCH_DECISION', // lat, lon, incidentId
  //no ack dispatch decision -- see cancel-dispatch comment
  ACK_RESOLVE_INCIDENT: 'ACK_RESOLVE_INCIDENT', // No payload -- change state to HeroState.IDLE
  //GIVE_ERROR: "GIVE_ERROR",
};

// ========= Incident States =========
//CLIENT AND SERVER USE
module.exports.HeroState = {
  IDLE: 'IDLE', // (will not receive a dispatch)
  //DECIDING_ON_DISPATCH: 'DECIDING_ON_DISPATCH', // (can accept or reject)
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
