import React from 'react'

const Citizens = ({citizens = []}) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>state</th>
          </tr>
        </thead>
        <tbody>
          {citizens &&
            citizens.map(citizen => {
              return (
                <tr key={citizen.id}>
                  <td>{citizen.id}</td>
                  <td>{citizen.state}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export default Citizens
