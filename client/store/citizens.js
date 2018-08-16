import { ENV_PATH } from '../secrets';

//Action Types

const HERO_ASSIGNED = 'HERO_ASSIGNED';
const HERO_HERE = 'HERO_HERE';
const INCIDENT_RESOLVED = 'INCIDENT_RESOLVED';
const STATUS_IDLE = 'STATUS_IDLE';
const STATUS_WAIT_FOR_HERO = 'STATUS_WAIT_FOR_HERO';
const STATUS_HERO_ENROUTE = 'STATUS_HERO_ENROUTE';
const STATUS_HERO_ONSITE = 'STATUS_HERO_ONSITE';

// INITIAL STATE
const defaultState = {
  hero: {},
  status: 'IDLE',
};

// ACTION CREATORS
export const heroAssigned = hero => ({ type: HERO_ASSIGNED, hero });
export const heroArrived = hero => ({ type: HERO_HERE, hero });
export const incidentComplete = () => ({ type: INCIDENT_RESOLVED });
export const statusIdle = status => ({ type: STATUS_IDLE, status });
export const statusWait = status => ({ type: STATUS_WAIT_FOR_HERO, status });
export const statusEnrouteCitizen = status => ({
  type: STATUS_HERO_ENROUTE,
  status,
});
export const statusOnSite = status => ({ type: STATUS_HERO_ONSITE, status });

// REDUCER
export default function(state = defaultState, action) {
  switch (action.type) {
    case HERO_ASSIGNED:
      return {
        ...state,
        hero: action.hero,
      };
    case HERO_HERE:
      return {
        ...state,
        hero: action.hero,
      };
    case INCIDENT_RESOLVED:
      return {
        hero: {},
        status: 'IDLE',
      };
    case STATUS_IDLE:
      return {
        ...state,
        status: action.status,
      };
    case STATUS_WAIT_FOR_HERO:
      return {
        ...state,
        status: action.status,
      };
    case STATUS_HERO_ENROUTE:
      return {
        ...state,
        status: action.status,
      };
    case STATUS_HERO_ONSITE:
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
}
