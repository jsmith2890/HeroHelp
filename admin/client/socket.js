import io from 'socket.io-client'
import store from './store'
import {gotDataFromServer} from './store/data'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')

  socket.on('DATA', payload => {
    const {heroes, citizens, incidents} = payload
    console.log(`Received ${heroes.length} heroes, ${citizens.length} citizens, ${incidents.length} incidents`)
    // Update redux store with the data
    store.dispatch(gotDataFromServer(payload))
  })
})

export default socket
