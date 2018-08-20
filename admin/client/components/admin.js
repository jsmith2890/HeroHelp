import React from 'react'
import {connect} from 'react-redux'
import Heroes from './heroes'
import Citizens from './citizens'
import Incidents from './incidents'
import CustomTable from './customtable'


const Admin = ({data}) => {
  return (
    <div>
      <h1>Heroes:</h1>
      {data && data.heroes && <Heroes heroes={data.heroes}/>}
      <h1>Citizens:</h1>
      {data && data.citizens && <Citizens citizens={data.citizens}/>}
      <h1>Incidents:</h1>
      {data && data.incidents && <Incidents incidents={data.incidents}/>}
    </div>
  )
}

const mapStateToProps = ({data}) => ({data})

export default connect(mapStateToProps, null)(Admin)
