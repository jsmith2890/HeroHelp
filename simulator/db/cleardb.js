'use strict'

const {db} = require('./index')

db
  .sync({force: true})
  .then(() => {
    console.log('Database has been cleared')
  })
  .finally(() => {
    db.close()
  })
