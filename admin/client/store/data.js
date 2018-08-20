// ========= Actions =======
const GOT_DATA_FROM_SERVER = 'GOT_DATA_FROM_SERVER'

// ========= Action Creators =======
export const gotDataFromServer = data => ({
  type: GOT_DATA_FROM_SERVER,
  data
})

// ========= Reducers =======
const reducer = (state = {}, action) => {
  switch (action.type) {
    case GOT_DATA_FROM_SERVER:
      return action.data
    default:
      return state
  }
}

export default reducer
