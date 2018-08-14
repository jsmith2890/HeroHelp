const Sequelize = require('sequelize')
const db = require('../db')

const Citizen = db.define('citizen', {
  state: {
    type: Sequelize.ENUM('IDLE',
                         'WAIT_FOR_HERO_DISPATCH',
                         'KNOWS_HERO_ENROUTE',
                         'KNOWS_HERO_ON_SITE')
  }
})

module.exports = Citizen
