const { User, Hero, Citizen, Incident, db } = require('./index');
const batman = require('../data/batman.json');
const sampleIncidents = require('../data/incident.json');
const {
  CitizenState,
  HeroState,
  IncidentState,
} = require('../simulator/MsgType');

// module.exports.clearDBAndCloseConn = () => {
//   db.sync({ force: true })
//     .then(() => {
//       console.log('Database has been cleared');
//     })
//     .finally(() => {
//       db.close();
//     });
// };

module.exports.clearDB = async () => {
  await db.sync({ force: true });
  console.log('Database has been cleared');
};

const seedUsers = async (num = 3) => {
  // Creating Users (for login). Can't use bulkCreate for Users or
  // else it won't create salts
  // Also, using await Promise.all sometimes will yield diff order of ids
  for (let i = 0; i < num; i++) {
    // user ids will start at 1
    await User.create({ email: `cody${i}@email.com`, password: '123' });
  }
  console.log(`seeded ${num} users`);
};
module.exports.seedUsers = seedUsers;

module.exports.seedIncidents = async () => {
  for (let i = 0; i < sampleIncidents.length; i++) {
    await Incident.create(sampleIncidents[i]);
  }
  console.log(`seeded ${sampleIncidents.length} incidents`);
};

// const seedCitizen = async () => {
//   for (let i = 0; i < sampleIncidents.length; i++) {
//     await Incident.create(sampleIncidents[i]);
//   }
//   console.log(`seeded ${sampleIncidents.length} incidents`);
// };
// module.exports.seedCitizen = seedCitizen

const seedBatman = async (fields = {}) => {
  await Hero.create({ ...batman, ...fields });
  console.log(`seeded batman`);
};
module.exports.seedBatman = seedBatman;

const seedOneCitizenOneHero = async (citizenFields = {}, heroFields = {}) => {
  await seedUsers(1);
  await seedBatman(heroFields);
  await Citizen.create({ state: CitizenState.IDLE, ...citizenFields });
  console.log(`seeded 1 citizen and 1 hero (with 1 user)`);
};
module.exports.seedOneCitizenOneHero = seedOneCitizenOneHero;

module.exports.seedEnroute_HeroFar = async (heroLat = 80, heroLon = 80, incidentLat = 20, incidentLon = 20) => {
  await seedOneCitizenOneHero(
    { state: CitizenState.KNOWS_HERO_ENROUTE },
    { presenceLat: 80, presenceLon: 80, state: HeroState.ENROUTE }
  );
  // "state": "WAITING_FOR_DISPATCH",
  // "lat": "42.1",
  // "lon": "-87.7",
  // "citizenId": "1"
  await Incident.create({
    state: IncidentState.HERO_ENROUTE,
    lat: 20,
    lon: 20,
    citizenId: 1,
    heroId: 1,
  });
  console.log(`Seeded 1 incident`);
};
