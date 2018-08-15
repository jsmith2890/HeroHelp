const Hero = require('../../simulator/Hero');
const Citizen = require('../../simulator/Citizen');
const ScenarioEngine = require('../../simulator');
const { HeroAction, CitizenAction } = require('../../simulator/Actions');

function createScenario() {
  const heroes = [];
  console.log(`==== Created ${heroes.length} Heroes ====`);

  // Create a citizen
  const citizens = [new Citizen(1023)];
  console.log(`==== Created ${citizens.length} Citizens ====`);

  const actions = [
    { // Need to ask to be a citizen for server to register citizen msg handlers
      citizen: 0,
      action: CitizenAction.ASK_TO_BE_CITIZEN,
      data: { citizenId: 1 }
    },
    {
      citizen: 0,
      action: CitizenAction.ASK_FOR_HERO_HELP,
    },
  ];

  const tickInterval = 5;
  return new ScenarioEngine(actions, tickInterval, citizens, heroes);
}

module.exports = createScenario;
