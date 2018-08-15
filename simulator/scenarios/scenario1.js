const Hero = require('../simulator/Hero');
const Citizen = require('../simulator/Citizen');
const ScenarioEngine = require('../simulator');
const { HeroAction, CitizenAction } = require('../simulator/Actions');

function createScenario() {
  const heroes = [];

  const citizens = [];

  // let scenarios = [];

  // Create a group of heroes

  heroes.push(new Hero(5));
  heroes.push(new Hero(5));
  //heroes.push(new Hero())

  // Create a citizen
  citizens.push(new Citizen(1023));

  // A scenario consists of a list of heroes, citizens. Has a tick function
  // scenario is an array of step objs. Have hero, action
  const actions = [
    // Mark hero at index 0 unavailable, force upcoming request to hero 1
    { hero: 0, action: HeroAction.TOGGLE_AVAILABILITY },
    // Citizen at index 0 requests help, expect ack back to citizen, dispatch message to go to hero 1
    { citizen: 0, action: CitizenAction.ASK_FOR_HERO_HELP },
    // Have hero at index 1 accept the dispatch, expect suphero-on-the-way to citizen from hero 1
    { hero: 1, action: HeroAction.ACCEPT_DISPATCH },
    {}, // Sleep 1 cycle
  ];

  return new ScenarioEngine(actions, 5, citizens, heroes);
}

module.exports = createScenario();
