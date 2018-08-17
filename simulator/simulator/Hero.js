const { createSocket } = require('./helper');
const {
  NewSocketSends,
  ServerSendsToHero,
  ServerSendsToNewSocket,
  HeroSends,
} = require('./MsgType');

class Hero {
  constructor(tickInterval) {
    // Bindings
    this.toggleStatus = this.toggleStatus.bind(this);
    this.tick = this.tick.bind(this);
    this.shutdown = this.shutdown.bind(this);
    this.recvHbAck = this.recvHbAck.bind(this);
    this.recvDispatch = this.recvDispatch.bind(this);
    this.recvHeroOnSite = this.recvHeroOnSite.bind(this);
    this.recvAckDispatchDecision = this.recvAckDispatchDecision.bind(this);
    this.recvAckResolveIncident = this.recvAckResolveIncident.bind(this);

    this.sendDispatchDecision = this.sendDispatchDecision.bind(this);
    this.sendHb = this.sendHb.bind(this);

    // Set up socket
    this.socket = createSocket();
    this.registerListeners();

    //hb timer
    this.tickInterval = tickInterval; //number of timer ticks between taking action
    this.tickCount = 0;

    //superhero local data
    this.status = 'available';
    this.lat = 41.895367;
    this.lon = -87.638977;
    this.incidentLat = 0;
    this.incidentLon = 0;
    this.incidentId = 0;
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

  // Toggle availability
  toggleStatus() {
    console.log('hero ', this.socket.id, 'toggleStatus()');
    if (this.status === 'available') {
      this.status = 'unavailable';
    } else {
      this.status = 'available';
    }
    this.sendHb();
  }

  tick() {
    this.tickCount++;
    // Only run logic every X number of ticks
    if (this.tickCount % this.tickInterval !== 0) {
      return;
    }
    console.log('hero ', this.socket.id, ' tick()');
    this.sendHb();
  }

  shutdown() {
    this.socket.disconnect(true)
  }

  // ========= Handle Incoming Messages =========

  recvUpgradeAck(evt) {
    console.log('hero ', this.socket.id, 'TELL_HERO recvUpgradeAck ', evt);
  }

  recvHbAck(evt) {
    console.log('hero ', this.socket.id, 'ACK_RECEIVED_HEARTBEAT recvHbAck ', evt);
  }

  recvDispatch(evt) {
    console.log('hero ', this.socket.id, 'GIVE_DISPATCH recvDispatch ', evt);
    this.incidentLat = evt.lat;
    this.incidentLon = evt.lon;
    this.incidentId = evt.incidentId;
  }

  recvHeroOnSite(evt) {
    console.log('hero ', this.socket.id, 'HERO_ON_SITE recvHeroOnSite ', evt);
  }

  recvAckDispatchDecision(evt) {
    console.log('hero ', this.socket.id, 'ACK_DISPATCH_DECISION recvAckDispatchDecision ', evt);
  }

  recvAckResolveIncident(evt) {
    console.log('hero ', this.socket.id, 'ACK_RESOLVE_INCIDENT recvAckResolveIncident ', evt);
  }

  // ========= Outgoing Messages =========

  sendUpgradeAsHero(data = { emailAddr: 'cody@email.com' }) {
    console.log('hero ', this.socket.id, ' sendUpgradeAsHero()');
    this.socket.emit(NewSocketSends.ASK_TO_BE_HERO, data);
  }

  sendDispatchDecision(
    data = {
      incidentId: this.incidentId,
      decision: 'accept',
    }
  ) {
    console.log('hero ', this.socket.id, ' sendDispatchDecision ');
    this.socket.emit(
      HeroSends.TELL_DISPATCH_DECISION,
      data.incidentId,
      data.decision
    );
  }

  // Send Heartbeat
  sendHb(data = { lat: this.lat, lon: this.lon, status: this.status }) {
    console.log('hero ', this.socket.id, ' sendHb()');
    this.socket.emit(HeroSends.GIVE_HEARTBEAT, data);
  }
}

module.exports = Hero;
