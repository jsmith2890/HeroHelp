const { createSocket } = require('./helper');
const {
  NewSocketSends,
  ServerSendsToHero,
  ServerSendsToNewSocket,
  HeroSends,
} = require('./MsgType');

class Hero {
  constructor(tickInterval) {
    this.socket = createSocket();
    this.socket.on(ServerSendsToHero.ACK_RECEIVED_HEARTBEAT, evt =>
      this.recvHbAck(evt)
    );
    this.socket.on(ServerSendsToHero.GIVE_DISPATCH, evt =>
      this.recvDispatch(evt)
    );
    this.socket.on(ServerSendsToNewSocket.TELL_HERO, evt =>
      this.recvUpgradeAck(evt)
    );

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

    // Bindings
    this.toggleStatus = this.toggleStatus.bind(this);
    this.tick = this.tick.bind(this);
    this.recvHbAck = this.recvHbAck.bind(this);
    this.recvDispatch = this.recvDispatch.bind(this);
    this.sendDispatchAccepted = this.sendDispatchAccepted.bind(this);
    this.sendHb = this.sendHb.bind(this);
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

  // ========= Handle Incoming Messages =========

  recvUpgradeAck(evt) {
    console.log('hero ', this.socket.id, 'recvUpgradeAck ', evt);
  }

  recvHbAck(evt) {
    console.log('hero ', this.socket.id, ' recvHbAck ', evt);
  }

  recvDispatch(evt) {
    console.log('hero ', this.socket.id, ' recvDispatch ', evt);
    this.incidentLat = evt.lat;
    this.incidentLon = evt.lon;
    this.incidentId = evt.incidentId;
  }

  // ========= Outgoing Messages =========

  sendUpgradeAsHero() {
    console.log('hero ', this.socket.id, ' sendUpgradeAsHero()')
    this.socket.emit(NewSocketSends.ASK_TO_BE_HERO, {emailAddr: 'cody@email.com'})
  }

  sendDispatchAccepted() {
    console.log('hero ', this.socket.id, ' sendDispatchAccepted ');
    this.socket.emit(HeroSends.TELL_DISPATCH_DECISION, {
      incidentId: this.incidentId,
      status: 'accepted',
    });
  }

  // Send Heartbeat
  sendHb() {
    console.log('hero ', this.socket.id, ' sendHb()');
    this.socket.emit(HeroSends.GIVE_HEARTBEAT, {
      lat: this.lat,
      lon: this.lon,
      status: this.status,
    });
  }
}

module.exports = Hero;
