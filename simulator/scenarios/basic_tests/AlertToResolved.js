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
  const citizens = [new Citizen(1)];
  console.log(`==== Created ${citizens.length} Citizens ====`);

  const actions = [
    {
      // Must register as a Hero first for server to listen for Hero msgs
      hero: 0,
      action: HeroAction.ASK_TO_BE_HERO,
      data: { emailAddr: 'cody0@email.com' },
    },
    {
      // Need to ask to be a citizen for server to register citizen msg handlers
      citizen: 0,
      action: CitizenAction.ASK_TO_BE_CITIZEN,
      data: { citizenId: 1 }
    },
    {
      hero: 0,
      action: HeroAction.GIVE_HEARTBEAT,
      data: {
        lat: heroLoc.lat,
        lon: heroLoc.lon,
        availabilityStatus: 'available',
      },
    },
    {
      citizen: 0,
      action: CitizenAction.ASK_FOR_HERO_HELP,
      data: { lat: incidentLoc.lat, lon: incidentLoc.lon}
    },
    {},
    {}, // Empty to wait for dispatch
    ...moveHeroToLocation(
      heroLoc.lat,
      heroLoc.lon,
      incidentLoc.lat,
      incidentLoc.lon,
      3,
      { heroNum: 0, status: 'unavailable' }
    ),
    {},
    {}, // Wait a little for hero to defeat the villain
    {
      // Ask server to resolve the incident associated with this Hero
      hero: 0,
      action: HeroAction.ASK_RESOLVE_INCIDENT,
    }
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
