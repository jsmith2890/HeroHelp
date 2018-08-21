import axios from 'axios'
import { ENV_PATH } from '../secrets'

// ACTION TYPES
const GOT_NEW_HERO = 'GOT_NEW_HERO' //after login
const GOT_INCIDENT = 'GOT_INCIDENT'
const SURROUNDING_INCIDENTS = 'SURROUNDING_INCIDENTS'
const STATUS_HERO = 'STATUS_HERO'
const HERO_ENROUTE = 'HERO_ENROUTE'
const UPDATED_HERO_LOCATION = 'UPDATED_HERO_LOCATION'

// INITIAL STATE
const defaultState = {
  hero: {
    latitude: null,
    longitude: null
  }, // lat, lon
  incident: {}, //lat, lon
  incidents: [], //{lat,lon}
  status: 'IDLE',
  enroute: {
    flyingOrDriving: null,
    dispatchAlertReceived: false
  }
}

// ACTION CREATORS
const gotNewHero = hero => ({ type: GOT_NEW_HERO, hero })
export const updatedHeroLocation = location => ({
  type: UPDATED_HERO_LOCATION,
  location
})
export const gotNewIncident = (lat, lon, status) => ({
  type: GOT_INCIDENT,
  lat,
  lon,
  status
})
export const incidentsInArea = incidents => ({
  type: SURROUNDING_INCIDENTS,
  incidents
})
export const statusHero = status => ({ type: STATUS_HERO, status })
export const heroEnrouteResponse = heroResponse => ({
  type: HERO_ENROUTE,
  heroResponse
})

// THUNK CREATOR
export const addNewHero = hero => async dispatch => {
  try {
    const res = await axios.post(`${ENV_PATH}/api/heroes/add`, { name: hero })
    dispatch(gotNewHero(res.data))
  } catch (err) {
    console.error(err)
  }
}

// REDUCER
export default function (state = defaultState, action) {
  switch (action.type) {
    case GOT_NEW_HERO:
      return {
        ...state,
        hero: action.hero
      }
    case GOT_INCIDENT:
      return {
        ...state,
        incident: { lat: action.lat, lon: action.lon },
        status: action.status
      }
    case SURROUNDING_INCIDENTS: //no status update needed
      return {
        ...state,
        incidents: action.incidents
      }
    case STATUS_HERO: //simple status updates, socket module will provide value
      if (action.status === 'ON_SITE') {
        return {
          ...state,
          status: action.status,
          enroute: {
            flyingOrDriving: null,
            dispatchAlertReceived: false
          }
        }
      } else {
        return {
          ...state,
          status: action.status
        }
      }
    case UPDATED_HERO_LOCATION:
      return {
        ...state,
        hero: {
          latitude: action.location.latitude,
          longitude: action.location.longitude
        }
      }
    case HERO_ENROUTE: //indicates dispatch alert received & mode of transportation
      return {
        ...state,
        enroute: {
          flyingOrDriving: action.heroResponse,
          dispatchAlertReceived: true
        }
      }
    default:
      return state
  }
}
