import axios from 'axios';
import { ENV_PATH } from '../secrets';

// ACTION TYPES
const GOT_NEW_HERO = 'GOT_NEW_HERO';
const GOT_INCIDENT = 'GOT_INCIDENT';
const ARRIVED_AT_INCIDENT = 'ARRIVED_AT_INCIDENT';
const SURROUNDING_INCIDENTS = 'SURROUNDING_INCIDENTS';
const STATUS_DECIDING = 'STATUS_DECIDING';
const STATUS_ENROUTE = 'STATUS_ENROUTE';
const STATUS_ONSITE = 'STATUS_ONSITE';

// INITIAL STATE
const defaultState = {
  heroes: [],
  hero: {},
  incident: {},
  incidents: [],
  status: 'IDLE',
};

// ACTION CREATORS
const gotNewHero = hero => ({ type: GOT_NEW_HERO, hero });
export const gotNewIncident = incident => ({ type: GOT_INCIDENT, incident });
export const changeIncidentStatus = incidentId => ({
  type: ARRIVED_AT_INCIDENT,
  incidentId,
});
export const incidentsInArea = incidents => ({
  type: SURROUNDING_INCIDENTS,
  incidents,
});
export const statusDeciding = status => ({ type: STATUS_DECIDING, status });
export const statusEnrouteHero = status => ({ type: STATUS_ENROUTE, status });
export const statusOnSite = status => ({ type: STATUS_ONSITE, status });

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
export default function(state = defaultState, action) {
  switch (action.type) {
    case GOT_NEW_HERO:
      return {
        ...state,
        hero: action.hero,
      };
    case GOT_INCIDENT:
      return {
        ...state,
        incident: action.incident,
      };

    case ARRIVED_AT_INCIDENT:
      return {
        ...state,
        incident: action.incidentId,
      };
    case SURROUNDING_INCIDENTS:
      return {
        ...state,
        incidents: action.incidents,
      };
    case STATUS_DECIDING:
      return {
        ...state,
        status: action.status,
      };
      case STATUS_ENROUTE:
      return {
        ...state,
        status: action.status,
      };
      case STATUS_ONSITE:
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
}
