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
      hero: 0,
      action: HeroAction.ASK_TO_BE_HERO,
      data: { emailAddr: 'invalid@email.com' },
    },
  ];

  const tickInterval = 5;
  return new ScenarioEngine(actions, tickInterval, citizens, heroes);
}

module.exports = createScenario;
