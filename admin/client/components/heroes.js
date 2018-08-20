import React from 'react'
import CustomTable from './customtable'

const Heroes = ({heroes = []}) => {
  return (
    <CustomTable
      headers={[
        'id',
        'loginStatus',
        'name',
        'imageUrl',
        'description',
        'presenceLat',
        'presenceLon',
        'presenceStatus',
        'state',
        'userId'
      ]}
      dataArr={heroes}
    />
  )
}

export default Heroes
