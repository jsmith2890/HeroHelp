import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import {TableCell} from '@material-ui/core'

const StatusCell = ({state, classes}) => {
  let clazz = 'green'
  if (
    state === 'HERO_ENROUTE' ||
    state === 'ENROUTE' ||
    state === 'KNOWS_HERO_ENROUTE'
  ) {
    clazz = 'yellow'
  } else if (
    state === 'HERO_ON_SITE' ||
    state === 'ON_SITE' ||
    state === 'KNOWS_HERO_ON_SITE'
  ) {
    clazz = 'orange'
  } else if (state === 'RESOLVED') {
    clazz = 'blue'
  }
  return <TableCell className={classes[clazz]}>{state}</TableCell>
}
const styles = () => ({
  green: {
    backgroundColor: '#a7fc53', //'#91ff35'
    fontWeight: 'bold'
  },
  yellow: {
    backgroundColor: 'yellow',
    fontWeight: 'bold'
  },
  orange: {
    backgroundColor: '#ffc43d',
    fontWeight: 'bold'
  },
  blue: {
    backgroundColor: '#adeeff',
    fontWeight: 'bold'
  },
  text: {
    fontWeight: 'bold'
  }
})

export default withStyles(styles)(StatusCell)
