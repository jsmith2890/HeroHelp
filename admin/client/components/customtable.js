import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  },
  green: {
    backgroundColor: '#a7fc53' //'#91ff35'
  },
  yellow: {
    backgroundColor: 'yellow'
  },
  orange: {
    backgroundColor: '#ffc43d'
  },
  blue: {
    backgroundColor: '#adeeff'
  }
})

const ImageCell = ({imageUrl}) => {
  return (
    <CustomTableCell>
      <img
        style={{height: '50px', width: '50px'}}
        src={`http://localhost:8080/${imageUrl}`}
      />
    </CustomTableCell>
  )
}

const StateCell = ({state, classes}) => {
  let clazz = 'green'
  console.log('state:', state, 'classes:', classes)
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
  return <CustomTableCell className={classes[clazz]}>{state}</CustomTableCell>
}

const CustomTable = ({classes, headers = [], dataArr = []}) => {
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {headers.map(header => {
              return <CustomTableCell key={header}>{header}</CustomTableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataArr &&
            dataArr.map(data => {
              return (
                <TableRow key={data.id}>
                  {headers.map(header => {
                    const val = data[header]
                    if (header === 'imageUrl') {
                      return <ImageCell key={header} imageUrl={val} />
                    } else if (header === 'state') {
                      return (
                        <StateCell key={header} state={val} classes={classes} />
                      )
                    } else {
                      return (
                        <CustomTableCell key={header}>{val}</CustomTableCell>
                      )
                    }
                  })}
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default withStyles(styles)(CustomTable)
