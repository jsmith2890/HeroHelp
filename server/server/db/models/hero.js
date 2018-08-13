const Sequelize = require('sequelize')
const db = require('../db')


const Hero = db.define('hero', {
  websocketId: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  imageUrl: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  presenceLat: {
    type: Sequelize.FLOAT
  },
  presenceLon: {
    type: Sequelize.FLOAT
  },
  presenceStatus: {
    type: Sequelize.ENUM('available', 'unavailable')
  },
  incidentStatus: {
    type: Sequelize.ENUM('none', 'dispatching', 'assigned')
  },
})

module.exports = Hero
