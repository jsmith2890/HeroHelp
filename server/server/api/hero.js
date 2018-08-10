const router = require('express').Router()
const {Hero} = require('../db/models')
module.exports = router

//api/hero

router.post('/add', async (req, res, next) => {
  try {
    const newHero = await Hero.create({
      name: req.body.name
    })
    res.json(newHero)
  } catch (err) {
    next(err)
  }
})
