const { HeroAction } = require('../simulator/Actions');

// Create a list of actions that will move the hero to the incident
module.exports.moveHeroToLocation = (
  startLat,
  startLon,
  targetLat,
  targetLon,
  steps,
  fields = { heroNum: 0, status: 'unavailable' }
) => {
  const actions = [];
  const maxLat = Math.max(startLat, targetLat);
  const minLat = Math.min(startLat, targetLat);
  const maxLon = Math.max(startLon, targetLon);
  const minLon = Math.min(startLon, targetLon);
  let stepLat = (maxLat - minLat) / steps;
  if (startLat > targetLat) {
    stepLat *= -1
  }
  let stepLon = (maxLon - minLon) / steps;
  if (startLon > targetLon) {
    stepLon *= -1
  }
  for (let i = 0; i <= steps; i++) {
    // startLat
    const nextLat = startLat + stepLat * i;
    const nextLon = startLon + stepLon * i;
    const hbAction = {
      hero: fields.heroNum,
      action: HeroAction.GIVE_HEARTBEAT,
      data: {
        lat: nextLat,
        lon: nextLon,
        status: fields.status,
      },
    };
    actions.push(hbAction);
  }
  return actions;
};
