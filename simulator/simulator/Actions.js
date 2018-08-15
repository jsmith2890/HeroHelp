// =========== Citizen Client ===========
// Msgs that Citizen will send to server
module.exports.CitizenAction = {
  ASK_FOR_HERO_HELP: "ASK_FOR_HERO_HELP", // citizenId, lat, lon
};

// =========== Hero Client ===========
module.exports.HeroAction = {
  TOGGLE_AVAILABILITY: "TOGGLE_AVAILABILITY",
  ACCEPT_DISPATCH: "ACCEPT_DISPATCH"
  // ASK_TO_LOG_IN: "ASK_TO_LOG_IN",
  // ASK_TO_REGISTER: "ASK_TO_REGISTER",
  // GIVE_HEARTBEAT: "GIVE_HEARTBEAT", // lat, lon, availabilityStatus ('available', 'unavailable')
  // TELL_DISPATCH_DECISION: "TELL_DISPATCH_DECISION", // incidentId, decision ('accepted', 'declined')
  // ASK_RESOLVE_INCIDENT: "ASK_RESOLVE_INCIDENT" // incidentId

};
