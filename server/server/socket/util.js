const {Citizen,Hero,User,Incident,setIncidentDistance} = require('../db/models')

//common utility functions

//general purpose socket send
module.exports.sendToClient = (socket, event, data) => {
  socket.emit(event, data);
}
/////////////////////////////////////////////////////




///////////////////////////////////////////////////
// figuring out incident distance
function deg2rad(arg) {
  return arg*Math.PI/180;
}

function distanceTwoPoints(lat1,lon1,lat2,lon2) {
  var R = 6371*1000; // Radius of the earth in m
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c / 1000; // Distance in km
  return d;
}
module.exports.distanceTwoPoints = distanceTwoPoints

//caller passes incident and location they want to know distance to.
//incident object is updated with a new key with the distance so
//caller can sort a list of them, etc
module.exports.setIncidentDistance = (incident,lat,lon) => {
  incident.distance = distanceTwoPoints(incident.lat,incident.lon,lat,lon);
}

//caller passes incident and location they want to know distance to.
//incident object is updated with a new key with the distance so
//caller can sort a list of them, etc
module.exports.setHeroDistance = (hero,lat,lon) => {
  hero.distance = distanceTwoPoints(hero.presenceLat,hero.presenceLon,lat,lon);
}
