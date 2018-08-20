// =========== Citizen Client ===========
// Msgs that Citizen will send to server
module.exports.CitizenAction = {
  ASK_FOR_HERO_HELP: "ASK_FOR_HERO_HELP", // citizenId, lat, lon
  ASK_TO_BE_CITIZEN: "ASK_TO_BE_CITIZEN"
};

// =========== Hero Client ===========
module.exports.HeroAction = {
  ASK_TO_BE_HERO: "ASK_TO_BE_HERO",
  TOGGLE_AVAILABILITY: "TOGGLE_AVAILABILITY",
  // ACCEPT_DISPATCH: "ACCEPT_DISPATCH",
  GIVE_HEARTBEAT: "GIVE_HEARTBEAT", // lat, lon, availabilityStatus ('available', 'unavailable')
  TELL_DISPATCH_DECISION: "TELL_DISPATCH_DECISION", // incidentId, decision ('accepted', 'declined')
  ASK_RESOLVE_INCIDENT: "ASK_RESOLVE_INCIDENT" // incidentId

};
