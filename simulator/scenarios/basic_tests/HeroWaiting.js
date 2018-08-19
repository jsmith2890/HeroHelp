const Citizen = require('../../simulator/Citizen');
const Hero = require('../../simulator/Hero');
const ScenarioEngine = require('../../simulator');
const { CitizenAction, HeroAction } = require('../../simulator/Actions');
const { db } = require('../../db');
const { clearDB, seedOneCitizenOneHero } = require('../../db/setups');
const { moveHeroToLocation } = require('../ActionCreator');

const heroLoc = { lat: 80, lon: 80 };
const incidentLoc = { lat: 20, lon: 20 };

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
        lat: 5,
        lon: 5,
        availabilityStatus: 'available',
      },
    },
    ...moveHeroToLocation(
      heroLoc.lat,
      heroLoc.lon,
      incidentLoc.lat,
      incidentLoc.lon,
      300,
      { heroNum: 0, status: 'available' }
    )
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
