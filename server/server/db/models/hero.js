const Sequelize = require('sequelize')
const db = require('../db')

const Hero = db.define('hero', {
  loginStatus: {
    type: Sequelize.ENUM('online','offline')
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
  state: {
    type: Sequelize.ENUM('IDLE',
                         'ENROUTE',
                         'ON_SITE')
  },
})

module.exports = Hero
