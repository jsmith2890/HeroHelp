const router = require('express').Router()
module.exports = router

const {Hero, Citizen, Incident} = require('../db/models')

// router.use('/users', require('./users'))

router.get('/blah', async (req, res, next) => {
  try {
    console.log('Running blah!')
    // console.log('Hero:', Hero, 'Citizen:', Citizen, 'Incident:', Incident)
    const heroes = await Hero.findAll()
    heroes.forEach((hero, index) => {
      console.log(`hero ${index}:`, hero.id, hero.name, hero.state)
    })
    res.send('you found the route!')
  } catch (err) {
    console.error(err)
  }
})


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
