import React from 'react'
import CustomTable from './customtable'

const Incidents = ({incidents = []}) => {
  return (
    <CustomTable
    headers={[
      'id',
      'state',
      'lat',
      'lon',
      'citizenId',
      'heroId'
    ]}
    dataArr={incidents}
  />
  )
}

export default Incidents
