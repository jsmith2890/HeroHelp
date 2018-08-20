const { createSocket, oneStepToLocation } = require('./helper');
const {
  NewSocketSends,
  ServerSendsToHero,
  ServerSendsToNewSocket,
  HeroSends,
  HeroState,
} = require('./MsgType');
const { User, Hero } = require('../db');

// Location of fullstack
const fullstackLat = 41.895367;
const fullstackLon = -87.638977;

// // Bounds (within chicago)
// const minLat = 41.719105;
// const maxLat = 41.99626;
// const minLon = -87.65867;
// const maxLon = -88.036554;

// const isWithinBounds = (lat, lon) => {
//   return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
// };

class HeroClient {
  constructor(jsonHeroData = {}, ticksPerSec = 2) {
    // Bindings
    this.setupDB = this.setupDB.bind(this);
    this.run = this.run.bind(this);
    this.hasBeenSecs = this.hasBeenSecs.bind(this);
    this.behaviorLoop = this.behaviorLoop.bind(this);
    this.shutdown = this.shutdown.bind(this);
    // Socket listeners
    this.recvUpgradeAck = this.recvUpgradeAck.bind(this);
    this.recvHbAck = this.recvHbAck.bind(this);
    this.recvDispatch = this.recvDispatch.bind(this);
    this.recvHeroOnSite = this.recvHeroOnSite.bind(this);
    this.recvAckResolveIncident = this.recvAckResolveIncident.bind(this);
    // Socket senders
    this.sendAskToBeHero = this.sendAskToBeHero.bind(this);
    this.sendHb = this.sendHb.bind(this);

    // How fast to run the behaviorLoop
    this.ticksPerSec = ticksPerSec;
    this.tickCount = 0;

    //superhero local data
    this.jsonHeroData = jsonHeroData;
    this.status = 'available';
    this.lat = fullstackLat;
    this.lon = fullstackLon;
    this.incidentLoc = null; // {lat, lon}
    this.state = HeroState.IDLE;
    this.isLoggedIn = false;
    this.email = '';
  }

  async setupDB() {
    try {
      const heroName = this.jsonHeroData.filename;
      const heroDesc = 'no description';
      this.email = `${heroName}@email.com`;
      const user = await User.create({
        email: this.email,
        password: '123',
      });
      const hero = await Hero.create({
        userId: user.id,
        loginStatus: 'offline',
        name: this.jsonHeroData.name,
        imageUrl: this.jsonHeroData.imageUrl,
        description: heroDesc,
        presenceLat: fullstackLat,
        presenceLon: fullstackLon,
        presenceStatus: 'unavailable',
        state: HeroState.IDLE,
      });
      console.log('Seeded hero in database:', this.jsonHeroData.name);
    } catch (err) {
      console.error(err);
      // We want this to fail if we haven't set up the DB correctly
      throw new Error(err);
    }
  }

  async run() {
    // Set up socket connection and register listeners
    this.socket = createSocket();
    this.registerListeners();

    // Set up database
    await this.setupDB();

    // Run behaviorLoop
    const ms = 1000 / this.ticksPerSec;
    this.loopHandle = setInterval(this.behaviorLoop, ms);
  }

  hasBeenSecs(num) {
    return this.tickCount % (this.ticksPerSec * num) === 0;
  }

  behaviorLoop() {
    this.tickCount++;
    // Check if we're logged
    if (!this.isLoggedIn) {
      // Only ask to be hero every 5 sec to give server time to respond
      this.hasBeenSecs(5) && this.sendAskToBeHero({ emailAddr: this.email });
      return;
    }

    // We're logged in as a Hero at this point
    // *May be some race conditions with checks and incoming data
    if (this.state === HeroState.ENROUTE && this.incidentLoc) {
      // Move closer to the incident
      // 100 mph => 160 kmh
      // Compute distance between current loc and incidentLoc
      const speedKmh = 700 //160
      const [newLat, newLon] = oneStepToLocation(this.lat, this.lon, this.incidentLoc.lat, this.incidentLoc.lon, speedKmh)
      // console.log(`newLatLon:[${newLat},${newLon}]`)
      this.lat = newLat
      this.lon = newLon
    } else if (this.state === HeroState.ON_SITE) {
      // Wait up to 4 sec to resolve the incident
      this.hasBeenSecs(4) && this.sendResolveIncident();
    } else {
      // Move in a random direction
      // TODO
    }

    // Send heartbeat every 1 second
    this.hasBeenSecs(1) && this.sendHb();
  }

  registerListeners() {
    this.socket.on(ServerSendsToNewSocket.TELL_HERO, evt =>
      this.recvUpgradeAck(evt)
    );
    this.socket.on(ServerSendsToHero.ACK_RECEIVED_HEARTBEAT, evt =>
      this.recvHbAck(evt)
    );
    this.socket.on(ServerSendsToHero.GIVE_DISPATCH, evt =>
      this.recvDispatch(evt)
    );
    this.socket.on(ServerSendsToHero.HERO_ON_SITE, evt =>
      this.recvHeroOnSite(evt)
    );
    this.socket.on(ServerSendsToHero.ACK_DISPATCH_DECISION, evt =>
      this.recvAckDispatchDecision(evt)
    );
    this.socket.on(ServerSendsToHero.ACK_RESOLVE_INCIDENT, evt =>
      this.recvAckResolveIncident(evt)
    );
  }

  shutdown() {
    clearInterval(this.loopHandle);
    this.socket.disconnect(true);
  }

  // ========= Handle Incoming Messages =========

  recvUpgradeAck(evt) {
    console.log('hero ', this.socket.id, 'TELL_HERO recvUpgradeAck ', evt);
    this.isLoggedIn = true;
    // Now we're connected to the server, so make ourselves "available"
    this.status = 'available';
  }

  recvHbAck(evt) {
    console.log(
      'hero ',
      this.socket.id,
      'ACK_RECEIVED_HEARTBEAT recvHbAck ',
      evt
    );
  }

  recvDispatch(evt) {
    console.log('hero ', this.socket.id, 'GIVE_DISPATCH recvDispatch ', evt);
    this.incidentLoc = { lat: evt.lat, lon: evt.lon };
    this.state = HeroState.ENROUTE;
  }

  recvHeroOnSite(evt) {
    console.log('hero ', this.socket.id, 'HERO_ON_SITE recvHeroOnSite ', evt);
    this.state = HeroState.ON_SITE;
  }

  recvAckResolveIncident(evt) {
    console.log(
      'hero ',
      this.socket.id,
      'ACK_RESOLVE_INCIDENT recvAckResolveIncident ',
      evt
    );
    this.state = HeroState.IDLE;
    // Clear the incident data
    this.incidentLoc = null;
  }

  // ========= Outgoing Messages =========

  sendAskToBeHero(data = { emailAddr: 'pleasespecify@email.com' }) {
    console.log('hero ', this.socket.id, ' sendAskToBeHero()');
    this.socket.emit(NewSocketSends.ASK_TO_BE_HERO, data);
  }

  // Send Heartbeat
  sendHb(data = { lat: this.lat, lon: this.lon, status: this.status }) {
    console.log(
      'hero ',
      this.socket.id,
      ' sendHb():',
      data.lat,
      data.lon,
      data.status
    );
    this.socket.emit(HeroSends.GIVE_HEARTBEAT, data);
  }

  sendResolveIncident(data = {}) {
    console.log('hero ', this.socket.id, ' sendResolveIncident()');
    this.socket.emit(HeroSends.ASK_RESOLVE_INCIDENT, data);
  }
}

module.exports = HeroClient;
