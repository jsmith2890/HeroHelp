import React from 'react'
import CustomTable from './customtable'

const Citizens = ({citizens = []}) => {
  return <CustomTable headers={['id', 'state']} dataArr={citizens} />
}

export default Citizens
