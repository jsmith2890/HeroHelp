import React from 'react'

const Heroes = ({heroes = []}) => {
  return (
    <div>
      <table>
        <thead>
        <tr>
          <th>id</th>
          <th>loginStatus</th>
          <th>name</th>
          <th>imageUrl</th>
          <th>description</th>
          <th>presenceLat</th>
          <th>presenceLon</th>
          <th>presenceStatus</th>
          <th>state</th>
          <th>userId</th>
        </tr>
        </thead>
        <tbody>
          { heroes &&
            heroes.map(hero => {
              return (
                <tr key={hero.id}>
                  <td>{hero.id}</td>
                  <td>{hero.loginStatus}</td>
                  <td>{hero.name}</td>
                  <td>{hero.imageUrl}</td>
                  <td>{hero.description}</td>
                  <td>{hero.presenceLat}</td>
                  <td>{hero.presenceLon}</td>
                  <td>{hero.presenceStatus}</td>
                  <td>{hero.state}</td>
                  <td>{hero.userId}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export default Heroes
