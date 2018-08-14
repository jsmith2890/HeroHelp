// ========== New Socket Client ==========
// messages that app will send to identify as citizen or hero
module.exports.NewSocketSends = {
  ASK_AS_HERO: "ASK_AS_HERO", //token passed to hero on 200 OK LOGIN
  REGISTER_AS_CITIZEN: "REGISTER_AS_CITIZEN", //new instance
  ASK_AS_CITIZEN: "ASK_AS_CITIZEN", //token saved by app instance
}

// ======== Server to New Socket Client ============
// messages sent in response to new socket client requests
// AS



// =========== Citizen Client ===========

// Msgs that Citizen will send to server
module.exports.CitizenSends = {
  ASK_FOR_HERO_HELP: "ASK_FOR_HERO_HELP", // citizenId, lat, lon
};

// =========== Hero Client ===========

module.exports.HeroSends = {
  ASK_TO_LOG_IN: "ASK_TO_LOG_IN",
  ASK_TO_REGISTER: "ASK_TO_REGISTER",
  GIVE_HEARTBEAT: "GIVE_HEARTBEAT", // lat, lon, availabilityStatus ('available', 'unavailable')
  TELL_DISPATCH_DECISION: "TELL_DISPATCH_DECISION", // incidentId, decision ('accepted', 'declined')
  ASK_RESOLVE_INCIDENT: "ASK_RESOLVE_INCIDENT" // incidentId
};

// =========== Server To Citizen ===========

// Msgs that server will send to client
module.exports.ServerSendsToCitizen = {
  GIVE_CITIZEN_ID: "GIVE_CITIZEN_ID",
  ACK_RECEIVED_HELP_REQUEST: "ACK_RECEIVED_HELP_REQUEST", // No payload
  HERO_ENROUTE: "HERO_ENROUTE", // lat, lon, heroImage, heroName
  HERO_ON_SITE: "HERO_ON_SITE", // lat, lon
  INCIDENT_RESOLVED: "INCIDENT_RESOLVED", // No payload
  GIVE_ERROR: "GIVE_ERROR",
};

// =========== Server To Hero ===========

module.exports.ServerSendsToHero = {
  GIVE_HERO_ID: "GIVE_HERO_ID",
  ACK_RECEIVED_HEARTBEAT: "ACK_RECEIVED_HEARTBEAT", // incidentsArr[{lat, lon}]
  GIVE_DISPATCH: "GIVE_DISPATCH", // lat, lon, incidentId, timeout(sec), incidentInfo
  HERO_ON_SITE: "HERO_ON_SITE", // lat, lon
  CANCEL_DISPATCH: "CANCEL_DISPATCH", // incidentId
  ACK_DISPATCH_DECISION: "ACK_DISPATCH_DECISION", // lat, lon, incidentId
  ACK_RESOLVE_INCIDENT: "ACK_RESOLVE_INCIDENT", // No payload
  GIVE_ERROR: "GIVE_ERROR",
};

// ========= Incident States =========
module.exports.IncidentState = {
  CREATED: 'CREATED', // (citizen requested help)
  WAITING_FOR_HERO_DECISION: 'WAITING_FOR_HERO_DECISION', // (ask hero to accept or reject)
  HERO_ENROUTE: 'HERO_ENROUTE', // (hero has accepted and is on the way)
  HERO_ON_SITE: 'HERO_ON_SITE', // (hero has made it on site)
  RESOLVED: 'RESOLVED', // (hero has resolved the incident)
}

module.exports.HeroState = {
  IDLE: 'IDLE', // (will not receive a dispatch)
  DECIDING_ON_DISPATCH: 'DECIDING_ON_DISPATCH', // (can accept or reject)
  ENROUTE: 'ENROUTE', // (accepted dispatch and on the way)
  ON_SITE: 'ON_SITE', // (made it on site)
}

module.exports.CitizenState = {
  IDLE: 'IDLE', // (can push help button)
  WAIT_FOR_HERO_DISPATCH: 'WAIT_FOR_HERO_DISPATCH', // (waiting for a succesful dispatch to a hero)
  KNOWS_HERO_ENROUTE: 'KNOWS_HERO_ENROUTE', // (hero has accepted and is on the way)
  KNOWS_HERO_ON_SITE: 'KNOWS_HERO_ON_SITE' // (hero has made it on site)
}
