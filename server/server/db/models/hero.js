const Sequelize = require('sequelize')
const db = require('../db')

const Hero = db.define('hero', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Hero
