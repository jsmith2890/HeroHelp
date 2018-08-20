const io = require('socket.io-client');
const { ENV_PATH } = require('../secrets');

if (!ENV_PATH) {
  console.log('You must specify ENV_PATH environment variable');
  process.exit(1);
}

const serverAddr = ENV_PATH; //"http://127.0.0.1:1337";

// Create a websocket connection to the server
module.exports.createSocket = () => {
  // console.log('in createSocket()')
  const socket = io(serverAddr);
  socket.on('connect', () =>
    /*no parms*/ console.log('Socket created with id:', socket.id)
  );
  return socket;
};

const deg2rad = arg => {
  return (arg * Math.PI) / 180;
};

const distanceTwoPoints = (lat1, lon1, lat2, lon2) => {
  var R = 6371 * 1000; // Radius of the earth in m
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = (R * c) / 1000; // Distance in km
  return Math.abs(d);
};

// Bounds (within chicago)
const chicagoMinLat = 41.719105;
const chicagoMaxLat = 41.99626;
const chicagoMinLon = -87.65867;
const chicagoMaxLon = -88.036554;

const isWithinChicagoBounds = (lat, lon) => {
  return lat >= chicagoMinLat && lat <= chicagoMaxLat && lon >= chicagoMinLon && lon <= chicagoMaxLon;
};

// A cheetah runs 93 kmh => ~58mph
// 100 mph => 160 kmh
// Compute distance
// Compute numSteps = distance / speed

const oneStepToLocation = (
  startLat,
  startLon,
  targetLat,
  targetLon,
  speedKmh
) => {
  const distKm = distanceTwoPoints(startLat, startLon, targetLat, targetLon);
  const hoursToDest = distKm / speedKmh
  const secToDest = hoursToDest * 60 * 60
  const numSteps = Math.max(1, secToDest);
  // console.log(`[${startLat},${startLon}] => [${targetLat}, ${targetLon}]`, 'Distance(km):', distKm, 'Num steps to location:', numSteps)

  console.log('Distance(km):', distKm, 'Num steps to location:', numSteps)

  const maxLat = Math.max(startLat, targetLat);
  const minLat = Math.min(startLat, targetLat);
  const maxLon = Math.max(startLon, targetLon);
  const minLon = Math.min(startLon, targetLon);
  let stepLat = (maxLat - minLat) / numSteps; // total diff
  if (startLat > targetLat) {
    stepLat *= -1;
  }
  let stepLon = (maxLon - minLon) / numSteps;
  if (startLon > targetLon) {
    stepLon *= -1;
  }
  const newLat = startLat + stepLat;
  const newLon = startLon + stepLon;
  return [newLat, newLon];
};
module.exports.oneStepToLocation = oneStepToLocation

const randomlyNegate = (num) => {
  const randNum = Math.random()
  return (randNum < .5) ? -num : num
}

module.exports.oneStepInRandomDirection = (
  startLat,
  startLon,
  targetLat,
  targetLon,
  speedKmh
) => {
  const [newLat, newLon] = oneStepToLocation(startLat, startLon, targetLat, targetLon, speedKmh)
  const epsilon = .0001 // .0001 lat degrees is ~10 meters
  const minLat = Math.min(startLat, newLat)
  const maxLat = Math.max(startLat, newLat)
  const minLon = Math.min(startLon, newLon)
  const maxLon = Math.max(startLon, newLon)
  const diffLat = maxLat - minLat
  const diffLon = maxLon - minLon
  // If stepped close enough to destination, return new dest
  if (diffLat <= epsilon && diffLon <= epsilon) {
    // 1 degree is ~111km. Want degree for 100m
    const rangeLat = 1 / (111 / .1)
    // Assume same as lat for simplicity. But it's not accurate
    const rangeLon = rangeLat
    let randLat = randomlyNegate(Math.random() * rangeLat)
    let randLon = randomlyNegate(Math.random() * rangeLon)
    const newDestLat = newLat + randLat
    const newDestLon = newLon + randLon
    // Check if within Chicago bounds
    // TODO may need some tweaks
    if (isWithinChicagoBounds(newDestLat, newDestLon)) {
      return [newLat, newLon, newDestLat, newDestLon]
    }
  }
  return [newLat, newLon, targetLat, targetLon]
}
