const Sequelize = require('sequelize')
const db = require('../db')

const Incident = db.define('incident', {
  state: {
    type: Sequelize.ENUM('WAITING_FOR_DISPATCH',
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
