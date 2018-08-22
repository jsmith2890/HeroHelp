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

const styles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 500
  },
  text: {
    fontWeight: 'bold'
  }
})

function Incidents(props) {
  const {classes, incidents} = props
  console.log(incidents[0].hero.imageUrl)
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>ID</CustomTableCell>
            <CustomTableCell>Status</CustomTableCell>
            <CustomTableCell>Latitude</CustomTableCell>
            <CustomTableCell>Longitude</CustomTableCell>
            <CustomTableCell>Citizen ID</CustomTableCell>
            <CustomTableCell>Hero</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidents.map(incident => {
            console.log(incident.hero)
            return (
              <TableRow key={incident.id}>
                <CustomTableCell component="th" scope="incident">
                  {incident.id}
                </CustomTableCell>
                <StatusCell state={incident.state} />
                <CustomTableCell>{incident.lat}</CustomTableCell>
                <CustomTableCell>{incident.lon}</CustomTableCell>
                <CustomTableCell>{incident.citizenId}</CustomTableCell>
                {incident.hero !== null ? (
                  <ImageCell imageUrl={incident.hero.imageUrl} />
                ) : (
                  <CustomTableCell />
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default withStyles(styles)(Incidents)
