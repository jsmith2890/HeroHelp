const router = require('express').Router()
module.exports = router

// router.use('/users', require('./users'))

router.get('/blah', (req, res, next) => {
  try {
    console.log('Running blah!')
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
