import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import StatusCell from './statusCell'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core'

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#002239',
    color: theme.palette.common.white
  },
  body: {
    fontSize: 15
  }
}))(TableCell)

const styles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 500
  }
})

function Heroes(props) {
  const {classes, heroes} = props

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>ID</CustomTableCell>
            <CustomTableCell>Name</CustomTableCell>
            <CustomTableCell>Login Status</CustomTableCell>
            <CustomTableCell>Availability</CustomTableCell>
            <CustomTableCell>Latitude</CustomTableCell>
            <CustomTableCell>Longitude</CustomTableCell>
            <CustomTableCell>Status</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {heroes.map(hero => {
            return (
              <TableRow key={hero.id}>
                <CustomTableCell component="th" scope="hero">
                  {hero.id}
                </CustomTableCell>
                <CustomTableCell>{hero.name}</CustomTableCell>
                <CustomTableCell>{hero.loginStatus}</CustomTableCell>
                <CustomTableCell>{hero.presenceStatus}</CustomTableCell>
                <CustomTableCell>{hero.presenceLat}</CustomTableCell>
                <CustomTableCell>{hero.presenceLon}</CustomTableCell>
                <StatusCell state={hero.state} />
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default withStyles(styles)(Heroes)
