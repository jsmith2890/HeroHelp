import { Location, Permissions } from 'expo'
import { ENV_SIM_GEO } from '../secrets';

let initialized = false;
let simulation = false;

let simLat = 0;
let simLon = 0;
let heroTicks = 5;

let inMotion = false;
let motionStep = 0;
let originLat = 0;
let originLon = 0;
let destLat = 0;
let destLon = 0;

function doMotionStep() {
  const maxLat = Math.max(originLat, destLat);
  const minLat = Math.min(originLat, destLat);
  const maxLon = Math.max(originLon, destLon);
  const minLon = Math.min(originLon, destLon);
  let stepLat = (maxLat - minLat) / heroTicks;
  if (originLat > destLat) {
    stepLat *= -1
  }
  let stepLon = (maxLon - minLon) / heroTicks;
  if (originLon > destLon) {
    stepLon *= -1
  }
  simLat = simLat + stepLat;
  simLon = simLon + stepLon;
  ++motionStep;
  if (motionStep === heroTicks) {
    //arrived at destination
    inMotion = false;
  }
}

async function getRealGeoLocation() {
  try {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    //assume they say yes
    let location = await Location.getCurrentPositionAsync({})
    return location
  } catch (err) {
    console.error('error retrieving gelocation', err)
    return { location: { coords: { latitude: 0, longitude: 0 } } }
  }
}

export async function getGeoLocation() {

  if (!initialized) {
    if (ENV_SIM_GEO) {
      simulation = true;
      simLat = ENV_SIM_GEO.lat;
      simLon = ENV_SIM_GEO.lon;
      heroTicks = ENV_SIM_GEO.speed;
      //found a lat key so we are going to do simulation
    } else { //use the real deal
      simulation = false;
    }
    initialized = true;
  }

  let location = {};
  if (simulation) {
    if (inMotion) {
      doMotionStep() //simLat and simLon are updated as side-effect
    }
    location = { coords: { latitude: simLat, longitude: simLon } }
  } else {
    location = await getRealGeoLocation()
  }
  return location
}

export function startMotion(lat, lon) {
  inMotion = true;
  originLat = simLat;
  originLon = simLon;
  destLat = lat;
  destLon = lon;
  motionStep = 0;
}
