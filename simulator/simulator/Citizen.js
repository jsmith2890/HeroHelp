const { createSocket } = require('./helper');
const {
  NewSocketSends,
  ServerSendsToCitizen,
  ServerSendsToNewSocket,
  CitizenSends,
} = require('./MsgType');

class Citizen {
  constructor(applicationId, eventEmitter) {
    // Bindings
    this.registerListeners = this.registerListeners.bind(this);
    this.shutdown = this.shutdown.bind(this);
    this.recvRequestHelpAck = this.recvRequestHelpAck.bind(this);
    this.recvHeroOnTheWay = this.recvHeroOnTheWay.bind(this);
    this.sendRequestHelp = this.sendRequestHelp.bind(this);

    // Set up socket
    this.socket = createSocket();
    this.registerListeners();

    this.eventEmitter = eventEmitter;
    this.lat = 41.9062499;
    this.lon = -87.6515864;
    this.applicationId = applicationId;
  }

  registerListeners() {
    this.socket.on(ServerSendsToNewSocket.TELL_CITIZEN, evt => {
      this.eventEmitter.emit(ServerSendsToNewSocket.TELL_CITIZEN, evt);
      this.recvUpgradeAck(evt);
    });
    this.socket.on(ServerSendsToCitizen.ACK_RECEIVED_HELP_REQUEST, evt => {
      this.eventEmitter.emit(
        ServerSendsToCitizen.ACK_RECEIVED_HELP_REQUEST,
        evt
      );
      this.recvRequestHelpAck(evt);
    });
    this.socket.on(ServerSendsToCitizen.HERO_ENROUTE, evt => {
      this.eventEmitter.emit(ServerSendsToCitizen.HERO_ENROUTE, evt);
      this.recvHeroOnTheWay(evt);
    });
    this.socket.on(ServerSendsToCitizen.HERO_ON_SITE, evt => {
      this.eventEmitter.emit(ServerSendsToCitizen.HERO_ON_SITE, evt);
      console.log(
        'citizen ',
        this.socket.id,
        'HERO_ON_SITE',
        evt
      );
    });
    this.socket.on(ServerSendsToCitizen.INCIDENT_RESOLVED, evt => {
      this.eventEmitter.emit(ServerSendsToCitizen.INCIDENT_RESOLVED, evt);
      console.log(
        'citizen ',
        this.socket.id,
        'INCIDENT_RESOLVED',
        evt
      );
    });
  }

  shutdown() {
    this.socket.disconnect(true);
  }

  // ========= Handle Incoming Messages =========

  recvUpgradeAck(evt) {
    console.log(
      'citizen ',
      this.socket.id,
      'TELL_CITIZEN recvUpgradeAck ',
      evt
    );
  }

  recvRequestHelpAck(evt) {
    console.log(
      'citizen ',
      this.socket.id,
      'ACK_RECEIVED_HELP_REQUEST recvRequestHelpAck ',
      evt
    );
  }

  recvHeroOnTheWay(evt) {
    console.log(
      'citizen',
      this.socket.id,
      'HERO_ENROUTE recvHeroOnTheWay ',
      evt
    );
  }

  // ========= Handle Outgoing Messages =========

  sendUpgradeAsCitizen(data = { citizenId: 3 }) {
    console.log('citizen ', this.socket.id, ' sendUpgradeAsCitizen()');
  }

  sendRequestHelp(
    data = { applicationId: this.applicationId, lat: this.lat, lon: this.lon }
  ) {
    console.log('citizen ', this.socket.id, 'sendRequestHelp()');
    this.socket.emit(CitizenSends.ASK_FOR_HERO_HELP, data);
  }
}

module.exports = Citizen;
