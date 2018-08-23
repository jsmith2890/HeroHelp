const Citizen = require('../../simulator/Citizen');
const Hero = require('../../simulator/Hero');
const ScenarioEngine = require('../../simulator');
const { CitizenAction, HeroAction } = require('../../simulator/Actions');
const { db } = require('../../db');
const { clearDB, seedOneCitizenOneHero } = require('../../db/setups');
const { moveHeroToLocation } = require('../ActionCreator');

//const heroLoc = { lat: 41.8949045, lon: -87.6414422 }; //FSA chicago
//const incidentLoc = {lat:41.961025, lon: -87.743337}; //montrose/knox
//apple hq { lat: 37.785834, lon: -122.406417 };

const heroLoc = { lat: 40.7050798, lon: -74.0113544 }; //FSA manhattan
const incidentLoc = {lat: 40.696045, lon: -73.984497}; //tillary and flatbush


const setupDB = async () => {
  // Clear the db
  await clearDB();
  await seedOneCitizenOneHero({}, { presenceStatus: 'available' });
};

const createScenario = () => {
  const heroes = [new Hero()];
  console.log(`==== Created ${heroes.length} Heroes ====`);

  // Create a citizen
  const citizens = [];
  console.log(`==== Created ${citizens.length} Citizens ====`);

  const actions = [
    {
      // Must register as a Hero first for server to listen for Hero msgs
      hero: 0,
      action: HeroAction.ASK_TO_BE_HERO,
      data: { emailAddr: 'cody0@email.com' },
    },
    {
      hero: 0,
      action: HeroAction.GIVE_HEARTBEAT,
      data: {
        lat: 41.8949045,
        lon: -87.6414422,
        availabilityStatus: 'available',
      },
    },
    ...moveHeroToLocation(
      heroLoc.lat,
      heroLoc.lon,
      incidentLoc.lat,
      incidentLoc.lon,
      60,
      { heroNum: 0, status: 'available' }
    ),
    {},
    {},
    {},
    {
      // Ask server to resolve the incident associated with this Hero
      hero: 0,
      action: HeroAction.ASK_RESOLVE_INCIDENT,
    },
    {},
    {},
    {},
    {},
    {},
    {},
    ...moveHeroToLocation(
      heroLoc.lat,
      heroLoc.lon,
      incidentLoc.lat,
      incidentLoc.lon,
      10,
      { heroNum: 0, status: 'available' }
    ),
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
};

const runScenario = async () => {
  try {
    await setupDB();
    createScenario().run();
  } finally {
    db.close();
  }
};

module.exports = runScenario;
