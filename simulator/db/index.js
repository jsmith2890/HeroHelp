// Pulling the db connection and models from server project
const db = require('../../server/server/db');
const {
  User,
  Hero,
  Citizen,
  Incident,
} = require('../../server/server/db/models');

module.exports = {
  User,
  Hero,
  Citizen,
  Incident,
  db,
};
