const Hero = require('../../simulator/Hero');
const ScenarioEngine = require('../../simulator');
const { HeroAction } = require('../../simulator/Actions');

function createScenario() {
  const heroes = [new Hero(5)];
  console.log(`==== Created ${heroes.length} Heroes ====`);

  // Create a citizen
  const citizens = [];
  console.log(`==== Created ${citizens.length} Citizens ====`);

  const actions = [
    {
      // Must register as a Hero first for server to listen for Hero msgs
      hero: 0,
      action: HeroAction.ASK_TO_BE_HERO,
      data: { emailAddr: 'cody@email.com' },
    },
    {
      hero: 0,
      action: HeroAction.GIVE_HEARTBEAT,
      data: {
        lat: 5,//41.895367,
        lon: 5,//-87.638977,
        availabilityStatus: 'available',
      },
    },
  ];

  /*
  Expected Results

  Client:
    Hero receives TELL_HERO (no payload)
    Hero receives ACK_RECEIVED_HEARTBEAT (array of nearby [lat, lon] incidents, status)

  Server:
    Hero ASK_TO_BE_HERO received
    Hero GIVE_HEARTBEAT received
    Database updated with latest heartbeat data
  */

  const tickInterval = 5;
  return new ScenarioEngine(actions, tickInterval, citizens, heroes);
}

module.exports = createScenario;
