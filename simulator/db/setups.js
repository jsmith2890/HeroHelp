const { User, Hero, Citizen, Incident, db } = require('./index');
const batman = require('../data/batman.json');

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

module.exports.seedUsers = async (numUsers = 3) => {
  // Creating Users (for login). Can't use bulkCreate for Users or
  // else it won't create salts
  // Also, using await Promise.all sometimes will yield diff order of ids
  for (let i = 0; i < numUsers; i++) {
    // user ids will start at 1
    await User.create({ email: `cody${i}@email.com`, password: '123' });
  }
  console.log(`seeded ${numUsers} users`);
};

module.exports.seedBatman = async () => {
  await Hero.create(batman);
  console.log(`seeded batman`);
};
