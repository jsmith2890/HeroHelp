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
const Citizens = props => {
  const {classes, citizens} = props

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>ID</CustomTableCell>

            <CustomTableCell>Status</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {citizens.map(citizen => {
            return (
              <TableRow key={citizen.id}>
                <CustomTableCell component="th" scope="hero">
                  {citizen.id}
                </CustomTableCell>
                <StatusCell state={citizen.state} classes={classes} />
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default withStyles(styles)(Citizens)
