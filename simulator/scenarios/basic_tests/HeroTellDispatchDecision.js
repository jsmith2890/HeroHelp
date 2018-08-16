const Citizen = require('../../simulator/Citizen');
const Hero = require('../../simulator/Hero');
const ScenarioEngine = require('../../simulator');
const { HeroAction, CitizenAction } = require('../../simulator/Actions');

function createScenario() {
  const heroes = [new Hero(5)];
  console.log(`==== Created ${heroes.length} Heroes ====`);

  // Create a citizen
  const citizens = [new Citizen(1023)];
  console.log(`==== Created ${citizens.length} Citizens ====`);

  const actions = [
    {
      // Must register as a Hero first for server to listen for Hero msgs
      hero: 0,
      action: HeroAction.ASK_TO_BE_HERO,
      data: { emailAddr: 'cody@email.com' },
    },
    {
      // Hero indicates they're available
      hero: 0,
      action: HeroAction.GIVE_HEARTBEAT,
      data: {
        lat: 85,     // Hero is NOT close to Citizen's location
        lon: -85,
        status: 'available',
      },
    },
    {
      // Citizen must register as a citizen
      citizen: 0,
      action: CitizenAction.ASK_TO_BE_CITIZEN,
      data: { citizenId: 2 },
    },
    {
      // Citizen requests help
      citizen: 0,
      action: CitizenAction.ASK_FOR_HERO_HELP,
      data: { citizenId: 1, lat: 50, lon: -50 },
    },
    {}, // Wait a little longer for server to send dispatch to Hero
    {
      // Hero tells server their dispatch decision
      hero: 0,
      action: HeroAction.TELL_DISPATCH_DECISION,
      data: {
        incidentId: 1,
        decision: 'accept',
      },
    },
  ];
    /*
  Expected Results

  Client:
    Hero receives TELL_HERO (no payload)
    Hero receives ACK_RECEIVED_HEARTBEAT (lat, lon, status)
    Citizen receives TELL_CITIZEN (no payload)
    Citizen receives ACK_RECEIVED_HELP_REQUEST (no payload)
    Hero receives GIVE_DISPATCH (no payload)  <== doesn't work atm
    Hero receives ACK_DISPATCH_DECISION (lat, lon, incidentId)

  Server:
    Hero ASK_TO_BE_HERO received
    Hero GIVE_HEARTBEAT received
    Database updated with latest heartbeat data
    Citizen ASK_TO_BE_CITIZEN received
    Citizen ASK_HERO_FOR_HELP received
    Create incident and dispatch it to Hero
    Hero TELL_DISPATCH_DECISION received
  */

  const tickInterval = 5;
  return new ScenarioEngine(actions, tickInterval, citizens, heroes);
}

module.exports = createScenario;
