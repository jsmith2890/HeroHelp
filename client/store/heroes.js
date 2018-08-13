import axios from 'axios'
import {ENV_PATH} from '../secrets'

// ACTION TYPES
const GOT_NEW_HERO = 'GOT_NEW_HERO'

// INITIAL STATE
const defaultState = {
  heroes: [],
  hero: {}
}

// ACTION CREATORS
const gotNewHero = hero => ({type: GOT_NEW_HERO, hero})

// THUNK CREATOR
export const addNewHero = (hero) => async dispatch => {
  try {
    const res = await axios.post(`${ENV_PATH}/api/heroes/add`, {name: hero})
    dispatch(gotNewHero(res.data))
  } catch(err) {
    console.error(err)
  }
}

// REDUCER
export default function(state = defaultState, action) {
  switch(action.type) {
    case GOT_NEW_HERO:
      return {
        ...state,
        hero: action.hero
      }
      default:
        return state
  }
}
