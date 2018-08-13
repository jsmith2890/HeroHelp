const Sequelize = require('sequelize')
const db = require('../db')

const CivilianProfile = db.define('civilianProfile', {
  websocketId: {
    type: Sequelize.INTEGER
  }
})

module.exports = CivilianProfile
