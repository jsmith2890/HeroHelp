import React from 'react'

const Incidents = ({incidents = []}) => {
  return (
    <div>
      <table>
        <thead>
        <tr>
          <th>id</th>
          <th>state</th>
          <th>lat</th>
          <th>lon</th>
          <th>citizenId</th>
          <th>heroId</th>
        </tr>
        </thead>
        <tbody>
          { incidents &&
            incidents.map(incident => {
              return (
                <tr key={incident.id}>
                  <td>{incident.id}</td>
                  <td>{incident.state}</td>
                  <td>{incident.lat}</td>
                  <td>{incident.lon}</td>
                  <td>{incident.citizenId}</td>
                  <td>{incident.heroId}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export default Incidents
