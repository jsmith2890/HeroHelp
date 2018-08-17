import axios from 'axios';
import { ENV_PATH } from '../secrets';

// ACTION TYPES
const GOT_NEW_HERO = 'GOT_NEW_HERO'; //after login
const GOT_INCIDENT = 'GOT_INCIDENT';
const SURROUNDING_INCIDENTS = 'SURROUNDING_INCIDENTS';
const STATUS_HERO = 'STATUS_HERO';

// INITIAL STATE
const defaultState = {
  hero: {}, //email addr, etc
  incident: {}, //lat, lon
  incidents: [], //{lat,lon}
  status: 'IDLE',
};

// ACTION CREATORS
const gotNewHero = hero => ({ type: GOT_NEW_HERO, hero });
export const gotNewIncident = (lat, lon, status) => ({ type: GOT_INCIDENT, lat, lon, status });
export const incidentsInArea = incidents => ({
  type: SURROUNDING_INCIDENTS,
  incidents,
});
export const statusHero = status => ({ type: STATUS_HERO, status });

// THUNK CREATOR
export const addNewHero = hero => async dispatch => {
  try {
    const res = await axios.post(`${ENV_PATH}/api/heroes/add`, { name: hero });
    dispatch(gotNewHero(res.data));
  } catch (err) {
    console.error(err);
  }
};

// REDUCER
export default function (state = defaultState, action) {
  switch (action.type) {
    case GOT_NEW_HERO:
      return {
        ...state,
        hero: action.hero,
      };
    case GOT_INCIDENT:
      return {
        ...state,
        incident: { lat: action.lat, lon: action.lon },
        status: action.status
      };
    case SURROUNDING_INCIDENTS: //no status update needed
      return {
        ...state,
        incidents: action.incidents
      };
    case STATUS_HERO: //simple status updates, socket module will provide value
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
}
