const Sequelize = require('sequelize')
const db = require('../db')

const Incident = db.define('incident', {
  state: {
    type: Sequelize.ENUM('CREATED',
                         'WAITING_FOR_HERO_DECISION',
                         'HERO_ENROUTE',
                         'HERO_ON_SITE',
                         'RESOLVED')
  },
  lat: {
    type: Sequelize.FLOAT
  },
  lon: {
    type: Sequelize.FLOAT
  },
})

module.exports = Incident
