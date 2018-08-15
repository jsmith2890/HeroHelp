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
        lat: 50.00001, // Hero is very close to Citizen's location
        lon: -50.00001,
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
        decision: 'accepted',
      },
    },
    {}, // Wait a little longer for server to recognize Hero on site
    {
      // Ask server to resolve the incident associated with this Hero
      hero: 0,
      action: HeroAction.ASK_RESOLVE_INCIDENT,
    },
  ];

  const tickInterval = 5;
  return new ScenarioEngine(actions, tickInterval, citizens, heroes);
}

module.exports = createScenario;
