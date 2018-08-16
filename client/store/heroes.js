import axios from 'axios';
import { ENV_PATH } from '../secrets';

// ACTION TYPES
const GOT_NEW_HERO = 'GOT_NEW_HERO';
const GOT_INCIDENT = 'GOT_INCIDENT';
const ARRIVED_AT_INCIDENT = 'ARRIVED_AT_INCIDENT';
const SURROUNDING_INCIDENTS = 'SURROUNDING_INCIDENTS';
// INITIAL STATE
const defaultState = {
  heroes: [],
  hero: {},
  incident: {},
  incidents: [],
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

    default:
      return state;
  }
}
