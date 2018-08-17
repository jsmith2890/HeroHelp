import { ENV_PATH } from '../secrets';

//Action Types

const HERO_ENROUTE = 'HERO_ENROUTE';
const HERO_ARRIVED = 'HERO_ARRIVED'
const STATUS_CITIZEN = 'STATUS_CITIZEN';

// INITIAL STATE
const defaultState = {
  //INCIDENT LOCATION WILL BE KEPT IN COMPONENT PROPS AND
  //WON'T BE CHANGED BY CITIZEN MOVEMENT AFTER HELP REQUESTED
  hero: {}, //lat, lon, heroImage, heroName -- last received location of hero
  status: 'IDLE',
};

// ACTION CREATORS
export const heroArrived = (lat, lon, status) => ({ type: HERO_ARRIVED, lat, lon, status });
export const statusCitizen = status => ({ type: STATUS_CITIZEN, status });
export const heroEnroute = (lat, lon, heroImage, heroName, status) => ({ type: HERO_ENROUTE, lat, lon, heroImage, heroName, status });

// REDUCER
export default function (state = defaultState, action) {
  switch (action.type) {
    case HERO_ENROUTE:
      return {
        ...state,
        hero: { lat: action.lat, lon: action.lon, heroImage: action.heroImage, heroName: action.heroName },
        status: action.status
      };
    case HERO_ARRIVED:
      return {
        ...state,
        hero: { ...state.hero, lat: action.lat, lon: action.lon },
        status: action.status
      };
    case STATUS_CITIZEN:
      //NOTE - STATUS_CITIZEN CAN ONLY BE USED FOR NO ASSIGNED HERO CHANGES
      return {
        ...state,
        hero: {},
        status: action.status,
      };
    default:
      return state;
  }
}
