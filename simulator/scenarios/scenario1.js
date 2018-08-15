const Hero = require('./Hero')
const Citizen = require('./Citizen')
const ScenarioEngine = require('../simulator')


const heroes = [];

const citizens = [];

let scenarios = [];

//create a group of heroes

heroes.push(new Hero(5));
heroes.push(new Hero(5));
//heroes.push(new Hero())

//create a citizen
citizens.push(new Citizen(1023));

const scenario = [
//mark hero 0 unavailable, force upcoming request to hero 1
{ hero: 0, action: 't' },
//citizen requests help, expect ack back to citizen, dispatch message to go to hero 1
{ citizen: 0, action: 'h' },
//have hero 1 accept the dispatch, expect suphero-on-the-way to citizen from hero 1
{ hero: 1, action: 'a' },
{} //sleep 1 cycle
]

const scenario1 = new ScenarioEngine(scenario, 5);

// Push a list of ScenarioEngines
scenarios.push(scenario1);

// A scenario consists of a list of heroes, citizens. Has a tick function
// scenario is an array of step objs. Have hero, action


module.exports = scenario1;
