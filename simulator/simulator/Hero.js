const { createSocket } = require('./helper');
const {ServerSendsToHero, HeroSends} = require('./MsgType')

class Hero {
  constructor(tickInterval) {
    this.socket = createSocket();
    this.socket.on(ServerSendsToHero.ACK_RECEIVED_HEARTBEAT, evt => this.recvHbAck(evt));
    this.socket.on(ServerSendsToHero.GIVE_DISPATCH, evt => this.recvDispatch(evt));

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

  // Toggle availability
  toggleStatus = () => {
    console.log('hero ', this.socket.id, 'toggleStatus()');
    if (this.status === 'available') {
      this.status = 'unavailable';
    } else {
      this.status = 'available';
    }
    this.sendHb();
  };

  tick = () => {
    this.tickCount++;
    // Only run logic every X number of ticks
    if (this.tickCount % this.tickInterval !== 0) {
      return;
    }
    console.log('hero ', this.socket.id, ' timerHandler()');
    this.sendHb();
  };

  // ========= Handle Incoming Messages =========

  recvHbAck = evt => {
    console.log('hero ', this.socket.id, ' recvHbAck ', evt);
  };

  recvDispatch = evt => {
    console.log('hero ', this.socket.id, ' recvDispatch ', evt);
    this.incidentLat = evt.lat;
    this.incidentLon = evt.lon;
    this.incidentId = evt.incidentId;
  };

  // ========= Outgoing Messages =========

  sendDispatchAccepted = () => {
    console.log('hero ', this.socket.id, ' sendDispatchAccepted ');
    this.socket.emit(HeroSends.TELL_DISPATCH_DECISION, {
      incidentId: this.incidentId,
      status: 'accepted',
    });
  };

  // Send Heartbeat
  sendHb = () => {
    console.log('hero ', this.socket.id, ' sendHb()');
    this.socket.emit(HeroSends.GIVE_HEARTBEAT, {
      lat: this.lat,
      lon: this.lon,
      status: this.status,
    });
  };
}

module.exports = Hero;
